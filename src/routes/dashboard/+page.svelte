<script lang="ts">
	import type { PageData } from './$types';
	import VideoCard from '$lib/components/video-card.svelte';
	export let data: PageData;
	async function updateVideo(taskID: string, index: number) {
		const res = await fetch('api/status/', {
			method: 'POST',
			body: JSON.stringify({
				taskID: taskID
			})
		});
		const resData = await res.json();
		data.userVideos[index].status = resData.status;
	}
	async function downloadVideo(taskID: string) {
		const res = await fetch('api/download/', {
			method: 'POST',
			body: JSON.stringify({
				taskID: taskID
			})
		});
		if (!res.ok) {
			throw new Error('Fetch failed');
		}

		// Create a Blob from the response
		const blob = await res.blob();

		// Create a new URL object from the Blob
		const url = URL.createObjectURL(blob);

		// Create a link element
		const a = document.createElement('a');

		// Set the href to the file URL
		a.href = url;

		// Use the Content-Disposition header to get the original file name
		const contentDisposition = res.headers.get('Content-Disposition');
		if (contentDisposition) {
			const fileName = contentDisposition.split('=')[1];
			a.download = fileName;
		}

		// Append the link to the body
		document.body.appendChild(a);

		// Programmatically click the link to start the download
		a.click();

		// Clean up by removing the link element
		document.body.removeChild(a);
	}
</script>

<div class="flex flex-col items-center gap-4">
	{#if data.userVideos.length > 0}
		You have videos!
		{#each data.userVideos as video, index (video.taskID)}
			<VideoCard downloadFunction={downloadVideo} updateFunction={updateVideo} {video} {index} />
		{/each}
	{:else}
		You have no videos!
	{/if}
</div>
