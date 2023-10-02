<script lang="ts">
	import IntroCard from '$lib/components/intro-card.svelte';
	import Icon from '@iconify/svelte';
	import html2canvas from 'html2canvas';
	import { tick } from 'svelte';
	let canvas: HTMLDivElement;
	const maxCanvasWidth = 864;
	async function captureElement(element: HTMLElement) {
		if (!element) return alert('Nothing to capture');

		preview = false;
		// Wait for Svelte to apply updates
		await tick();
		html2canvas(element, { backgroundColor: null }).then((canvas) => {
			if (canvas.width > maxCanvasWidth) {
				const scaleFactor = maxCanvasWidth / canvas.width;
				const newCanvas = document.createElement('canvas');
				const newContext = newCanvas.getContext('2d');

				newCanvas.width = maxCanvasWidth;
				newCanvas.height = canvas.height * scaleFactor;

				newContext?.drawImage(canvas, 0, 0, maxCanvasWidth, newCanvas.height);

				const img = newCanvas.toDataURL('image/png');
				downloadImage(img); // This function is provided below
			} else {
				const img = canvas.toDataURL('image/png');
				downloadImage(img); // This function is provided below
			}
		});
		preview = true;
	}

	function downloadImage(dataUrl: string) {
		const a = document.createElement('a');
		a.href = dataUrl;
		a.download = 'screenshot.png';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
	let name: string = 'NarReddit';
	let title: string = 'Post title goes here';
	let views: string = '1.2M';
	let upvotes: string = '24.2k';
	let comments: string = '462';
	let src: string =
		'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';
	let heart: boolean = false;
	let verified: boolean = true;
	let preview = true;
	let base64Modal: HTMLDialogElement;
</script>

<div
	class="flex gap-4 flex-col items-center md:flex-row md:w-full md:justify-between md:items-start"
>
	<div class="flex flex-col w-fit gap-y-4 lg:w-full">
		<!-- <textarea
			class="textarea textarea-bordered w-full max-w-md h-80"
			placeholder="Enter html here"
			bind:value={html}
		/>-->
		<div>
			<label class="label" for="name input">
				<span class="label-text">Name</span>
			</label>
			<input
				type="text"
				bind:value={name}
				name="name input"
				class="input input-bordered w-full max-w-sm"
			/>
		</div>
		<div>
			<label class="label" for="title input">
				<span class="label-text">Title</span>
			</label>
			<input
				type="text"
				bind:value={title}
				name="title input"
				class="input input-bordered w-full max-w-sm"
			/>
		</div>
		<div>
			<label class="label" for="views input">
				<span class="label-text">Views</span>
			</label>
			<input type="text" bind:value={views} name="views input" class="input input-bordered w-fit" />
		</div>
		<div>
			<label class="label" for="upvotes input">
				<span class="label-text">Upvotes</span>
			</label>
			<input
				type="text"
				bind:value={upvotes}
				name="upvotes input"
				class="input input-bordered w-fit"
			/>
		</div>
		<div>
			<label class="label" for="comments input">
				<span class="label-text">Comments</span>
			</label>
			<input
				type="text"
				bind:value={comments}
				name="comments input"
				class="input input-bordered w-fit"
			/>
		</div>
		<div>
			<label class="label justify-start gap-x-2 w-fit hover:cursor-pointer">
				<span class="label-text">Base64 Image string</span>
				<!-- Open the modal using ID.showModal() method -->
				<button on:click={() => base64Modal.showModal()}
					><Icon icon="material-symbols:info" class="inline text-xl text-base-content" /></button
				>
				<dialog bind:this={base64Modal} class="modal modal-bottom sm:modal-middle">
					<form method="dialog" class="modal-box">
						<h3 class="font-bold text-lg">What is a base64 image string?</h3>
						<p class="pt-1 pb-4">
							A Base64 image string is a way of representing images as a string of characters. Due
							to browser security rules, pasting an image link would not work. The base64 string is
							a workaround for this.
						</p>
						<h3 class="font-bold text-lg">How do I convert my image to base64?</h3>
						<p class="py-1">
							Visit an <a
								class="text-blue-500 hover:underline"
								href="https://base64.guru/converter/encode/image"
								target="_blank"
								rel="noopener noreferrer">online image to base64 converter</a
							> to convert your image. Paste your result in the textbox and it should work!
						</p>
					</form>
					<form method="dialog" class="modal-backdrop">
						<button>close</button>
					</form>
				</dialog>
			</label>
			<input type="text" bind:value={src} class="input input-bordered w-full max-w-sm" />
		</div>
		<div class="gap-x-4 flex">
			<div class="text-center">
				<span class="label label-text">Upvote or heart?</span>
				<label class="swap swap-flip">
					<!-- this hidden checkbox controls the state -->
					<input type="checkbox" bind:checked={heart} />

					<div class="swap-on">
						<Icon icon="material-symbols:favorite" class="inline text-5xl text-red-600" />
					</div>
					<div class="swap-off">
						<Icon icon="bx:bxs-upvote" class="inline text-5xl text-red-600" />
					</div>
				</label>
			</div>
			<div>
				<label class="label" for="verified">
					<span class="label-text">Verified?</span>
				</label>
				<input bind:checked={verified} type="checkbox" name="verified" class="toggle mt-4" />
			</div>
		</div>

		<button
			on:click={() => captureElement(canvas)}
			class="btn btn-outline btn-accent w-40 mt-6 mb-2">Save image</button
		>
	</div>
	<div class="flex flex-col w-full items-center lg:items-start">
		<div class="w-fit" bind:this={canvas} class:x2={!preview}>
			<IntroCard {title} {name} {views} {upvotes} {comments} {src} {preview} {heart} {verified} />
		</div>
	</div>
</div>

<style>
	.x2 {
		transform: scale(2, 2);
	}
</style>
