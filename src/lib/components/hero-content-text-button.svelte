<script lang="ts">
	export let title: string;
	export let description: string;
	export let buttonText: string;
	export let buttonUrl: string;
</script>

<div class="max-w-md space-y-6 text-lg">
	<h1 class="mb-5 text-5xl font-bold">{title}</h1>
	<p class="mb-5">
		{description}
	</p>
	<a href={buttonUrl} role="button" class="btn btn-primary px-10">{buttonText}</a>
</div>
