<script lang="ts">
	import html2canvas from 'html2canvas';
	let html = '';
	let canvas: HTMLDivElement;
	function captureElement(element: HTMLElement) {
		if (!element) return alert('Nothing to capture');

		//Taint doesnt yet work
		html2canvas(element, { backgroundColor: null, allowTaint: true }).then((canvas) => {
			const img = canvas.toDataURL('image/png');
			downloadImage(img); // This function is provided below
		});
	}

	function downloadImage(dataUrl: string) {
		const a = document.createElement('a');
		a.href = dataUrl;
		a.download = 'screenshot.png';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
</script>

<div class="flex flex-row gap-4 w-full justify-between">
	<div class="flex flex-col w-full gap-y-4">
		<textarea
			class="textarea textarea-bordered w-full max-w-md h-80"
			placeholder="Enter html here"
			bind:value={html}
		/>
		<button on:click={() => captureElement(canvas)} class="btn btn-outline btn-accent w-40"
			>Save image</button
		>
	</div>
	<div class="flex flex-col w-full">
		<div class="w-fit" bind:this={canvas}>{@html html}</div>
	</div>
</div>
