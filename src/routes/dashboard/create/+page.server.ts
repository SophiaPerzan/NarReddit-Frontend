import { adminDB } from '$lib/server/admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { NARREDDIT_API_KEY } from '$env/static/private';

import sharp from 'sharp';

import { googleVisionClient } from '$lib/server/gcloud';
import { fetchBackgroundVideos } from '$lib/server/DBQueries';
import { VIDEO_PIPELINE_URL } from '$lib';

enum TTSEngines {
	ELEVENLABS = 'ELEVENLABS',
	GOOGLE = 'GOOGLE'
}

enum LANGUAGES {
	ENGLISH = 'ENGLISH',
	SPANISH = 'SPANISH',
	FRENCH = 'FRENCH',
	ITALIAN = 'ITALIAN',
	GERMAN = 'GERMAN',
	PORTUGUESE = 'PORTUGUESE',
	POLISH = 'POLISH',
	HINDI = 'HINDI'
}

type ElevenLabsInputs = {
	ttsEngine: TTSEngines.ELEVENLABS;
	elevenlabsAPIKey: string;
	elevenlabsVoice?: string;
};

type GoogleTTSInputs = {
	ttsEngine: TTSEngines.GOOGLE;
};

// Create a union type that is the union of the specific TTS engine inputs.
type TTSEngineInputs = ElevenLabsInputs | GoogleTTSInputs;

type TextInputs = {
	contentOrigin: 'text';
	title: string;
	description: string;
};

type ScrapedInputs = {
	contentOrigin: 'scraped';
	subreddit: string;
	minPostLength: string;
	maxPostLength: string;
};

type ContentOriginInputs = TextInputs | ScrapedInputs;

// Define the base properties that are common to all form inputs.
type BaseInputs = {
	subtitles: boolean;
	randomStart: boolean;
	bgVideoFileName: string;
	languages: string[];
	imageFile: File | null;
};

type ContentInputs = BaseInputs & TTSEngineInputs & ContentOriginInputs;

type TextVideoParameters = {
	CONTENT_ORIGIN: 'text';
	TITLE: string;
	DESCRIPTION: string;
};

type ScrapedVideoParameters = {
	CONTENT_ORIGIN: 'scraped';
	SUBREDDIT: string;
	MIN_POST_LENGTH: string;
	MAX_POST_LENGTH: string;
};

type ContentOriginParameters = TextVideoParameters | ScrapedVideoParameters;

type BaseVideoParameters = {
	TTS_ENGINE: string;
	SUBTITLES: boolean;
	RANDOM_START_TIME: boolean;
	BG_VIDEO_FILENAME: string;
	LANGUAGES: string;
	IMAGE_FILE: File | null;
};

type VideoParameters = BaseVideoParameters & ContentOriginParameters;

export const load = (async ({ locals }) => {
	const userID = locals.userID!;
	let backgroundVideos = await fetchBackgroundVideos(userID);
	backgroundVideos = backgroundVideos.filter((video) => video.status === 'uploaded');
	if (backgroundVideos.length === 0) {
		backgroundVideos = (await fetchBackgroundVideos('default')).filter(
			(video) => video.status === 'uploaded'
		);
	}
	return { backgroundVideos };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ request, locals }) => {
		const userID = locals.userID!;
		const data = await request.formData();
		const inputs = getFormInputs(data);
		const userBGVideos = (await fetchBackgroundVideos(userID)).filter((video) => video.status === 'uploaded');

		let bgVideoFilenames = (await fetchBackgroundVideos('default')).map(
			(video) => video.VideoName as string
		);
		bgVideoFilenames.push('RANDOM');

		let userBGVideo = false;
		if (userBGVideos.length > 0) {
			bgVideoFilenames = userBGVideos.map((video) => video.VideoName);
			bgVideoFilenames.push('RANDOM');
			userBGVideo = true;
		}
		const validationError = await validateInputs(inputs, bgVideoFilenames);

		if (validationError) {
			return validationError; // This will include the error from the content origin
		}
		//If we choose a random video, we should select it now so we can send a reference
		//to the file to the video creation pipeline
		if (inputs!.bgVideoFileName === 'RANDOM') {
			//remove random as an option, since we need to send a reference to a file
			let possibleVideos = bgVideoFilenames.filter((videoName) => videoName !== 'RANDOM');
			const randomIndex = Math.floor(Math.random() * possibleVideos.length);
			//get a random filename
			inputs!.bgVideoFileName = possibleVideos[randomIndex];
		}
		//Set the filename to its GCP Storage object name
		if (userBGVideo) {
			inputs!.bgVideoFileName = userID + '/backgrounds/' + inputs!.bgVideoFileName;
		} else {
			inputs!.bgVideoFileName = 'default' + '/backgrounds/' + inputs!.bgVideoFileName;
		}
		const languagesString = inputs!.languages.join(',');

		//The form data we send to the video creation pipeline
		const formData = new FormData();
		let videoParameters: VideoParameters;

		formData.append('TTS_ENGINE', inputs!.ttsEngine);
		formData.append('SUBTITLES', String(inputs!.subtitles));
		formData.append('RANDOM_START_TIME', String(inputs!.randomStart));
		formData.append('BG_VIDEO_FILENAME', inputs!.bgVideoFileName);
		formData.append('LANGUAGES', languagesString);
		formData.append('CONTENT_ORIGIN', inputs!.contentOrigin);
		formData.append('USER_ID', userID);
		if (inputs!.ttsEngine === TTSEngines.ELEVENLABS) {
			formData.append('ELEVENLABS_API_KEY', inputs!.elevenlabsAPIKey);
			if (inputs?.elevenlabsVoice) formData.append('ELEVENLABS_VOICE', inputs!.elevenlabsVoice);
		}

		if (inputs?.imageFile) formData.append('IMAGE_FILE', inputs!.imageFile);

		//The inputs.bgVideoFileName is now a reference to the GCP Storage object, so we want to just
		//get the base filename in order to save that to the DB
		const parts = inputs!.bgVideoFileName.split('/');
		const baseName = parts[parts.length - 1];

		if (inputs!.contentOrigin === 'text') {
			videoParameters = {
				TTS_ENGINE: inputs!.ttsEngine,
				SUBTITLES: inputs!.subtitles,
				RANDOM_START_TIME: inputs!.randomStart,
				BG_VIDEO_FILENAME: baseName,
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
				BG_VIDEO_FILENAME: baseName,
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

		// get videoParams minus Image file
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

		const response = await fetch(VIDEO_PIPELINE_URL+'/create', {
			method: 'POST',
			body: formData,
			headers: {
				'Api-Key': NARREDDIT_API_KEY
			}
		});
		//IF THE VIDEO CREATION API ERRORS, A TASKID MAY NOT BE RETURNED
		//THIS WILL MAKE IT IMPOSSIBLE TO UPDATE AND DELETE THE VIDEO DOC
		const { status, task_id } = await response.json();

		if (!task_id) return { error: 'Video creation pipeline failed' };

		if (status === 'started') {
			await docRef.update({
				status: 'processing',
				taskID: task_id
			});
			let statsDocRef = await adminDB.collection('stats').doc('videos');
			let statsDoc = await statsDocRef.get();
			let totalVids = statsDoc.data()?.totalVideos;
			if (totalVids) {
				statsDocRef.update({ totalVideos: totalVids + 1 });
			}
		}

		return {
			status: status
		};
	}
} satisfies Actions;

// We will use this function to conditionally add the API Key if the ttsEngine is 'ELEVENLABS'.
function getTTSInputs(data: FormData): TTSEngineInputs | null {
	const ttsEngine = data.get('TTS_ENGINE') as string;
	if (ttsEngine === TTSEngines.ELEVENLABS) {
		let inputs: ElevenLabsInputs = {
			ttsEngine: ttsEngine,
			elevenlabsAPIKey: data.get('ELEVENLABS_API_KEY') as string,
			elevenlabsVoice:
				data.get('ELEVENLABS_VOICE') !== null ? (data.get('ELEVENLABS_VOICE') as string) : undefined
		};
		return inputs;
	} else if (ttsEngine === TTSEngines.GOOGLE) {
		let inputs: GoogleTTSInputs = {
			ttsEngine: ttsEngine
		};
		return inputs;
	} else {
		return null;
	}
}

function getContentOriginInputs(data: FormData): ContentOriginInputs | null {
	const contentOrigin = data.get('CONTENT_ORIGIN') as string;
	if (contentOrigin === 'text') {
		let inputs: TextInputs = {
			contentOrigin,
			title: data.get('TITLE') as string,
			description: data.get('DESCRIPTION') as string
		};
		return inputs;
	} else if (contentOrigin === 'scraped') {
		let inputs: ScrapedInputs = {
			contentOrigin,
			subreddit: data.get('SUBREDDIT') as string,
			minPostLength: data.get('MIN_POST_LENGTH') as string,
			maxPostLength: data.get('MAX_POST_LENGTH') as string
		};
		return inputs;
	} else {
		return null;
	}
}

//TODO: Do validation in this function and stop potentially returning null
function getFormInputs(data: FormData): ContentInputs | null {
	let commonInputs: BaseInputs = {
		subtitles: (data.get('SUBTITLES') as string) === 'on',
		randomStart: (data.get('RANDOM_START_TIME') as string) === 'on',
		bgVideoFileName: data.get('BG_VIDEO_FILENAME') as string,
		languages: data.getAll('LANGUAGES') as string[],
		imageFile: data.has('IMAGE_FILE')
			? (data.get('IMAGE_FILE') as File).size > 0
				? (data.get('IMAGE_FILE') as File)
				: null
			: null
	};

	let TTSInputs: TTSEngineInputs | null = getTTSInputs(data);
	if (TTSInputs === null) {
		return null;
	}

	let contentOriginInputs: ContentOriginInputs | null = getContentOriginInputs(data);
	if (contentOriginInputs === null) {
		return null;
	}

	let inputs: ContentInputs = {
		...commonInputs,
		...TTSInputs,
		...contentOriginInputs
	};
	return inputs;
}

async function validateInputs(inputs: ContentInputs | null, allowedBGVideoFileNames: string[]) {
	if (inputs === null) {
		return { error: 'Invalid data submitted' };
	}

	// Create an array from the enum
	const allowedTTSEngines: TTSEngines[] = Object.values(TTSEngines);
	const allowedLanguages: LANGUAGES[] = Object.values(LANGUAGES) as LANGUAGES[];

	if (inputs.imageFile !== null) {
		if (!['image/png', 'image/jpeg'].includes(inputs.imageFile.type)) {
			console.log(inputs);
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
	if (
		inputs.ttsEngine === TTSEngines.ELEVENLABS &&
		(inputs.elevenlabsAPIKey === '' || !inputs.elevenlabsAPIKey)
	) {
		return {
			error: 'Must enter an API Key if using ElevenLabs'
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
	if (!inputs.languages.every(isLanguage)) {
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

// Type guard to check if a string is a key of the LANGUAGES enum
function isLanguage(value: string): value is LANGUAGES {
	return Object.values(LANGUAGES).includes(value as LANGUAGES);
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
	const racyCheckPassed = detections.racy === 'VERY_UNLIKELY' || detections.racy === 'UNLIKELY';

	return adultCheckPassed && violenceCheckPassed && medicalCheckPassed && racyCheckPassed;
}
