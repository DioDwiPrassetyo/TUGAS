// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsIu_S-moRbKjDaeyVofDokbsBtAWLjt8",
  authDomain: "dbbioskop-d046d.firebaseapp.com",
  projectId: "dbbioskop-d046d",
  storageBucket: "dbbioskop-d046d.firebasestorage.app",
  messagingSenderId: "1095634193169",
  appId: "1:1095634193169:web:306fa98c7a992ee4699ab0",
  measurementId: "G-H75KFXNJQD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);