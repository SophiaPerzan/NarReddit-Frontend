<script lang="ts">
	import { user } from '$lib/firebase';
	import Signin from '$lib/components/signin.svelte';
</script>

{#if $user}
	<slot />
{:else}
	<div class="flex flex-col items-center justify-center h-screen space-y-8 text-center mx-9">
		<h1 class="text-4xl font-bold">You must be signed in to continue</h1>
		<Signin />
	</div>
{/if}
