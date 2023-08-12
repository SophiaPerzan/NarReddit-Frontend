<script lang="ts">
	import Icon from '@iconify/svelte';
	export let index: number;
	export let video: FirebaseFirestore.DocumentData;
	export let updateFunction: (ID: string, index: number) => void;
	export let deleteFunction: (ID: string, index: number) => void;
</script>

<div class="card w-96 bg-neutral shadow-xl">
	<div class="card-body p-6">
		<h2 class="card-title">{video.VideoName}</h2>
		<hr class="border-neutral-content border-opacity-30" />
		<ul>
			<li>Status: {video.status}</li>
			<li>File size: {(video.VideoSize / 1000000).toFixed(2)} MB</li>
		</ul>
		<div class="card-actions justify-end">
			{#if video.status === 'uploaded' || video.status === 'failed'}
				<button
					on:click={() => deleteFunction(video.ID, index)}
					class="btn btn-outline btn-warning px-3"
					><Icon class="text-2xl" icon="material-symbols:delete-outline" /></button
				>
			{:else}
				<button
					on:click={() => updateFunction(video.ID, index)}
					class="btn btn-outline btn-secondary">Update Status</button
				>
			{/if}
		</div>
	</div>
</div>
