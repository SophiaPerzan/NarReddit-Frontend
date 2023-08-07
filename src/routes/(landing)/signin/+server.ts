import { adminAuth, adminDB } from '$lib/server/admin';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { idToken } = await request.json();
	const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days

	const decodedIdToken = await adminAuth.verifyIdToken(idToken);
	// Only process if the user just signed in in the last 5 minutes.
	if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
		const cookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
		//TODO: Set secure to true, use SSL
		const options = { maxAge: expiresIn, httpOnly: true, secure: false, path: '/' };

		cookies.set('__session', cookie, options);
		const docRef = adminDB.collection('users').doc(decodedIdToken.uid);
		const doc = await docRef.get();
		if (!doc.exists) {
			await docRef.set({
				userID: decodedIdToken.uid,
				email: decodedIdToken.email
			});
		}
		return json({ status: 'signedIn', success: true });
	} else {
		throw error(401, 'Recent sign in required!');
	}
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	cookies.delete('__session', { path: '/' });
	return json({ status: 'signedOut' });
};
