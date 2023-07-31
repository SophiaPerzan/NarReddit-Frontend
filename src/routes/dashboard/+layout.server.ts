import type { LayoutServerLoad } from './$types';
import { adminAuth } from '$lib/server/admin';
import { error, redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const userID = locals.userID;
	if (userID === null) {
		throw redirect(301, '/signin');
	}
	return {};
}) satisfies LayoutServerLoad;
