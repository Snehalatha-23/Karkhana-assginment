import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBGP58HupMkZ1P7bl5s1q1fzXK3fDa3o6U",
  authDomain: "project-cost-tracker-e2439.firebaseapp.com",
  projectId: "project-cost-tracker-e2439",
  storageBucket: "project-cost-tracker-e2439.firebasestorage.app",
  messagingSenderId: "687744709020",
  appId: "1:687744709020:web:d3a8b215569d0ca2591859",
  measurementId: "G-QLCHHEPGVM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 
