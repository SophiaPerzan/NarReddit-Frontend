<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import DashboardAlert from '$lib/components/dashboard-alert.svelte';
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
	import BGUpload from '$lib/components/bg-upload.svelte';
	import BgVideoCard from '$lib/components/bg-video-card.svelte';
	import { storage, user } from '$lib/firebase';
	import { ref, uploadBytes, uploadBytesResumable, type UploadTask } from 'firebase/storage';
	import ProgressBar from '$lib/components/progress-bar.svelte';
	export let data: PageData;
	export let form: ActionData;
	let loading = false;
	let showAlert = false;
	const alertTime = 7500;
	let errorAlert = '';

	async function updateBGVideo(ID: string, index: number) {
		const res = await fetch(`/api/backgrounds/?ID=${encodeURIComponent(ID)}`, {
			method: 'GET'
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
	async function uploadVideo() {
		if (!(fileList && fileList.length > 0)) {
			alert('Please select a file to upload');
		}
		const file = fileList[0];
		if (file.size > 500000000) {
			alert('File size is too large. Please select a file under 500MB');
		}
		if (file.type !== 'video/mp4') {
			alert('Please select a .mp4 file to upload');
		}
		//upload bg video to GCP cloud storage
		const fileName = `${$user!.uid}/backgrounds/${file.name}`;
		const storageRef = ref(storage, fileName);

		//file metadata
		const metadata = {
			contentType: 'video/mp4'
		};

		const uploadTask = uploadBytesResumable(storageRef, file, metadata);

		// Register three observers:
		// 1. 'state_changed' observer, called any time the state changes
		// 2. Error observer, called on failure
		// 3. Completion observer, called on successful completion
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				// Observe state change events such as progress, pause, and resume
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				uploadProgress = progress;
				switch (snapshot.state) {
					case 'paused':
						console.log('Upload is paused');
						break;
					case 'running':
						console.log('Upload is running');
						break;
				}
			},
			(error) => {
				// Handle unsuccessful uploads
			},
			async () => {
				loading = true;
				// Upload completed successfully
				const res = await fetch('/api/backgrounds/', {
					method: 'POST',
					body: JSON.stringify({
						bgVidPath: uploadTask.snapshot.ref.fullPath
					})
				});
				const resData = await res.json();
				loading = false;
				if (resData?.status !== '') {
					location.reload();
				} else {
					errorAlert = resData.error;
					showAlert = true;
					setTimeout(() => {
						showAlert = false;
					}, alertTime);
				}
			}
		);
	}
	let fileList: FileList;
	let uploadProgress = 0;
</script>

<p>Video uploads can take up to 5 or more minutes to verify</p>
<p>Please be patient 🙏</p>
<div class="form-control w-full max-w-md items-center gap-y-4 text-base-content">
	<BGUpload formIdentifier="VIDEO_FILE" bind:fileBinding={fileList} />
	<ProgressBar bind:value={uploadProgress} max={100} />
	<button on:click={uploadVideo} class="btn btn-outline btn-block">UPLOAD</button>
</div>
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
{#if errorAlert !== '' && showAlert && !loading}
	<div in:fade={{ delay: 600 }} out:fade class="z-10">
		<DashboardAlert content="Error: {errorAlert}" type="error"
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
