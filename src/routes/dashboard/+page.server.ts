import type { PageServerLoad } from './$types';
import { adminDB } from '$lib/server/admin';

export const load = (async ({ locals }) => {
	const userID = locals.userID!;
	const querySnapshot = await adminDB.collection('videos').where('userID', '==', userID).get();
	const videos = querySnapshot.docs.map((doc) => {
		const data = doc.data();
		data.creationDate = data.creationDate.toDate(); // Convert Timestamp to Date
		return data;
	});

	return { userVideos: videos };
}) satisfies PageServerLoad;
