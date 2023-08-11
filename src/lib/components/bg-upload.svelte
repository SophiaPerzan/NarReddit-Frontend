<script lang="ts">
	import { enhance } from '$app/forms';
	export let formIdentifier: string;
	let fileBinding: FileList;
</script>

<label
	for={formIdentifier}
	class="flex flex-col items-center justify-center w-full h-64 border-2 border-base-content border-dashed rounded-lg cursor-pointer bg-base-100 border-opacity-20 hover:bg-neutral hover:border-opacity-30"
>
	<div class="flex flex-col items-center justify-center pt-5 pb-6">
		<svg
			class="w-8 h-8 mb-4 text-base-content"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 20 16"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
			/>
		</svg>
		{#if fileBinding && fileBinding.length > 0}
			{#each Array.from(fileBinding) as file}
				<p class="mb-2 text-sm text-base-content font-semibold text-center">
					{file.name}
				</p>
				<p class="text-xs text-base-content text-center">
					{(file.size / 1000000).toFixed(2)} MB
				</p>
			{/each}
		{:else}
			<p class="mb-2 text-sm text-base-content font-semibold">Upload new background video</p>
			<p class="text-xs text-base-content">Up to 1080x1920 resolution</p>
			<p class="text-xs text-base-content">.MP4 (500MB MAX)</p>
		{/if}
	</div>
	<input
		id={formIdentifier}
		name={formIdentifier}
		bind:files={fileBinding}
		type="file"
		class="hidden"
		accept=".mp4"
	/>
</label>
<input type="submit" value="upload" class="btn btn-outline btn-block" />
