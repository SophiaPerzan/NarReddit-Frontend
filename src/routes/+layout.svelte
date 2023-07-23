<script>
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import '../app.css';
	import HeroVideo from '$lib/components/hero-video.svelte';
	const videoUrl = '/mc720.webm';
	const videoUrlHQ = '/mc1080.webm';
</script>

<HeroVideo {videoUrl} {videoUrlHQ}>
	{#key $page.url}
		<div in:fly={{ x: '-200%', duration: 500 }}>
			<slot />
		</div>
	{/key}
</HeroVideo>
