// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzOrbnFK-2L_uVP-ZgG1V6wHcpbPYHacI",
  authDomain: "kibproject-63d04.firebaseapp.com",
  projectId: "kibproject-63d04",
  storageBucket: "kibproject-63d04.firebasestorage.app",
  messagingSenderId: "196544810887",
  appId: "1:196544810887:web:a839308d94e992db974d22",
  measurementId: "G-GLFZB9DYYP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
