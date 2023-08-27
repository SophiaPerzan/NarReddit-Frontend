<script lang="ts">
	import type { PageData } from './$types';
	import { storage, user } from '$lib/firebase';
	import { deleteObject, getDownloadURL, list, ref, uploadBytesResumable } from 'firebase/storage';
	export let data: PageData;

	async function uploadPFP(fileList: FileList) {
		if (!fileList || fileList.length === 0) {
			console.log('No file selected');
			return;
		}
		const file = fileList[0];
		const userID = $user!.uid;

		//delete old pfp
		// Create a reference to the file to delete
		const pfps = await list(ref(storage, userID + '/profile'));

		pfps.items.forEach((item) => {
			deleteObject(item);
		});

		// Upload file and metadata to the object 'images/mountains.jpg'
		const fileExtension = '.' + file.name.split('.').pop();
		const storageRef = ref(storage, userID + '/profile/profilephoto' + fileExtension);
		const uploadTask = uploadBytesResumable(storageRef, file);
		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log('Upload is ' + progress + '% done');
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
				// A full list of error codes is available at
				// https://firebase.google.com/docs/storage/web/handle-errors
				switch (error.code) {
					case 'storage/unauthorized':
						// User doesn't have permission to access the object
						break;
					case 'storage/canceled':
						// User canceled the upload
						break;

					// ...

					case 'storage/unknown':
						// Unknown error occurred, inspect error.serverResponse
						break;
				}
			},
			() => {
				// Upload completed successfully, now we can get the download URL
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					console.log('File available at', downloadURL);
				});
			}
		);
	}
	let fileBinding: FileList;
</script>

<div class="flex flex-col items-center">Profile!</div>
<input
	bind:files={fileBinding}
	type="file"
	class="file-input file-input-bordered w-full max-w-xs"
/>
<button on:click={() => uploadPFP(fileBinding)} class="btn btn-outline btn-accent px-6"
	>Upload</button
>
