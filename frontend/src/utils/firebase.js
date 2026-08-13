import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "fresherai-99d19.firebaseapp.com",
  projectId: "fresherai-99d19",
  storageBucket: "fresherai-99d19.firebasestorage.app",
  messagingSenderId: "89500901427",
  appId: "1:89500901427:web:59924ed1af78c5d14bc346"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth, provider}