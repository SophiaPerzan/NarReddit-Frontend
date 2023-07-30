import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDB } from '$lib/server/admin';

export const POST: RequestHandler = async ({ request, locals }) => {
	const userID = locals.userID!;
	const { taskID } = await request.json();
	const res = await fetch('http://localhost:5000/status/' + taskID, {
		method: 'GET'
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
	querySnapshot.docs[0].ref.update({ status: resData.task_status });

	return json({ task_status: resData.task_status });
};
