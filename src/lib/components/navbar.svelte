<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Icon from '@iconify/svelte';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { goto } from '$app/navigation';

	onMount(() => {
		window.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	});

	function signOutUser() {
		signOut(auth)
			.then(() => {
				goto('/');
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
				alert(errorMessage);
			});
	}
	let profileElement: HTMLElement;
	let menuElement: HTMLElement;
	let mouseDownElement: HTMLElement;

	function handleMouseUp() {
		if (
			mouseDownElement === document.activeElement &&
			(mouseDownElement === profileElement || mouseDownElement === menuElement)
		) {
			mouseDownElement.blur();
		}
	}

	function handleMouseDown() {
		mouseDownElement = document.activeElement as HTMLElement;
	}
</script>

<div class="navbar bg-neutral border border-base-300 mb-8">
	<div class="navbar-start">
		<div class="dropdown">
			<button bind:this={menuElement} class="btn btn-ghost btn-circle">
				<Icon icon="charm:menu-hamburger" class="w-6 h-6" />
			</button>
			<ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral rounded-box w-52">
				<li><a tabindex="0" href="/dashboard/create">Create Video</a></li>
				<li><a tabindex="0" href="/dashboard/scheduled">Scheduled Videos</a></li>
				<li><a tabindex="0" href="/dashboard/history">History</a></li>
			</ul>
		</div>
	</div>
	<div class="navbar-center">
		<a href="/dashboard" class="btn btn-ghost normal-case text-xl">NarReddit</a>
	</div>
	<div class="navbar-end">
		<div class="dropdown dropdown-end">
			<button bind:this={profileElement} class="btn btn-ghost btn-circle avatar">
				<div class="w-10 rounded-full">
					<img alt="Mike Wazowski" src="https://i.redd.it/v0caqchbtn741.jpg" />
				</div>
			</button>
			<ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral rounded-box w-52">
				<li><a tabindex="0" href="/dashboard/profile">Profile</a></li>
				<li><a tabindex="0" href="/dashboard/settings">Settings</a></li>
				<li><button on:click={signOutUser}>Logout</button></li>
			</ul>
		</div>
	</div>
</div>
