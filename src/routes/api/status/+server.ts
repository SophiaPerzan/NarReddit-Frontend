import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDB, adminStorageBucket } from '$lib/server/admin';
import { NARREDDIT_API_KEY } from '$env/static/private';
import { VIDEO_PIPELINE_URL } from '$lib';

export const POST: RequestHandler = async ({ request, locals }) => {
	const userID = locals.userID!;
	const { taskID } = await request.json();
	console.log(userID);
	console.log(taskID);
	const query = adminDB
		.collection('videos')
		.where('userID', '==', userID)
		.where('taskID', '==', taskID);
	const snapshot = await query.get();
	if (snapshot.empty) {
		throw new Error('No such document!');
	}
	let docId = snapshot.docs[0].id;
	const res = await fetch(VIDEO_PIPELINE_URL+'/status', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Api-Key': NARREDDIT_API_KEY
		},
		body: JSON.stringify({
			task_id: taskID,
			DOC_ID: docId
		})
	});
	const resData = await res.json();
	let querySnapshot = await adminDB
		.collection('videos')
		.where('userID', '==', userID)
		.where('taskID', '==', taskID)
		.limit(1)
		.get();
	if (querySnapshot.empty) {
		throw new Error('No such document!');
	}
	if (resData.status === 'unknown') {
		//determine if the video exists on gcp storage
		const fileRef = adminStorageBucket.file(userID + '/videos/' + docId + '.zip');
		const fileExists = (await fileRef.exists())[0];
		if (fileExists) {
			querySnapshot.docs[0].ref.update({ status: 'finished' });
			return json({ status: 'finished' });
		} else {
			querySnapshot.docs[0].ref.update({ status: 'failed' });
			return json({ status: 'failed' });
		}
	} else {
		querySnapshot.docs[0].ref.update({ status: resData.status });
		return json({ status: resData.status });
	}
};
