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
	let name: string = 'r/cscareerquestions';
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
		<div class="w-fit" bind:this={canvas}>
			<IntroCard {title} {name} {views} {upvotes} {comments} {src} {preview} {heart} {verified} />
		</div>
	</div>
</div>
