import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXVmsBwx699ErgjSAIxcsiIQTSwdLinHM",
  authDomain: "attendme-32125.firebaseapp.com",
  projectId: "attendme-32125",
  storageBucket: "attendme-32125.firebasestorage.app",
  messagingSenderId: "380457468869",
  appId: "1:380457468869:web:b2ff5aa9fb03c97d8401ac",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
