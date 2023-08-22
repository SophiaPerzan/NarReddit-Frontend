<script lang="ts">
	import Icon from '@iconify/svelte';
	export let video: FirebaseFirestore.DocumentData;
	export let downloadFunction: (taskID: string) => void;
	export let updateFunction: (taskID: string, index: number) => void;
	export let deleteFunction: (taskID: string, index: number) => void;
	export let index: number;
	const videoBG = video.videoParameters.BG_VIDEO_FILENAME;
	const excludedParams = ['MIN_POST_LENGTH', 'MAX_POST_LENGTH', 'DESCRIPTION'];
	interface VideoParameters {
		BG_VIDEO_FILENAME?: string;
		LANGUAGES?: string;
		// Other potential properties can be defined here.
		[key: string]: string | boolean | number | undefined;
	}
	const vidParams: VideoParameters = Object.fromEntries(
		Object.entries(video.videoParameters).filter(([key]) => !excludedParams.includes(key))
	) as unknown as VideoParameters;

	let src: string;
	if (videoBG === 'RANDOM') {
		src = '/random.webp';
	} else if (videoBG === 'MCParkour.mp4') {
		src = '/minecraft.webp';
	} else if (videoBG === 'SubwaySurfers.mp4') {
		src = '/subwaysurfers.webp';
	} else if (videoBG === 'Mirrors-Edge.mp4') {
		src = '/mirrorsedge.webp';
	} else {
		src = '/random.webp';
	}
</script>

<div class="card lg:card-side bg-neutral shadow-xl max-w-96 sm:w-96 lg:w-auto lg:h-96">
	<figure><img class="h-full w-96 lg:w-auto" {src} alt="Video preview" /></figure>
	<div class="card-body p-6">
		<h2 class="card-title">Video {video.status}</h2>
		<ul class="mb-3">
			{#each Object.keys(vidParams) as param}
				{#if param === 'LANGUAGES'}
					<li>
						Languages:
						<ul class="ml-6 mb-1">
							<li class="text-sm max-w-xs">{vidParams[param]?.replaceAll(',', ', ')}</li>
						</ul>
					</li>
				{:else if param === 'BG_VIDEO_FILENAME'}
					<li>Background video: {vidParams[param]?.replace('.mp4', '')}</li>
				{:else}
					<li class="lg:max-w-xl">{param}: {vidParams[param]}</li>
				{/if}
			{/each}
		</ul>
		<div class="card-actions justify-between mt-auto">
			{#if video.status === 'finished'}
				<button on:click={() => downloadFunction(video.taskID)} class="btn btn-outline btn-accent"
					>Download video</button
				>
			{:else}
				<button
					on:click={() => updateFunction(video.taskID, index)}
					class="btn btn-outline btn-secondary">Update status</button
				>
			{/if}
			<button
				on:click={() => deleteFunction(video.taskID, index)}
				class="btn btn-outline btn-warning px-3"
				><Icon class="text-2xl" icon="material-symbols:delete-outline" /></button
			>
		</div>
	</div>
</div>
