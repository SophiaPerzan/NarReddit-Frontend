import { adminDB } from '$lib/server/admin';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { NARREDDIT_API_KEY } from '$env/static/private';

//To get the status of the bg video
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
		const fileName = await docSnapshot.data()!.VideoName;
		//could possibly await fetch, but I don't think it's necessary
		fetch('http://localhost:5000/background/delete', {
			method: 'POST',
			body: JSON.stringify({
				FILENAME: fileName,
				USER_ID: userID
			}),
			headers: {
				'Content-Type': 'application/json',
				'Api-Key': NARREDDIT_API_KEY
			}
		});
		await docRef.delete();
		return json({ status: 'success' });
	}
};
