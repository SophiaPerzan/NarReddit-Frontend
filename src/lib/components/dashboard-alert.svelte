<script lang="ts">
	export let type: 'success' | 'error' | 'warning' | 'info' = 'success';
	export let content: string;
</script>

<div
	class="alert max-w-sm w-auto py-1 px-4 fixed right-4 bottom-2 flex"
	class:alert-success={type === 'success'}
	class:alert-error={type === 'error'}
	class:alert-info={type === 'info'}
	class:alert-warning={type === 'warning'}
>
	<slot />
	<span>{content}</span>
</div>
