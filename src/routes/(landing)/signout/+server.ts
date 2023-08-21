import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	const options = { secure: false, path: '/' };
	cookies.delete('__session', options);
	throw redirect(303, '/');
};
