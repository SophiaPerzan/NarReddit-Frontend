import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	upload: async ({ request, locals }) => {
		const userID = locals.userID;
		const data = await request.formData();
		const videoFile = data.has('VIDEO_FILE') ? (data.get('VIDEO_FILE') as File) : null;

		if (!videoFile) {
			return { error: 'No file uploaded' };
		}
		if (!(videoFile.type === 'video/mp4')) {
			return { error: 'Invalid file extension. File must be .mp4' };
		}
		if (videoFile.size > 500000000) {
			return { error: 'File size too large. File must be less than 500MB' };
		}

		return { status: 'success' };
	}
} satisfies Actions;
