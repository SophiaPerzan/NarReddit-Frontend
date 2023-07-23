<script lang="ts">
	import SignIn from '$lib/components/signin.svelte';
	import Icon from '@iconify/svelte';
	import { user } from '$lib/firebase';
	import type { PageData } from './$types';

	import { goto } from '$app/navigation';
	export let data: PageData;

	$: if ($user) {
		goto('/dashboard');
	}
</script>

<SignIn class="opacity-90" />
