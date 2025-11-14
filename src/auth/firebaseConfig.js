import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBZV0VeOYbabNbOdRwqMDzGlkvtMUPV-Bg",
    authDomain: "castolin-project-e9cc4.firebaseapp.com",
    projectId: "castolin-project-e9cc4",
    storageBucket: "castolin-project-e9cc4.firebasestorage.app",
    messagingSenderId: "612709408303",
    appId: "1:612709408303:web:4ead78405e2df3d989b0da",
    measurementId: "G-N5SY27W5NS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);