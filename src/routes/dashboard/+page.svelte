<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	async function updateVideo(taskID: string, video: any) {
		const res = await fetch('api/status/', {
			method: 'POST',
			body: JSON.stringify({
				taskID: taskID
			})
		});
		const resData = await res.json();
		video.status = resData.status;
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
			<div class="flex flex-col text-center bg-base-100">
				<h3 class="text-background-content text-2xl">{video.status}</h3>
				{#if video.status === 'finished'}
					<button on:click={() => downloadVideo(video.taskID)} class="btn btn-outline btn-secondary"
						>Download video</button
					>
				{:else}
					<button
						on:click={() => updateVideo(video.taskID, video)}
						class="btn btn-outline btn-secondary">Update status</button
					>
				{/if}
			</div>
		{/each}
	{:else}
		You have no videos!
	{/if}
</div>
