<script lang="ts">
	import type { PageData } from './$types';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { goto } from '$app/navigation';
	export let data: PageData;

	function signOutUser() {
		signOut(auth)
			.then(() => {
				alert('Signed out successfully');
				goto('/');
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
				alert(errorMessage);
			});
	}
</script>

<button on:click={signOutUser} class="btn btn-primary">Sign out</button>
