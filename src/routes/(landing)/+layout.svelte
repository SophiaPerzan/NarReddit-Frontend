<script>
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import HeroVideo from '$lib/components/hero-video.svelte';
	const videoUrl = '/MC.mp4';
	const videoUrlAlt = '/MC264.mp4';
</script>

<HeroVideo {videoUrl} {videoUrlAlt}>
	{#key $page.url}
		<div in:fly={{ x: '-200%', duration: 500 }}>
			<slot />
		</div>
	{/key}
</HeroVideo>
