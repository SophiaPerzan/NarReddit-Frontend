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
	} else {
		return json({
			status: 'failed',
			message: 'file does not exist'
		});
	}
};
