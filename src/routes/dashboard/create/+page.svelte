<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	let subreddit = '';
	let minPostLength = 0;
	let maxPostLength = 40000;
	let subtitles = false;
	let randomizeStart = false;
	let bgVideoFilename = '';
	let languages = [];
</script>

<form class="form-control w-full max-w-sm items-center gap-y-4 text-base-content">
	<div class="relative">
		<label class="label"><span class="label-text">Get the top post from</span></label>
		<h6 class="text-xl absolute -left-5 top-11">r/</h6>
		<input type="text" placeholder="AmITheAsshole" class="input input-bordered" />
	</div>
	<div>
		<label class="label"><span class="label-text">Minimum character count</span></label>
		<input type="number" placeholder="0" class="input input-bordered" />
	</div>
	<div>
		<label class="label"><span class="label-text">Maximum character count</span></label>
		<input type="number" placeholder="40,000" class="input input-bordered" />
	</div>
	<div class="flex flex-col items-center">
		<label class="label"><span class="label-text">Add video subtitles</span></label>
		<input type="checkbox" class="toggle" checked />
	</div>
	<div class="flex flex-col items-center">
		<label class="label"><span class="label-text">Randomized start time</span></label>
		<input type="checkbox" class="toggle" checked />
	</div>
	<div class="mt-2">
		<select class="select select-bordered">
			<option disabled selected>Background video</option>
			<option>Random</option>
			<option>Minecraft Parkour</option>
		</select>
	</div>
	<div>
		<h3 class="text-2xl">Languages</h3>
		<label class="label cursor-pointer nd">
			<input type="checkbox" checked={true} class="checkbox checkbox-sm" />
			<span class="label-text">English</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" checked={true} class="checkbox checkbox-sm" />
			<span class="label-text">Spanish</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" checked={true} class="checkbox checkbox-sm" />
			<span class="label-text">French</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" checked={true} class="checkbox checkbox-sm" />
			<span class="label-text">Italian</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" checked={true} class="checkbox checkbox-sm" />
			<span class="label-text">German</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" checked={true} class="checkbox checkbox-sm" />
			<span class="label-text">Portuguese</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" checked={true} class="checkbox checkbox-sm" />
			<span class="label-text">Polish</span>
		</label>
		<label class="label cursor-pointer nd">
			<input type="checkbox" checked={true} class="checkbox checkbox-sm" />
			<span class="label-text">Hindi</span>
		</label>
	</div>
	<div>
		<input type="submit" value="Submit" class="btn btn-outline btn-wide mt-4" />
	</div>
</form>
