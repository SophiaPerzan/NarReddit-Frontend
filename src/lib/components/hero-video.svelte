<script lang="ts">
	export let videoUrl: string;
	export let videoUrlAlt: string;
</script>

<div class="hero min-h-dynamic-screen relative overflow-hidden">
	<video
		autoplay
		loop
		muted
		playsinline
		disablepictureinpicture
		preload="auto"
		class="absolute z-0 w-auto min-w-full min-h-full max-w-none"
	>
		<source src={videoUrl} type="video/mp4" />
		<source src={videoUrlAlt} type="video/mp4" />
		Your browser does not support the video tag.
	</video>
	<div class="hero-overlay bg-opacity-80 absolute z-10 w-full h-full" />
	<div class="hero-content text-center text-neutral-content relative z-20 -top-1/12">
		<slot />
	</div>
</div>

<style>
	.min-h-dynamic-screen {
		min-height: 100dvh;
	}
</style>
