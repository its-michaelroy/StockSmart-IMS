// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPCF3u5KHy4peL4mEBjmnVCuH-xuOE_T4",
  authDomain: "stocksmart-ims.firebaseapp.com",
  projectId: "stocksmart-ims",
  storageBucket: "stocksmart-ims.appspot.com",
  messagingSenderId: "219118449414",
  appId: "1:219118449414:web:b3eeebc39e43e7e8f7a487",
  measurementId: "G-VF7HT0F4D6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };
