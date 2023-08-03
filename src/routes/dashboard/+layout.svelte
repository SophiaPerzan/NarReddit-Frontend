<script lang="ts">
	import type { PageData } from './$types';
	import { user, isLoading } from '$lib/firebase';
	import Navbar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Signin from '$lib/components/signin.svelte';
</script>

<div class="flex flex-col min-h-screen">
	<Navbar />
	<main class="flex-grow">
		<slot />
	</main>
	<Footer />
</div>
