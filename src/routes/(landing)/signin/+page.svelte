<script lang="ts">
	import type { PageData } from './$types';
	import SignIn from '$lib/components/signin.svelte';
	export let data: PageData;
</script>

<SignIn class="opacity-90" />
