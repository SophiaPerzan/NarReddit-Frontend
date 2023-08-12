import { adminDB } from '$lib/server/admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { NARREDDIT_API_KEY } from '$env/static/private';

import sharp from 'sharp';

import { googleVisionClient } from '$lib/server/gcloud';
import { fetchBackgroundVideos } from '$lib/server/DBQueries';

type TextContentInputs = {
	ttsEngine: string;
	subtitles: boolean;
	randomStart: boolean;
	bgVideoFileName: string;
	languages: string[];
	contentOrigin: 'text';
	title: string;
	description: string;
	imageFile: File | null;
};

type ScrapedContentInputs = {
	ttsEngine: string;
	subtitles: boolean;
	randomStart: boolean;
	bgVideoFileName: string;
	languages: string[];
	contentOrigin: 'scraped';
	subreddit: string;
	minPostLength: string;
	maxPostLength: string;
	imageFile: File | null;
};

type ContentInputs = TextContentInputs | ScrapedContentInputs | null;

type CommonVideoParameters = {
	TTS_ENGINE: string;
	SUBTITLES: boolean;
	RANDOM_START_TIME: boolean;
	BG_VIDEO_FILENAME: string;
	LANGUAGES: string;
	IMAGE_FILE: File | null;
};

type TextVideoParameters = CommonVideoParameters & {
	CONTENT_ORIGIN: 'text';
	TITLE: string;
	DESCRIPTION: string;
};

type ScrapedVideoParameters = CommonVideoParameters & {
	CONTENT_ORIGIN: 'scraped';
	SUBREDDIT: string;
	MIN_POST_LENGTH: string;
	MAX_POST_LENGTH: string;
};

type VideoParameters = TextVideoParameters | ScrapedVideoParameters;

export const load = (async ({ locals }) => {
	const userID = locals.userID!;
	const backgroundVideos = fetchBackgroundVideos(userID);
	return { backgroundVideos };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ request, locals }) => {
		const userID = locals.userID!;
		const data = await request.formData();
		const inputs = getFormInputs(data);
		const bgVideos = await fetchBackgroundVideos(userID);
		let bgVideoFilenames = ['MCParkour.mp4', 'SubwaySurfers.mp4', 'RANDOM'];
		let userBGVideo = false;
		if (bgVideos.length > 0) {
			bgVideoFilenames = bgVideos.map((video) => video.VideoName);
			bgVideoFilenames.push('RANDOM');
			userBGVideo = true;
		}
		const validationError = await validateInputs(inputs, bgVideoFilenames);

		if (validationError) {
			return validationError; // This will include the error from the content origin
		}
		const languagesString = inputs!.languages.join(',');

		const formData = new FormData();
		let videoParameters: VideoParameters;

		formData.append('TTS_ENGINE', inputs!.ttsEngine);
		formData.append('SUBTITLES', String(inputs!.subtitles));
		formData.append('RANDOM_START_TIME', String(inputs!.randomStart));
		formData.append('BG_VIDEO_FILENAME', inputs!.bgVideoFileName);
		formData.append('LANGUAGES', languagesString);
		formData.append('CONTENT_ORIGIN', inputs!.contentOrigin);
		if (inputs?.imageFile) formData.append('IMAGE_FILE', inputs!.imageFile);
		if (userBGVideo) formData.append('USER_ID', userID);

		if (inputs!.contentOrigin === 'text') {
			videoParameters = {
				TTS_ENGINE: inputs!.ttsEngine,
				SUBTITLES: inputs!.subtitles,
				RANDOM_START_TIME: inputs!.randomStart,
				BG_VIDEO_FILENAME: inputs!.bgVideoFileName,
				LANGUAGES: languagesString,
				CONTENT_ORIGIN: inputs!.contentOrigin,
				TITLE: inputs!.title,
				DESCRIPTION: inputs!.description,
				IMAGE_FILE: inputs!.imageFile
			};

			formData.append('TITLE', inputs!.title);
			formData.append('DESCRIPTION', inputs!.description);
		} else if (inputs!.contentOrigin === 'scraped') {
			videoParameters = {
				TTS_ENGINE: inputs!.ttsEngine,
				SUBTITLES: inputs!.subtitles,
				RANDOM_START_TIME: inputs!.randomStart,
				BG_VIDEO_FILENAME: inputs!.bgVideoFileName,
				LANGUAGES: languagesString,
				CONTENT_ORIGIN: inputs!.contentOrigin,
				SUBREDDIT: inputs!.subreddit,
				MIN_POST_LENGTH: inputs!.minPostLength,
				MAX_POST_LENGTH: inputs!.maxPostLength,
				IMAGE_FILE: inputs!.imageFile
			};

			formData.append('SUBREDDIT', inputs!.subreddit);
			formData.append('MIN_POST_LENGTH', inputs!.minPostLength);
			formData.append('MAX_POST_LENGTH', inputs!.maxPostLength);
		} else {
			// Handle unexpected contentOrigin value
			return { error: 'Invalid content origin. Must be either "text" or "scraped"' };
		}
		const { IMAGE_FILE, ...filteredVideoParameters } = videoParameters;
		const videoDoc = {
			userID: userID,
			creationDate: FieldValue.serverTimestamp(),
			status: 'submitted',
			videoParameters: filteredVideoParameters
		};
		let docRef = await adminDB.collection('videos').add(videoDoc);
		const docID = docRef.id;
		formData.append('DOC_ID', docID);

		const response = await fetch('http://localhost:5000/create', {
			method: 'POST',
			body: formData,
			headers: {
				'Api-Key': NARREDDIT_API_KEY
			}
		});
		const { status, task_id } = await response.json();

		if (status === 'started') {
			await docRef.update({
				status: 'processing',
				taskID: task_id
			});
		}

		return {
			status: status
		};
	}
} satisfies Actions;

function getFormInputs(data: FormData): ContentInputs {
	const contentOrigin = data.get('CONTENT_ORIGIN') as string;

	const imageFile = data.has('IMAGE_FILE') ? (data.get('IMAGE_FILE') as File) : null;
	const commonInputs = {
		ttsEngine: data.get('TTS_ENGINE') as string,
		subtitles: (data.get('SUBTITLES') as string) === 'on' ? true : false,
		randomStart: (data.get('RANDOM_START_TIME') as string) === 'on' ? true : false,
		bgVideoFileName: data.get('BG_VIDEO_FILENAME') as string,
		languages: data.getAll('LANGUAGES') as string[],
		// Get the image file from the form data if it exists
		imageFile: imageFile && imageFile.size > 0 ? imageFile : null
	};

	if (contentOrigin === 'text') {
		return {
			contentOrigin,
			title: data.get('TITLE') as string,
			description: data.get('DESCRIPTION') as string,
			...commonInputs
		};
	} else if (contentOrigin === 'scraped') {
		return {
			contentOrigin,
			subreddit: data.get('SUBREDDIT') as string,
			minPostLength: data.get('MIN_POST_LENGTH') as string,
			maxPostLength: data.get('MAX_POST_LENGTH') as string,
			...commonInputs
		};
	} else {
		return null; // Handle this error condition where contentOrigin is neither 'text' nor 'scraped'
	}
}

async function validateInputs(inputs: ContentInputs, allowedBGVideoFileNames: string[]) {
	if (inputs === null) {
		return { error: 'Invalid content origin. Must be either "text" or "scraped"' };
	}

	const allowedTTSEngines = ['GOOGLE', 'ELEVENLABS'];
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
	if (inputs.imageFile !== null) {
		if (!['image/png', 'image/jpeg'].includes(inputs.imageFile.type)) {
			return { error: 'Invalid file type. Only PNG and JPG are allowed.' };
		}
		if (inputs.imageFile.size > 1000000) {
			return { error: 'File size too large. File must be less than 1MB.' };
		}
		try {
			const arrayBuffer = await inputs.imageFile.arrayBuffer();
			const image = sharp(arrayBuffer);
			const metadata = await image.metadata();

			if (!(metadata.width && metadata.height)) {
				return { error: 'Could not read image dimensions.' };
			}

			if (metadata.width > 864 || metadata.height > 1536) {
				return { error: 'Image dimensions should not exceed 864px x 1536px.' };
			}
			const buffer = await image.toBuffer();
			const safeSearch = await safeSearchPassed(buffer);
			if (!safeSearch) {
				return { error: 'Image must be safe for work.' };
			}
		} catch (err) {
			console.log(err);
			return { error: 'Could not read image.' };
		}
	}

	if (inputs.ttsEngine === null) {
		return {
			error: 'Must select a TTS engine'
		};
	}
	if (!allowedTTSEngines.includes(inputs.ttsEngine)) {
		return {
			error: 'Must enter a valid TTS engine'
		};
	}
	if (inputs.bgVideoFileName === null) {
		return {
			error: 'Must select a background video'
		};
	}
	if (!allowedBGVideoFileNames.includes(inputs.bgVideoFileName)) {
		return {
			error: 'Must enter a valid background video'
		};
	}
	if (inputs.languages.length === 0) {
		return {
			error: 'Must select at least one language'
		};
	}
	if (!inputs.languages.every((language) => allowedLanguages.includes(language))) {
		return {
			error: 'Must enter valid languages'
		};
	}
	for (let i = 0; i < inputs.languages.length; i++) {
		if (inputs.languages.indexOf(inputs.languages[i]) !== i) {
			return {
				error: 'Duplicate languages are not allowed'
			};
		}
	}

	// Content-specific validation logic
	if (inputs.contentOrigin === 'text') {
		if (!inputs.title || !inputs.description) {
			return { error: 'Title and description are required for text input method' };
		}
	} else if (inputs.contentOrigin === 'scraped') {
		if (inputs.subreddit === null) {
			return {
				error: 'Must enter a subreddit'
			};
		}
		if (inputs.minPostLength === null) {
			return {
				error: 'Must enter a minimum post length'
			};
		}
		if (!Number.isInteger(Number(inputs.minPostLength)) || isNaN(Number(inputs.minPostLength))) {
			return {
				error: 'Minimum post length must be a whole number'
			};
		}
		if (Number(inputs.minPostLength) < 0) {
			return {
				error: 'Minimum post length must be a positive number'
			};
		}
		if (Number(inputs.minPostLength) > Number(inputs.maxPostLength)) {
			return {
				error: 'Minimum post length must be less than maximum post length'
			};
		}
		if (inputs.maxPostLength === null) {
			return {
				error: 'Must enter a maximum post length'
			};
		}
		if (!Number.isInteger(Number(inputs.maxPostLength)) || isNaN(Number(inputs.maxPostLength))) {
			return {
				error: 'Maximum post length must be a whole number'
			};
		}
		if (Number(inputs.maxPostLength) < 0) {
			return {
				error: 'Maximum post length must be a positive number'
			};
		}
		if (Number(inputs.maxPostLength) > 40000) {
			return {
				error: 'Maximum post length must be at most 40000 characters'
			};
		}
	}

	return null; // Return null if validation passes
}

async function safeSearchPassed(imageBuffer: Buffer): Promise<boolean> {
	const request = {
		image: { content: imageBuffer }
	};

	const [result] = await googleVisionClient.safeSearchDetection(request);
	const detections = result.safeSearchAnnotation;

	if (!detections) return false; // Handle case when detections is null or undefined

	const adultCheckPassed = detections.adult === 'VERY_UNLIKELY' || detections.adult === 'UNLIKELY';
	const violenceCheckPassed =
		detections.violence === 'VERY_UNLIKELY' || detections.violence === 'UNLIKELY';
	const medicalCheckPassed =
		detections.medical === 'VERY_UNLIKELY' || detections.medical === 'UNLIKELY';
	const spoofCheckPassed = detections.spoof === 'VERY_UNLIKELY' || detections.spoof === 'UNLIKELY';
	const racyCheckPassed = detections.racy === 'VERY_UNLIKELY' || detections.racy === 'UNLIKELY';

	return (
		adultCheckPassed &&
		violenceCheckPassed &&
		medicalCheckPassed &&
		spoofCheckPassed &&
		racyCheckPassed
	);
}
