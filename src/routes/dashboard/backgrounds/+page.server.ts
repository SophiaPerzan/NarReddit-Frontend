import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	upload: async ({ request, locals }) => {
		if (!locals.userID) return { error: 'unauthorized' };
		return { status: 'success' };
	}
} satisfies Actions;
