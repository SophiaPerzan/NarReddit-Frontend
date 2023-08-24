import { adminAuth } from '$lib/server/admin';
import { redirect, type Handle, error } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get('__session');
	try {
		const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie!);
		event.locals.userID = decodedClaims.uid;
	} catch (e) {
		event.locals.userID = null;
	}

	if (event.url.pathname.startsWith('/dashboard') && !event.locals.userID) {
		throw redirect(303, '/signin');
	}

	// Check the content-length to determine the size of the request body
	const bodySize = parseInt(event.request.headers.get('content-length') || '0');

	if (event.url.pathname.startsWith('/dashboard/backgrounds')) {
		if (bodySize > 510 * 1024 * 1024) {
			// 510MB for video uploads
			console.log('video too large');
			throw error(413, 'Video payload too large');
		}
	} else if (event.url.pathname.startsWith('/dashboard/create')) {
		if (bodySize > 2 * 1024 * 1024) {
			// 2MB for image uploads
			console.log('image too large');
			throw error(413, 'Image payload too large');
		}
	} else {
		if (bodySize > 1 * 1024 * 1024) {
			// 1MB default bodysize
			console.log('payload too large');
			throw error(413, 'Payload too large');
		}
	}

	return resolve(event);
}) satisfies Handle;
