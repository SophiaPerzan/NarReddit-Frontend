import { adminDB, adminStorage, adminStorageBucket } from '$lib/server/admin';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { NARREDDIT_API_KEY } from '$env/static/private';
import { DocumentReference, FieldValue } from 'firebase-admin/firestore';
import { googleVideoClient } from '$lib/server/gcloud';
import pkg from '@google-cloud/video-intelligence/build/protos/protos.js';
import { getMetadata, getStream, ref } from 'firebase/storage';
const { google } = pkg;
const Feature = google.cloud.videointelligence.v1.Feature;
const Likelihood = google.cloud.videointelligence.v1.Likelihood;
const validFilenamePattern = /^[a-zA-Z0-9-_]+\.mp4$/;

//To get the status of the bg video
export const GET: RequestHandler = async ({ request, locals, url }) => {
	const userID = locals.userID!;
	const ID = url.searchParams.get('ID');
	if (!ID) {
		throw new Error('No ID provided');
	}
	// Create a reference to the document with the given ID
	const docRef = adminDB.collection('background-videos').doc(ID);
	// Retrieve the document
	const docSnapshot = await docRef.get();
	if (!docSnapshot.exists) {
		throw new Error('No such document!');
	} else if (docSnapshot.data()?.userID !== userID) {
		throw new Error('Unauthorized');
	} else {
		return json({ status: docSnapshot.data()?.status });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const userID = locals.userID;
		const { bgVidPath } = await request.json();
		const videoFileObject = adminStorageBucket.file(bgVidPath);
		const videoStream = videoFileObject.createReadStream();
		const videoFileMetadata = (await videoFileObject.getMetadata())[0];
		if (!videoFileObject) {
			return json({ error: 'No file uploaded' });
		}
		if (!(videoFileMetadata.contentType === 'video/mp4')) {
			if ((await videoFileObject.exists())[0] === true) {
				videoFileObject.delete();
			}
			return json({ error: 'Invalid file extension. File must be .mp4' });
		}
		if (videoFileMetadata.size > 500000000) {
			if ((await videoFileObject.exists())[0] === true) {
				videoFileObject.delete();
			}
			return json({ error: 'File size too large. File must be less than 500MB' });
		}
		// Check if the filename is well-formed
		const fileName = videoFileMetadata.name.split('/').pop();
		if (!validFilenamePattern.test(fileName)) {
			if ((await videoFileObject.exists())[0] === true) {
				videoFileObject.delete();
			}
			return json({
				error: 'Filename must contain only alphanumeric characters, dashes, and underscores.'
			});
		}
		//const query = await adminDB
		//	.collection('background-videos')
		//	.where('userID', '==', userID)
		//	.where('VideoName', '==', videoFileMetadata.name)
		//	.limit(1)
		//	.get();
		//if (query.empty === false) {
		//	const doc = query.docs[0];
		//	const vidDocData = doc.data();
		//	//If the video is in the pending, uploading, or uploaded state, we can't overwrite it
		//	if (vidDocData.status === 'pending' || vidDocData.status === 'uploading') {
		//		return json({ error: 'A background video with this filename is already being uploaded' });
		//	} else if (vidDocData.status === 'uploaded') {
		//		return json({ error: 'A background video with this filename already exists' });
		//	} else if (vidDocData.status === 'failed') {
		//		//If the video is in the failed state, we can just overwrite it
		//	}
		//}
		let docData = {
			userID: userID,
			VideoName: fileName,
			VideoSize: videoFileMetadata.size,
			status: 'pending',
			creationDate: FieldValue.serverTimestamp()
		};
		const docRef = await adminDB.collection('background-videos').add(docData);
		const docID = docRef.id;

		// Start background processing without awaiting
		processInBackground(videoStream, userID!, docID, fileName);
		// Return a pending status to the client
		return json({ status: 'pending' });
	} catch (error: any) {
		return json({ error: error.message });
	}
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const userID = locals.userID!;
	const { ID } = await request.json();
	// Create a reference to the document with the given ID
	const docRef = adminDB.collection('background-videos').doc(ID);
	// Retrieve the document
	const docSnapshot = await docRef.get();
	if (!docSnapshot.exists) {
		throw new Error('No such document!');
	} else if (docSnapshot.data()?.userID !== userID) {
		throw new Error('Unauthorized');
	} else {
		const fileName = await docSnapshot.data()!.VideoName;
		const gcpFile = adminStorageBucket.file(userID + '/backgrounds/' + fileName);
		//take [0] as that is the result of the promise (if the file exists)
		if ((await gcpFile.exists())[0] === true) {
			await gcpFile.delete();
		}
		await docRef.delete();
		return json({ status: 'success' });
	}
};

async function processInBackground(
	videoStream: NodeJS.ReadableStream,
	userID: string,
	docID: string,
	fileName: string
) {
	const docRef = adminDB.collection('background-videos').doc(docID);
	try {
		const videoBuffer = await streamToBuffer(videoStream);
		const videoFile = new Blob([videoBuffer], { type: 'video/mp4' });
		const isSafe = await safeSearchPassed(videoFile);
		if (isSafe.error || !isSafe.passed) {
			console.log('Video failed safe search');
			if (await docExists(docRef)) await docRef.update({ status: 'failed: content detection' });
			const gcpFile = adminStorageBucket.file(userID + '/backgrounds/' + fileName);
			if ((await gcpFile.exists())[0] === true) {
				await gcpFile.delete();
			}

			if (isSafe.error) {
				console.error(isSafe.error);
			}
			return;
		}
		if (await docExists(docRef)) {
			await docRef.update({ status: 'uploaded' });
		} else {
			const gcpFile = adminStorageBucket.file(userID + '/backgrounds/' + fileName);
			if ((await gcpFile.exists())[0] === true) {
				await gcpFile.delete();
			}
		}
	} catch (error) {
		// Handle any errors that occur during background processing
		if (await docExists(docRef)) await docRef.update({ status: 'failed' });
		console.error(error);
	}
}

async function docExists(docRef: DocumentReference) {
	return (await docRef.get()).exists;
}

async function safeSearchPassed(video: Blob) {
	// Define chunk size (1 MB)
	const chunkSize = 1 * 1024 * 1024;
	const chunks = [];

	// Read the file in chunks
	for (let offset = 0; offset < video.size; offset += chunkSize) {
		const blob = video.slice(offset, offset + chunkSize);
		const arrayBuffer = await blob.arrayBuffer();
		chunks.push(new Uint8Array(arrayBuffer));
	}

	// Concatenate the chunks into a single Uint8Array
	const totalLength = chunks.reduce((total, chunk) => total + chunk.length, 0);
	const uint8Array = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		uint8Array.set(chunk, offset);
		offset += chunk.length;
	}

	const request = {
		inputContent: uint8Array,
		features: [Feature.EXPLICIT_CONTENT_DETECTION]
	};
	// Detects unsafe content
	const [operation] = await googleVideoClient.annotateVideo(request);
	const [operationResult] = await operation.promise();
	if (!operationResult.annotationResults) {
		return { passed: false, error: 'Explicit content detection service unavailable' };
	}
	// Gets unsafe content
	const explicitContentResults = operationResult.annotationResults[0].explicitAnnotation?.frames;
	for (const frame of explicitContentResults || []) {
		if (
			frame.pornographyLikelihood === Likelihood.VERY_LIKELY ||
			frame.pornographyLikelihood === Likelihood.LIKELY
		) {
			console.log(frame);
			return { passed: false };
		}
	}
	return { passed: true };
}

async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
	const chunks: Buffer[] = [];
	for await (const chunk of readableStream) {
		chunks.push(chunk as Buffer);
	}
	return Buffer.concat(chunks);
}
