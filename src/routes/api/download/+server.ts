import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { taskID } = await request.json();
	const res = await fetch('http://localhost:5000/download/' + taskID, {
		method: 'GET'
	});
	// Check if the fetch was successful
	if (!res.ok) {
		throw new Error('Fetch failed');
	}

	// Get the content type from the fetch response
	const contentType = res.headers.get('Content-Type') || 'application/octet-stream';

	// Get the file data from the fetch response
	const data = await res.arrayBuffer();

	// Create a new response with the file data and appropriate headers
	const fileResponse = new Response(data, {
		headers: {
			'Content-Type': contentType,
			'Content-Disposition': 'attachment' // This header prompts the user to download the file
		}
	});

	return fileResponse;
};
