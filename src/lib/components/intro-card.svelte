<script lang="ts">
	import Icon from '@iconify/svelte';

	export let title: string;
	export let name: string;
	export let views: string;
	export let upvotes: string;
	export let comments: string;
	export let src: string;
	export let heart: boolean;
	export let verified: boolean;
	export let preview = false;
</script>

<div
	class="bg-slate-50 shadow-xl flex flex-col rounded-xl px-4 py-2 min-[570px]:p-6 min-[570px]:pb-4 text-slate-800"
>
	<div class="flex gap-x-3">
		<img src={'data:image/png;base64,' + src} class="rounded-full h-8 min-[570px]:h-11" />
		<div class="flex justify-between gap-x-4 w-full items-center">
			<h6 class:relative={!preview} class:-top-1={!preview}>
				<p
					class="inline min-[430px]:text-lg font-medium"
					class:relative={!preview}
					class:-top-[5px]={!preview}
				>
					{name}
				</p>
				{#if verified}
					<div class="inline" class:relative={!preview} class:-bottom-0.5={!preview}>
						<Icon icon="material-symbols:verified" class="inline text-xl text-blue-500" />
					</div>
				{/if}
			</h6>
			<h6
				class="text-base max-[400px]:hidden min-[400px]:visible"
				class:relative={!preview}
				class:-top-[5px]={!preview}
			>
				<div class="inline" class:relative={!preview} class:-bottom-1={!preview}>
					<Icon icon="ic:baseline-remove-red-eye" class="inline text-xl text-slate-600" />
				</div>
				<p class="inline" class:relative={!preview} class:-top-0.5={!preview}>{views}</p>
			</h6>
		</div>
	</div>
	<div class="max-w-md">
		<h1
			class="font-bold max-[430px]:leading-5 text-xl min-[430px]:text-2xl min-[570px]:text-3xl"
			class:mb-2={preview}
			class:mb-6={!preview}
			class:-mt-1={!preview}
		>
			{title}
		</h1>
	</div>
	<hr class="border-slate-300 border" />
	<div class="flex items-center gap-x-2">
		<div>
			<h6 class="items-center">
				<div class="inline" class:relative={!preview} class:-bottom-0.5={!preview}>
					{#if heart}
						<Icon icon="material-symbols:favorite" class="inline text-xl text-red-600" />
					{:else}
						<Icon icon="bx:bxs-upvote" class="inline text-xl text-red-600" />
					{/if}
				</div>
				<p class="inline relative" class:-top-1={!preview} class:top-0.5={preview}>{upvotes}</p>
			</h6>
		</div>

		<div>
			<h6>
				<div class="inline" class:relative={!preview} class:-bottom-0.5={!preview}>
					<Icon icon="iconamoon:comment-fill" class="inline text-xl text-slate-600" />
				</div>

				<p class="inline relative" class:-top-[3px]={!preview} class:top-0.5={preview}>
					{comments}
				</p>
			</h6>
		</div>
	</div>
</div>
