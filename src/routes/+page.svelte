<script>
	import HeroContentTextButton from '$lib/components/hero-content-text-button.svelte';
	const title = 'NarReddit';
	const description =
		'Automate the creation of engaging, multilingual TikTok narrations from top-rated Reddit posts with NarReddit. Converts Reddit posts to Text-to-Speech audio, overlays onto chosen background videos, and supports translations.';
	const buttonText = 'Get Started';
	const buttonUrl = '/signin';
</script>

<HeroContentTextButton {title} {description} {buttonText} {buttonUrl} />
