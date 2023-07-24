<script lang="ts">
	import { user, isLoading } from '$lib/firebase';
	import Navbar from '$lib/components/navbar.svelte';
	import Signin from '$lib/components/signin.svelte';

	async function isUser() {
		if ($user) {
			return true;
		}
		return false;
	}

	let userLoaded = isUser();
</script>

{#if $isLoading}
	<div
		class="flex justify-center flex-col text-center items-center gap-y-6 h-screen text-secondary"
	>
		<h1 class="text-5xl">Loading</h1>
		<span class="loading loading-spinner loading-lg" />
	</div>
{:else if $user}
	<Navbar />
	<slot />
{:else}
	<div class="flex flex-col items-center justify-center h-screen space-y-8 text-center mx-9">
		<h1 class="text-4xl font-bold min-w-min max-w-sm text-warning">
			You must be signed in to continue
		</h1>
		<Signin />
	</div>
{/if}
