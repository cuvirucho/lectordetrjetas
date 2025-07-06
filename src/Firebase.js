// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB37Bdy6eL_RItUtlygFKwhH2f2yNazvAY",
  authDomain: "fidelidaddemo.firebaseapp.com",
  projectId: "fidelidaddemo",
  storageBucket: "fidelidaddemo.firebasestorage.app",
  messagingSenderId: "964101410489",
  appId: "1:964101410489:web:aa712bc0d3a07fed1f9568",
  measurementId: "G-3HF02BB0N6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);