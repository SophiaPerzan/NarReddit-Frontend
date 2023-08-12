<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import DashboardAlert from '$lib/components/dashboard-alert.svelte';
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
	import BGUpload from '$lib/components/bg-upload.svelte';
	import BgVideoCard from '$lib/components/bg-video-card.svelte';
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
	async function updateBGVideo(ID: string, index: number) {
		const res = await fetch('/api/backgrounds/', {
			method: 'GET',
			body: JSON.stringify({
				ID: ID
			})
		});
		const resData = await res.json();
		data.backgroundVideos[index].status = resData.status;
	}
	async function deleteBGVideo(ID: string, index: number) {
		const res = await fetch('/api/backgrounds/', {
			method: 'DELETE',
			body: JSON.stringify({
				ID: ID
			})
		});
		const resData = await res.json();
		if (resData.status === 'success') {
			data.backgroundVideos.splice(index, 1);
			data.backgroundVideos = data.backgroundVideos;
		}
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
{#if data.backgroundVideos.length > 0}
	{#each data.backgroundVideos as video, index (video.ID)}
		<div in:slide out:slide>
			<BgVideoCard updateFunction={updateBGVideo} deleteFunction={deleteBGVideo} {video} {index} />
		</div>
	{/each}
{/if}
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
