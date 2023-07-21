// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
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
const analytics = getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
