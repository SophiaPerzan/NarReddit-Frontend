<script lang="ts">
	export let videoUrl: string;
	export let videoUrlHQ: string; //1080p progressively loaded video. TODO
</script>

<div class="hero min-h-screen relative overflow-hidden">
	<video autoplay loop muted class="absolute z-0 w-auto min-w-full min-h-full max-w-none">
		<source src={videoUrl} type="video/webm" />
		Your browser does not support the video tag.
	</video>
	<div class="hero-overlay bg-opacity-80 absolute z-10 w-full h-full" />
	<div class="hero-content text-center text-neutral-content relative z-20 -top-1/12">
		<slot />
	</div>
</div>
