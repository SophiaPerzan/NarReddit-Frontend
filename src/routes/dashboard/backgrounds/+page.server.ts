import { googleVideoClient } from '$lib/server/gcloud';
import { google } from '@google-cloud/video-intelligence/build/protos/protos';
import type { PageServerLoad, Actions } from './$types';
import { adminDB } from '$lib/server/admin';
import { NARREDDIT_API_KEY } from '$env/static/private';
import { DocumentReference, FieldValue } from 'firebase-admin/firestore';
const Feature = google.cloud.videointelligence.v1.Feature;
const Likelihood = google.cloud.videointelligence.v1.Likelihood;

export const load = (async ({ locals }) => {
	const userID = locals.userID;
	const querySnapshot = await adminDB
		.collection('background-videos')
		.where('userID', '==', userID)
		.orderBy('creationDate', 'desc')
		.get();
	const videos = querySnapshot.docs.map((doc) => {
		const data = doc.data();
		data.creationDate = data.creationDate.toDate(); // Convert Timestamp to Date
		data.ID = doc.id;
		return data;
	});
	return { backgroundVideos: videos };
}) satisfies PageServerLoad;

export const actions = {
	upload: async ({ request, locals }) => {
		try {
			const userID = locals.userID;
			const data = await request.formData();
			const videoFile = data.has('VIDEO_FILE') ? (data.get('VIDEO_FILE') as File) : null;
			if (!videoFile) {
				return { error: 'No file uploaded' };
			}
			if (!(videoFile.type === 'video/mp4')) {
				return { error: 'Invalid file extension. File must be .mp4' };
			}
			if (videoFile.size > 500000000) {
				return { error: 'File size too large. File must be less than 500MB' };
			}
			const query = await adminDB
				.collection('background-videos')
				.where('userID', '==', userID)
				.where('VideoName', '==', videoFile.name)
				.limit(1)
				.get();
			if (query.empty === false) {
				const doc = query.docs[0];
				const vidDocData = doc.data();
				//If the video is in the pending, uploading, or uploaded state, we can't overwrite it
				if (vidDocData.status === 'pending' || vidDocData.status === 'uploading') {
					return { error: 'A background video with this filename is already being uploaded' };
				} else if (vidDocData.status === 'uploaded') {
					return { error: 'A background video with this filename already exists' };
				} else if (vidDocData.status === 'failed') {
					//If the video is in the failed state, we can just overwrite it
				}
			}
			let docData = {
				userID: userID,
				VideoName: videoFile.name,
				VideoSize: videoFile.size,
				status: 'pending',
				creationDate: FieldValue.serverTimestamp()
			};
			const docRef = await adminDB.collection('background-videos').add(docData);

			// Start background processing without awaiting
			processInBackground(videoFile, userID!, docRef);
			// Return a pending status to the client
			return { status: 'pending' };
		} catch (error: any) {
			return { error: error.message };
		}
	}
} satisfies Actions;

async function processInBackground(videoFile: File, userID: string, docRef: DocumentReference) {
	try {
		const isSafe = await safeSearchPassed(videoFile);
		if (isSafe.error || !isSafe.passed) {
			await docRef.update({ status: 'failed' });
			if (isSafe.error) {
				console.error(isSafe.error);
			}
			return;
		}
		const body = new FormData();
		body.append('VIDEO_FILE', videoFile);
		body.append('USER_ID', userID!);
		await docRef.update({ status: 'uploading' });
		const response = await fetch('http://localhost:5000/background', {
			method: 'POST',
			body: body,
			headers: {
				'Api-Key': NARREDDIT_API_KEY
			}
		});
		const { status } = await response.json();
		if (status === 'success') {
			await docRef.update({ status: 'uploaded' });
			return { status: 'success' };
		} else {
			await docRef.update({ status: 'failed' });
			return { error: 'Error uploading video' };
		}
	} catch (error) {
		// Handle any errors that occur during background processing
		await docRef.update({ status: 'failed' });
		console.error(error);
	}
}

async function safeSearchPassed(video: File) {
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
			!(
				frame.pornographyLikelihood === Likelihood.VERY_UNLIKELY ||
				frame.pornographyLikelihood === Likelihood.UNLIKELY
			)
		) {
			return { passed: false };
		}
	}
	return { passed: true };
}
