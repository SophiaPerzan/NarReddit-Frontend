<script lang="ts">
	export let videoUrl: string;
	export let title: string;
	export let description: string;
	export let buttonText: string;
	export let buttonUrl: string;
</script>

<div class="hero min-h-screen relative overflow-hidden">
	<video autoplay loop muted class="absolute z-0 w-auto min-w-full min-h-full max-w-none">
		<source src={videoUrl} type="video/mp4" />
		Your browser does not support the video tag.
	</video>
	<div class="hero-overlay bg-opacity-80 absolute z-10 w-full h-full" />
	<div class="hero-content text-center text-neutral-content relative z-20 -top-1/12">
		<div class="max-w-md space-y-6 text-lg">
			<h1 class="mb-5 text-5xl font-bold">{title}</h1>
			<p class="mb-5">
				{description}
			</p>
			<a href={buttonUrl} role="button" class="btn btn-primary px-10">{buttonText}</a>
		</div>
	</div>
</div>
