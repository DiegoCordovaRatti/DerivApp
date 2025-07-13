import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJga1Td_nhErGh7WAfMP2trwEjtxHT1vM",
  authDomain: "derivaapp.firebaseapp.com",
  projectId: "derivaapp",
  storageBucket: "derivaapp.firebasestorage.app",
  messagingSenderId: "122135054847",
  appId: "1:122135054847:web:8734fc9ee654406a58bfca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);