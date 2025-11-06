// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeH-uBTMq5AIhzhC2Y00xianTBy5KxJCA",
  authDomain: "resturantapp-944f4.firebaseapp.com",
  projectId: "resturantapp-944f4",
  storageBucket: "resturantapp-944f4.firebasestorage.app",
  messagingSenderId: "491462962955",
  appId: "1:491462962955:web:d13b466283bd388b9cfc0e",
  measurementId: "G-CVWFKTFDZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;