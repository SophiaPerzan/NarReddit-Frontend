<script lang="ts">
	import Lineword from '$lib/components/lineword.svelte';
	import { user } from '$lib/firebase';
	import { auth } from '$lib/firebase';
	import {
		GoogleAuthProvider,
		signInWithPopup,
		signOut,
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword
	} from 'firebase/auth';
	let email: string;
	let password: string;
	let password2: string = '';
	let password2Placeholder: string = 'Confirm password';
	let pass2Err: boolean = false;

	function pass2OnInput() {
		password2Placeholder = 'Confirm password';
		pass2Err = false;
	}

	async function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
		console.log($user);
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

	const signupWithEmail = () => {
		if (!checkPasswords()) return;
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in
				console.log($user);
				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
				alert(errorMessage);
				// ..
			});
	};

	const signinWithEmail = () => {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in
				console.log($user);
				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
			});
	};
</script>

<div
	class="join join-vertical w-max bg-primary border border-base-300 text-primary-content text-center {$$props.class ||
		''}"
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
