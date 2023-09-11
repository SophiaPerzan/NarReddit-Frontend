import type { PageServerLoad } from './$types';
import { fetchBackgroundVideos } from '$lib/server/DBQueries';

export const load = (async ({ locals }) => {
	const userID = locals.userID!;
	const videos = await fetchBackgroundVideos(userID);
	return { backgroundVideos: videos };
}) satisfies PageServerLoad;
