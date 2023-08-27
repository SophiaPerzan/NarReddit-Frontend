import type { RequestHandler } from './$types';
import { NARREDDIT_API_KEY } from '$env/static/private';
import { adminDB, adminStorageBucket } from '$lib/server/admin';
import { getDownloadURL } from 'firebase-admin/storage';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	const userID = locals.userID!;
	const { taskID } = await request.json();
	const query = adminDB
		.collection('videos')
		.where('userID', '==', userID)
		.where('taskID', '==', taskID);
	const snapshot = await query.get();
	if (snapshot.empty) {
		throw new Error('No such document!');
	}
	let docId = snapshot.docs[0].id;

	const fileRef = adminStorageBucket.file(userID + '/videos/' + docId + '.zip');
	const fileExists = await fileRef.exists();
	if (fileExists[0]) {
		const downloadLink = await getDownloadURL(fileRef);
		return json({
			status: 'success',
			downloadLink: downloadLink
		});
	}

	const res = await fetch('http://localhost:5000/download', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Api-Key': NARREDDIT_API_KEY
		},
		body: JSON.stringify({
			DOC_ID: docId
		})
	});
	// Check if the fetch was successful
	if (!res.ok) {
		throw new Error('Fetch failed');
	}

	// Get the content type from the fetch response
	const contentType = res.headers.get('Content-Type') || 'application/octet-stream';

	// Get the content disposition from the fetch response
	const contentDisposition = res.headers.get('Content-Disposition') || 'attachment';

	// Get the file data from the fetch response
	const data = await res.arrayBuffer();

	//get a buffer from the arraybuffer
	const buffer = Buffer.from(data);

	await fileRef.save(buffer, {
		metadata: {
			contentDisposition: contentDisposition
		}
	});
	const downloadLink = await getDownloadURL(fileRef);

	// Create a new response with the file data and appropriate headers
	//const fileResponse = new Response(data, {
	//	headers: {
	//		'Content-Type': contentType,
	//		'Content-Disposition': contentDisposition // This header prompts the user to download the file
	//	}
	//});

	return json({
		status: 'success',
		downloadLink: downloadLink
	});
};
