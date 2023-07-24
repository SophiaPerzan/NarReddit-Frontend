// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { writable } from 'svelte/store';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDZ7fxI-tTZhFvqs_bA_lWkBUC4vHRGMv8',
	authDomain: 'narreddit-nr.firebaseapp.com',
	projectId: 'narreddit-nr',
	storageBucket: 'narreddit-nr.appspot.com',
	messagingSenderId: '537975266545',
	appId: '1:537975266545:web:a96ac26ebeba89a4e49d50',
	measurementId: 'G-PZHE0V4HFB'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== 'undefined') {
	// This code will only execute in a browser environment
	const { getAnalytics } = await import('firebase/analytics');
	analytics = getAnalytics(app);
}
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

let isLoading = writable(true); // set initial state

/**
 * @returns a store with the current firebase user
 */
function userStore() {
	let unsubscribe: () => void;
	if (!auth || !globalThis.window) {
		console.warn('Auth is not initialized or not in browser');
		const { subscribe } = writable<User | null>(null);
		return {
			subscribe
		};
	}

	const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
		unsubscribe = onAuthStateChanged(auth, (user) => {
			set(user);
			isLoading.set(false); // set isLoading to false when the user state changes
		});

		return () => unsubscribe();
	});

	return {
		subscribe
	};
}

export const user = userStore();
export { isLoading };
