<script>
	import HeroVideo from '$lib/components/hero-video.svelte';
	const title = 'NarReddit';
	const description =
		'Automate the creation of engaging, multilingual TikTok narrations from top-rated Reddit posts with NarReddit. Converts Reddit posts to Text-to-Speech audio, overlays onto chosen background videos, and supports translations.';
	const buttonText = 'Get Started';
	const buttonUrl = '/signin';
	const videoUrl = '/mc720.webm';
	const videoUrlHQ = '/mc1080.webm';
</script>

<HeroVideo {title} {buttonText} {buttonUrl} {videoUrl} {videoUrlHQ} {description} />
