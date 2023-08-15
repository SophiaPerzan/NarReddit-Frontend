<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		window.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mouseup', handleMouseUp);
		profileElement.addEventListener('touchend', profileFocus, { passive: false });
		menuElement.addEventListener('touchend', menuFocus, { passive: false });

		return () => {
			window.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mouseup', handleMouseUp);
			profileElement.removeEventListener('touchend', profileFocus);
			menuElement.removeEventListener('touchend', menuFocus);
		};
	});

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

	function profileFocus(event: TouchEvent) {
		event.preventDefault();
		profileElement.focus();
	}

	function menuFocus(event: TouchEvent) {
		event.preventDefault();
		menuElement.focus();
	}
</script>

<div class="navbar bg-neutral border border-base-300 mb-8">
	<div class="navbar-start">
		<div class="dropdown">
			<button bind:this={menuElement} class="btn btn-ghost btn-circle">
				<Icon icon="charm:menu-hamburger" class="w-6 h-6" />
			</button>
			<ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral rounded-box w-52">
				<li><a tabindex="0" href="/dashboard">Dashboard</a></li>
				<li><a tabindex="0" href="/dashboard/create">Create Video</a></li>
				<li><a tabindex="0" href="/dashboard/backgrounds">Backgrounds</a></li>
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
					<img alt="Profile" src="/avatar.svg" />
				</div>
			</button>
			<ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral rounded-box w-52">
				<li><a tabindex="0" href="/dashboard/profile">Profile</a></li>
				<li><a tabindex="0" href="/dashboard/settings">Settings</a></li>
				<li>
					<form action="/signout" method="POST">
						<input type="submit" value="Logout" class="hover:cursor-pointer" />
					</form>
				</li>
			</ul>
		</div>
	</div>
</div>
