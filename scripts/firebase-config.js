// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAv4AzEZsfN-JJ6t6GNmWw0znoXSb_mFAQ",
    authDomain: "atheriantasks.firebaseapp.com",
    projectId: "atheriantasks",
    storageBucket: "atheriantasks.firebasestorage.app",
    messagingSenderId: "894785172692",
    appId: "1:894785172692:web:c6ffb1df4c1f4c04cd3741"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
