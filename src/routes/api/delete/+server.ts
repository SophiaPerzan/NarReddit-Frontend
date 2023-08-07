import { adminDB } from '$lib/server/admin';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

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
	let doc = snapshot.docs[0];
	await doc.ref.delete();
	return json({ status: 'success' });
};
