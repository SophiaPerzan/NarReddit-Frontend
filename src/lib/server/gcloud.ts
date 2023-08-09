import {
	GOOGLE_PROJECT_ID,
	GOOGLE_APPLICATION_CREDENTIALS,
	GOOGLE_CLIENT_EMAIL,
	GOOGLE_PRIVATE_KEY
} from '$env/static/private';
import vision from '@google-cloud/vision';
const options = {
	projectId: GOOGLE_PROJECT_ID,
	credentials: {
		client_email: GOOGLE_CLIENT_EMAIL,
		private_key: GOOGLE_PRIVATE_KEY,
		projectId: GOOGLE_PROJECT_ID
	},
	keyFilename: GOOGLE_APPLICATION_CREDENTIALS
};
const credentials = {
	client_email: GOOGLE_CLIENT_EMAIL,
	private_key: GOOGLE_PRIVATE_KEY,
	projectId: GOOGLE_PROJECT_ID
};
export const googleVisionClient = new vision.ImageAnnotatorClient({ credentials });
await googleVisionClient.initialize();
