<script lang="ts">
	import SignIn from '$lib/components/signin.svelte';

	import { user } from '$lib/firebase';
	import type { PageData } from './$types';

	import { goto } from '$app/navigation';
	export let data: PageData;

	$: if ($user) {
		goto('/dashboard');
	}
</script>

<div class="flex flex-col justify-center items-center min-h-screen">
	<SignIn class="" />
</div>
