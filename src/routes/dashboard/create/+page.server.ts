import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		console.log(data.get('SUBTITLES'));
		const subtitles = data.get('SUBTITLES') === 'on' ? true : false;
		const randomStart = data.get('RANDOM_START_TIME') === 'on' ? true : false;
		return { id: 7, SUBTITLES: subtitles, RANDOM_START_TIME: randomStart };
	}
} satisfies Actions;
