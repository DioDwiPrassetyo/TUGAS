// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJnLX__DvLJnSZ2INoXdZbeK1EakPJBYQ",
  authDomain: "apotek-d7912.firebaseapp.com",
  projectId: "apotek-d7912",
  storageBucket: "apotek-d7912.firebasestorage.app",
  messagingSenderId: "512442950411",
  appId: "1:512442950411:web:8a80d09ad4f2c4d1a9780e",
  measurementId: "G-TS07Q3DRPK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);