<script lang="ts">
	import Lineword from '$lib/components/lineword.svelte';
	import { auth } from '$lib/firebase';
	import {
		GoogleAuthProvider,
		signInWithPopup,
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
		type UserCredential
	} from 'firebase/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	let email: string;
	let password: string;
	let password2: string = '';
	let password2Placeholder: string = 'Confirm password';
	let pass2Err: boolean = false;

	async function checkServerAuth(credential: UserCredential) {
		const idToken = await credential.user.getIdToken();

		const res = await fetch('/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
				// 'CSRF-Token': csrfToken  // HANDLED by sveltekit automatically
			},
			body: JSON.stringify({ idToken })
		});
		const data = await res.json();
		if (data.success) {
			goto('/dashboard');
		}
	}

	function pass2OnInput() {
		password2Placeholder = 'Confirm password';
		pass2Err = false;
	}

	async function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		const credential = await signInWithPopup(auth, provider);
		checkServerAuth(credential);
	}

	function checkPasswords() {
		if (password !== password2) {
			password2 = '';
			password2Placeholder = 'Passwords do not match';
			pass2Err = true;
			return false;
		}
		return true;
	}

	async function signupWithEmail() {
		if (!checkPasswords()) return;
		try {
			const credential = await createUserWithEmailAndPassword(auth, email, password);
			checkServerAuth(credential);
		} catch (error: any) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(errorCode, errorMessage);
			alert(errorMessage);
		}
	}

	async function signinWithEmail() {
		try {
			const credential = await signInWithEmailAndPassword(auth, email, password);
			checkServerAuth(credential);
		} catch (error: any) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(errorCode, errorMessage);
			alert(errorMessage);
		}
	}
</script>

<div
	class="join join-vertical w-max bg-primary text-primary-content text-center {$$props.class || ''}"
>
	<div class="collapse join-item border border-base-300">
		<input type="radio" name="my-accordion-4" checked={true} />
		<div class="collapse-title text-2xl font-semibold">Sign Up</div>
		<div class="collapse-content">
			<form on:submit|preventDefault={signupWithEmail}>
				<div class="form-control w-full max-w-xs space-y-3">
					<input
						type="email"
						placeholder="Email"
						required
						bind:value={email}
						class="input input-bordered w-full max-w-xs text-base-content border-2"
					/>
					<input
						type="password"
						placeholder="Password"
						required
						bind:value={password}
						class="input input-bordered w-full max-w-xs text-base-content border-2"
					/>
					<input
						type="password"
						placeholder={password2Placeholder}
						required
						bind:value={password2}
						on:input={pass2OnInput}
						class:border-error={pass2Err}
						class="input input-bordered w-full max-w-xs text-base-content border-2"
					/>
					<input type="submit" value="Register" class="btn btn-accent" />
					<Lineword title="or" />
					<button on:click={signInWithGoogle} class="btn btn-accent">Continue with Google</button>
				</div>
			</form>
		</div>
	</div>
	<div class="collapse join-item border border-base-300">
		<input type="radio" name="my-accordion-4" />
		<div class="collapse-title text-2xl font-semibold">Sign In</div>
		<div class="collapse-content">
			<form on:submit|preventDefault={signinWithEmail}>
				<div class="form-control w-full max-w-xs space-y-3">
					<input
						type="email"
						placeholder="Email"
						required
						bind:value={email}
						class="input input-bordered w-full max-w-xs text-base-content border-2"
					/>
					<input
						type="password"
						placeholder="Password"
						required
						bind:value={password}
						class="input input-bordered w-full max-w-xs text-base-content border-2"
					/>
					<input type="submit" value="Login" class="btn btn-accent" />
					<Lineword title="or" />
					<button on:click={signInWithGoogle} class="btn btn-accent">Continue with Google</button>
				</div>
			</form>
		</div>
	</div>
</div>
