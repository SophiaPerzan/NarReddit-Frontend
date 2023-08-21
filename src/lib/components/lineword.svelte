<script lang="ts">
	export let title: string;
	export let hrclass: string;
</script>

<span class="flex flex-row items-center space-x-2 rounded-none">
	<hr class="flex-grow h-px {hrclass}" />
	<h3 class="text-xl font-semi-bold">{title.toUpperCase()}</h3>
	<hr class="flex-grow h-px {hrclass}" />
</span>
