import { adminDB } from '$lib/server/admin';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
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
		return json({ status: docSnapshot.data()?.status });
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
		await docRef.delete();
		return json({ status: 'success' });
	}
};
