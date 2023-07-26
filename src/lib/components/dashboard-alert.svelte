<script lang="ts">
	export let type: 'success' | 'error' | 'warning' | 'info' = 'success';
	export let content: string;
</script>

<div class="alert alert-{type} max-w-sm w-auto py-1 px-4 absolute right-4 bottom-2 flex">
	<slot />
	<span>{content}</span>
</div>
