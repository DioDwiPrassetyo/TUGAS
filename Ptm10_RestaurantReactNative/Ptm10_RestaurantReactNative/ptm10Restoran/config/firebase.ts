// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCp9DjCBJ1d6YjDM6gmYeaA3UvzhN3Qud4",
  authDomain: "dbwarung-7c4d6.firebaseapp.com",
  projectId: "dbwarung-7c4d6",
  storageBucket: "dbwarung-7c4d6.firebasestorage.app",
  messagingSenderId: "57704401284",
  appId: "1:57704401284:web:7d059d2ee437c38c3135d1",
  measurementId: "G-FLS7T9D4WX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);