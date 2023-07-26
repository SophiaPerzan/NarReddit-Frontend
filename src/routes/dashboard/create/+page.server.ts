import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const subreddit = data.get('SUBREDDIT') as string;
		const minPostLength = data.get('MIN_POST_LENGTH') as string;
		const maxPostLength = data.get('MAX_POST_LENGTH') as string;
		const subtitles = (data.get('SUBTITLES') as string) === 'on' ? true : false;
		const randomStart = (data.get('RANDOM_START_TIME') as string) === 'on' ? true : false;
		const bgVideoFileName = data.get('BG_VIDEO_FILENAME') as string;
		const languages = data.getAll('LANGUAGES') as string[];
		const languagesString = languages.join(',');
		const allowedBGVideoFileNames = ['MCParkour.mp4', 'RANDOM'];
		const allowedLanguages = [
			'ENGLISH',
			'SPANISH',
			'FRENCH',
			'ITALIAN',
			'GERMAN',
			'PORTUGUESE',
			'POLISH',
			'HINDI'
		];

		if (subreddit === null) {
			return {
				error: 'Must enter a subreddit',
				SUBTITLES: subtitles,
				RANDOM_START_TIME: randomStart
			};
		}
		if (minPostLength === null) {
			return {
				error: 'Must enter a minimum post length',
				SUBTITLES: subtitles,
				RANDOM_START_TIME: randomStart
			};
		}
		if (!Number.isInteger(Number(minPostLength)) || isNaN(Number(minPostLength))) {
			return {
				error: 'Minimum post length must be a whole number',
				SUBTITLES: subtitles,
				RANDOM_START_TIME: randomStart
			};
		}
		if (Number(minPostLength) < 0) {
			return {
				error: 'Minimum post length must be a positive number',
				SUBTITLES: subtitles,
				RANDOM_START_TIME: randomStart
			};
		}
		if (Number(minPostLength) > Number(maxPostLength)) {
			return {
				error: 'Minimum post length must be less than maximum post length',
				SUBTITLES: subtitles,
				RANDOM_START_TIME: randomStart
			};
		}
		if (maxPostLength === null) {
			return {
				error: 'Must enter a maximum post length',
				SUBTITLES: subtitles,
				RANDOM_START_TIME: randomStart
			};
		}
		if (!Number.isInteger(Number(maxPostLength)) || isNaN(Number(maxPostLength))) {
			return {
				error: 'Maximum post length must be a whole number',
				SUBTITLES: subtitles,
				RANDOM_START_TIME: randomStart
			};
		}
		if (Number(maxPostLength) < 0) {
			return {
				error: 'Maximum post length must be a positive number',
				SUBTITLES: subtitles,
				RANDOM_START_TIME: randomStart
			};
		}
		if (Number(maxPostLength) > 40000) {
			return {
				error: 'Maximum post length must be at most 40000 characters',
				SUBTITLES: subtitles,
				RANDOM_START_TIME: randomStart
			};
		}
		if (bgVideoFileName === null) {
			return {
				error: 'Must select a background video',
				SUBTITLES: subtitles,
				RANDOM_START_TIME: randomStart
			};
		}
		if (!allowedBGVideoFileNames.includes(bgVideoFileName)) {
			return {
				error: 'Must enter a valid background video',
				SUBTITLES: subtitles,
				RANDOM_START_TIME: randomStart
			};
		}
		if (languages.length === 0) {
			return {
				error: 'Must select at least one language',
				SUBTITLES: subtitles,
				RANDOM_START_TIME: randomStart
			};
		}
		if (!languages.every((language) => allowedLanguages.includes(language))) {
			return {
				error: 'Must enter valid languages',
				SUBTITLES: subtitles,
				RANDOM_START_TIME: randomStart
			};
		}
		for (let i = 0; i < languages.length; i++) {
			if (languages.indexOf(languages[i]) !== i) {
				return {
					error: 'Duplicate languages are not allowed',
					SUBTITLES: subtitles,
					RANDOM_START_TIME: randomStart
				};
			}
		}

		const response = await fetch('http://localhost:5000/create', {
			method: 'POST',
			body: JSON.stringify({
				SUBREDDIT: subreddit,
				MIN_POST_LENGTH: minPostLength,
				MAX_POST_LENGTH: maxPostLength,
				SUBTITLES: subtitles,
				RANDOM_START_TIME: randomStart,
				BG_VIDEO_FILENAME: bgVideoFileName,
				LANGUAGES: languagesString
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		console.log(response);

		const { message, task_id } = await response.json();

		return {
			id: task_id,
			message: message,
			SUBTITLES: subtitles,
			RANDOM_START_TIME: randomStart
		};
	}
} satisfies Actions;
