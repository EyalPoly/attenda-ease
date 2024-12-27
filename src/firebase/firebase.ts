import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-AED9XcMBbt_LWcomphWRVVkmNsHsi1A",
  authDomain: "attendaease.firebaseapp.com",
  projectId: "attendaease",
  storageBucket: "attendaease.firebasestorage.app",
  messagingSenderId: "532315011345",
  appId: "1:532315011345:web:fcf1cda2ab77e7b4cc34b0",
  measurementId: "G-NMFN1KJNV7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };