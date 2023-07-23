<script lang="ts">
	import SignIn from '$lib/components/signin.svelte';
	import Icon from '@iconify/svelte';
	import { user } from '$lib/firebase';

	import { goto } from '$app/navigation';

	$: if ($user) {
		goto('/dashboard');
	}
</script>

{#if !$user}
	<SignIn class="opacity-90" />
{/if}
