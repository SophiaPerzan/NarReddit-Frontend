<script lang="ts">
	export let video: FirebaseFirestore.DocumentData;
	export let downloadFunction: (taskID: string) => void;
	export let updateFunction: (taskID: string, index: number) => void;
	export let index: number;
	const videoBG = video.videoParameters.BG_VIDEO_FILENAME;
	const excludedParams = ['MIN_POST_LENGTH', 'MAX_POST_LENGTH'];
	const vidParams = Object.fromEntries(
		Object.entries(video.videoParameters).filter(([key, value]) => !excludedParams.includes(key))
	);
	let src: string;
	if (videoBG === 'RANDOM') {
		src = '/random.webp';
	} else if (videoBG === 'MCParkour.mp4') {
		src = '/minecraft.webp';
	} else if (videoBG === 'SubwaySurfers.mp4') {
		src = '/subwaysurfers.webp';
	} else {
		src = '/random.webp';
	}
</script>

<div class="card lg:card-side bg-neutral shadow-xl w-auto max-w-sm">
	<figure><img {src} alt="Video preview" /></figure>
	<div class="card-body p-6">
		<h2 class="card-title">Video {video.status}</h2>
		<ul class="mb-3">
			{#each Object.keys(vidParams) as param}
				<li>{param}: {vidParams[param]}</li>
			{/each}
		</ul>
		<div class="card-actions justify-end mt-auto">
			{#if video.status === 'finished'}
				<button
					on:click={() => downloadFunction(video.taskID)}
					class="btn btn-outline btn-secondary">Download video</button
				>
			{:else}
				<button
					on:click={() => updateFunction(video.taskID, index)}
					class="btn btn-outline btn-secondary">Update status</button
				>
			{/if}
		</div>
	</div>
</div>
