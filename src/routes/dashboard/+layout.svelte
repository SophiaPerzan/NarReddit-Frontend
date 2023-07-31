<script lang="ts">
	import type { PageData } from './$types';
	import { user, isLoading } from '$lib/firebase';
	import Navbar from '$lib/components/navbar.svelte';
	import Signin from '$lib/components/signin.svelte';
	export let data: PageData;
</script>

<Navbar />
<slot />
