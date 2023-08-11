import { googleVideoClient } from '$lib/server/gcloud';
import { google } from '@google-cloud/video-intelligence/build/protos/protos';
import type { PageServerLoad, Actions } from './$types';
const Feature = google.cloud.videointelligence.v1.Feature;
const Likelihood = google.cloud.videointelligence.v1.Likelihood;

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
		const isSafe = await safeSearchPassed(videoFile);
		if (isSafe.error) {
			return { error: isSafe.error };
		} else if (!isSafe.passed) {
			return { error: 'Video possibly contains explicit content' };
		}
		return { status: 'success' };
	}
} satisfies Actions;

async function safeSearchPassed(video: File) {
	// Define chunk size (1 MB)
	const chunkSize = 1 * 1024 * 1024;
	const chunks = [];

	// Read the file in chunks
	for (let offset = 0; offset < video.size; offset += chunkSize) {
		const blob = video.slice(offset, offset + chunkSize);
		const arrayBuffer = await blob.arrayBuffer();
		chunks.push(new Uint8Array(arrayBuffer));
	}

	// Concatenate the chunks into a single Uint8Array
	const totalLength = chunks.reduce((total, chunk) => total + chunk.length, 0);
	const uint8Array = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		uint8Array.set(chunk, offset);
		offset += chunk.length;
	}

	const request = {
		inputContent: uint8Array,
		features: [Feature.EXPLICIT_CONTENT_DETECTION]
	};
	// Detects unsafe content
	const [operation] = await googleVideoClient.annotateVideo(request);
	const [operationResult] = await operation.promise();
	if (!operationResult.annotationResults) {
		return { passed: false, error: 'Explicit content detection service unavailable' };
	}
	// Gets unsafe content
	const explicitContentResults = operationResult.annotationResults[0].explicitAnnotation?.frames;
	for (const frame of explicitContentResults || []) {
		if (
			!(
				frame.pornographyLikelihood === Likelihood.VERY_UNLIKELY ||
				frame.pornographyLikelihood === Likelihood.UNLIKELY
			)
		) {
			return { passed: false };
		}
	}
	return { passed: true };
}
