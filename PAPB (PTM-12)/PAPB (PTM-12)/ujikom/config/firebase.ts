// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhIHSFpkcXx-z6_1R0qU3W7AkJhduS6P0",
  authDomain: "dbujikom-95039.firebaseapp.com",
  projectId: "dbujikom-95039",
  storageBucket: "dbujikom-95039.firebasestorage.app",
  messagingSenderId: "567928039909",
  appId: "1:567928039909:web:6c2f7b7c0edcc9e24a270c",
  measurementId: "G-WVB5X21SZ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);