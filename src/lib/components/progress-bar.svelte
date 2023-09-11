<script lang="ts">
	export let value = 0;
	export let max = 100;
</script>

<progress class="progress progress-accent w-full" class:invisible={value === 0} {value} {max} />
