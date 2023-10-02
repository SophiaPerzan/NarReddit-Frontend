<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
	import DashboardAlert from '$lib/components/dashboard-alert.svelte';
	import MaterialSymbolsInfo from '~icons/material-symbols/info';
	import { text } from '@sveltejs/kit';
	export let data: PageData;
	export let form: ActionData;
	let loading = false;
	let showAlert = false;
	const alertTime = 7500;
	enum origins {
		text = 'text',
		scraped = 'scraped'
	}
	let contentOrigin: origins = origins.text;

	enum ttsEngines {
		google = 'GOOGLE',
		elevenlabs = 'ELEVENLABS'
	}
	let ttsEngine: ttsEngines = ttsEngines.google;

	$: if (form) {
		loading = false;
		showAlert = true;
		setTimeout(() => {
			showAlert = false;
		}, alertTime);
	}
	function onSubmit() {
		loading = true;
	}
	let charCount = 0;
	let textInput = '';
	$: charCount = textInput.length;
	const charMax = 5000;
</script>

<form
	method="POST"
	action="?/create"
	enctype="multipart/form-data"
	use:enhance
	on:submit|preventDefault={onSubmit}
	class="form-control w-full max-w-3xl items-center gap-y-4 text-base-content"
>
	<div>
		<span class="label label-text">Input method</span>
		<select
			bind:value={contentOrigin}
			name="CONTENT_ORIGIN"
			class="select select-bordered"
			required
		>
			<option value={origins.text} selected>Text</option>
			<option value={origins.scraped}>Scraped Post</option>
		</select>
	</div>
	{#if contentOrigin === origins.text}
		<div
			in:slide={{ delay: 525 }}
			out:slide
			class="flex flex-col justify-center w-full max-w-3xl items-center gap-y-4"
		>
			<div class="w-full max-w-sm">
				<span class="label label-text">Post title</span>
				<textarea
					name="TITLE"
					placeholder="AITA for not wanting to be a parent?"
					class="textarea textarea-bordered w-full h-24"
					required
				/>
			</div>
			<div class="w-full max-w-xl">
				<span class="label label-text">Post description</span>
				<textarea
					name="DESCRIPTION"
					placeholder="AITA for not wanting to be a parent?"
					class="textarea textarea-bordered w-full h-52"
					class:textarea-error={charCount >= charMax}
					class:border-2={charCount >= charMax}
					required
					maxlength={charMax}
					bind:value={textInput}
				/>
				<label for="DESCRIPTION" class="label">
					<span class="label-text-alt" />
					<span class="label-text-alt" class:text-error={charCount >= charMax}
						>{charCount} / {charMax}</span
					>
				</label>
			</div>
		</div>
	{:else if contentOrigin === origins.scraped}
		<div
			in:slide={{ delay: 525 }}
			out:slide
			class="flex flex-col justify-center w-full max-w-3xl items-center gap-y-4"
		>
			<div class="relative">
				<span class="label label-text">Get the top post from</span>
				<h6 class="text-xl absolute -left-5 top-11">r/</h6>
				<input
					type="text"
					name="SUBREDDIT"
					placeholder="AmITheAsshole"
					class="input input-bordered"
					required
				/>
			</div>
			<div>
				<span class="label label-text">Minimum character count</span>
				<input
					type="number"
					name="MIN_POST_LENGTH"
					placeholder="0"
					class="input input-bordered"
					required
					max="5000"
					min="0"
				/>
			</div>
			<div>
				<span class="label label-text">Maximum character count</span>
				<input
					type="number"
					name="MAX_POST_LENGTH"
					placeholder="5,000"
					class="input input-bordered"
					required
					max="5000"
					min="0"
				/>
			</div>
		</div>
	{/if}

	<div class="flex flex-col items-center">
		<span class="label label-text">Text-To-Speech Provider</span>
		<select bind:value={ttsEngine} name="TTS_ENGINE" class="select select-bordered" required>
			<option value="GOOGLE" selected>GoogleTTS Standard</option>
			<option value="ELEVENLABS">ElevenLabs</option>
		</select>
	</div>
	{#if ttsEngine === ttsEngines.elevenlabs}
		<div in:slide out:slide class="flex flex-col items-center">
			<a
				href="https://docs.elevenlabs.io/api-reference/quick-start/authentication"
				target="_blank"
				rel="noopener noreferrer"
				class="label label-text gap-x-1 relative"
				>ElevenLabs API Key<MaterialSymbolsInfo class="inline relative top-px" /></a
			>
			<input required type="text" name="ELEVENLABS_API_KEY" class="input input-bordered" />
			<span class="label label-text text-warning">ElevenLabs account must be on a paid tier</span>
		</div>
	{/if}
	<div class="flex flex-col items-center">
		<span class="label label-text">Randomize background video starting point</span>
		<input type="checkbox" name="RANDOM_START_TIME" class="toggle" />
	</div>
	<div>
		<span class="label label-text">Background video</span>
		<select name="BG_VIDEO_FILENAME" class="select select-bordered" required>
			<option value="RANDOM" selected>Random</option>
			{#if data.backgroundVideos.length === 0}
				<option value="MCParkour.mp4">Minecraft Parkour</option>
				<option value="SubwaySurfers.mp4">Subway Surfers</option>
				<option value="Mirrors-Edge.mp4">Mirror's Edge</option>
			{/if}
			{#each data.backgroundVideos as video}
				<option value={video.VideoName}>{video.VideoName.replace('.mp4', '')}</option>
			{/each}
		</select>
	</div>
	<div>
		<h3 class="text-2xl my-2">Languages</h3>
		<label class="label cursor-pointer nd">
			<input
				type="checkbox"
				name="LANGUAGES"
				value="ENGLISH"
				checked
				class="checkbox checkbox-sm"
			/>
			<span class="label-text">English</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" name="LANGUAGES" value="SPANISH" class="checkbox checkbox-sm" />
			<span class="label-text">Spanish</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" name="LANGUAGES" value="FRENCH" class="checkbox checkbox-sm" />
			<span class="label-text">French</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" name="LANGUAGES" value="ITALIAN" class="checkbox checkbox-sm" />
			<span class="label-text">Italian</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" name="LANGUAGES" value="GERMAN" class="checkbox checkbox-sm" />
			<span class="label-text">German</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" name="LANGUAGES" value="PORTUGUESE" class="checkbox checkbox-sm" />
			<span class="label-text">Portuguese</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" name="LANGUAGES" value="POLISH" class="checkbox checkbox-sm" />
			<span class="label-text">Polish</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" name="LANGUAGES" value="HINDI" class="checkbox checkbox-sm" />
			<span class="label-text">Hindi</span>
		</label>
	</div>
	<div>
		<span class="label label-text">Optional: title image upload</span>
		<input
			type="file"
			name="IMAGE_FILE"
			accept=".jpg, .jpeg, .png"
			class="file-input file-input-bordered w-full max-w-xs"
		/>
		<span class="label label-text-alt">1MB max, no greater than 864 x 1536px</span>
	</div>
	<div>
		<input type="submit" value="Create!" class="btn btn-outline btn-wide my-4" />
	</div>
</form>
{#if loading}
	<div in:fade out:fade={{ duration: 350 }} class="z-10">
		<DashboardAlert content="Awaiting response from server" type="info"
			><span class="loading loading-spinner loading-xs" /></DashboardAlert
		>
	</div>
{/if}
{#if form?.status && showAlert && !loading}
	<div in:fade={{ delay: 600 }} out:fade class="z-10">
		<DashboardAlert content="Video {form.status}, check history for details" type="success"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			></DashboardAlert
		>
	</div>
{/if}
{#if form?.error && showAlert && !loading}
	<div in:fade={{ delay: 600 }} out:fade class="z-10">
		<DashboardAlert content="Error: {form.error}" type="error"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			></DashboardAlert
		>
	</div>
{/if}
