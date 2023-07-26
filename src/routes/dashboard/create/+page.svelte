<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
	import DashboardAlert from '$lib/components/dashboard-alert.svelte';
	export let data: PageData;
	export let form: ActionData;
	let loading = false;
	let showAlert = false;

	$: if (form) {
		loading = false;
		showAlert = true;
		setTimeout(() => {
			showAlert = false;
		}, 7500);
	}
</script>

<form
	method="POST"
	action="?/create"
	use:enhance
	on:submit={(e) => {
		e.preventDefault();
		loading = true;
	}}
	class="form-control w-full max-w-sm items-center gap-y-4 text-base-content"
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
		/>
	</div>
	<div>
		<span class="label label-text">Maximum character count</span>
		<input
			type="number"
			name="MAX_POST_LENGTH"
			placeholder="40,000"
			class="input input-bordered"
			required
		/>
	</div>
	<div class="flex flex-col items-center">
		<span class="label label-text">Add video subtitles</span>
		<input type="checkbox" name="SUBTITLES" class="toggle" checked={form?.SUBTITLES ?? false} />
	</div>
	<div class="flex flex-col items-center">
		<span class="label label-text">Randomized start time</span>
		<input
			type="checkbox"
			name="RANDOM_START_TIME"
			class="toggle"
			checked={form?.RANDOM_START_TIME ?? false}
		/>
	</div>
	<div>
		<span class="label label-text">Background video</span>
		<select name="BG_VIDEO_FILENAME" class="select select-bordered" required>
			<option value="RANDOM" selected>Random</option>
			<option value="MCParkour.mp4">Minecraft Parkour</option>
		</select>
	</div>
	<div>
		<h3 class="text-2xl my-2">Languages</h3>
		<label class="label cursor-pointer nd">
			<input type="checkbox" name="LANGUAGES" checked class="checkbox checkbox-sm" />
			<span class="label-text">English</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" name="LANGUAGES" class="checkbox checkbox-sm" />
			<span class="label-text">Spanish</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" name="LANGUAGES" class="checkbox checkbox-sm" />
			<span class="label-text">French</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" name="LANGUAGES" class="checkbox checkbox-sm" />
			<span class="label-text">Italian</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" name="LANGUAGES" class="checkbox checkbox-sm" />
			<span class="label-text">German</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" name="LANGUAGES" class="checkbox checkbox-sm" />
			<span class="label-text">Portuguese</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" name="LANGUAGES" class="checkbox checkbox-sm" />
			<span class="label-text">Polish</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" name="LANGUAGES" class="checkbox checkbox-sm" />
			<span class="label-text">Hindi</span>
		</label>
	</div>
	<div>
		<input type="submit" value="Create!" class="btn btn-outline btn-wide my-4" />
	</div>
</form>
{#if loading}
	<div in:fade out:fade>
		<DashboardAlert content="Awaiting response from server" type="info"
			><span class="loading loading-spinner loading-xs" /></DashboardAlert
		>
	</div>
{/if}
{#if form?.id && showAlert}
	<div in:fade={{ delay: 600 }} out:fade>
		<DashboardAlert content="Success! ID: {form.id}" type="success"
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
