<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import DashboardAlert from '$lib/components/dashboard-alert.svelte';
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
	import BGUpload from '$lib/components/bg-upload.svelte';
	export let data: PageData;
	export let form: ActionData;
	let loading = false;
	let showAlert = false;
	const alertTime = 7500;
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
</script>

<p>Video uploads can take up to 5 or more minutes to verify</p>
<p>Please be patient 🙏</p>
<form
	method="POST"
	action="?/upload"
	enctype="multipart/form-data"
	use:enhance
	on:submit={onSubmit}
	class="form-control w-full max-w-md items-center gap-y-4 text-base-content"
>
	<BGUpload formIdentifier="VIDEO_FILE" />
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
		<DashboardAlert content="Upload {form.status}" type="success"
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
