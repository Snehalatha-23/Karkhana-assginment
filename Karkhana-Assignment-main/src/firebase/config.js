import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvARsSc9wVx1ypnqkYxAlcswvRZ4efv3U",
  authDomain: "project-cost-tracker-e9485.firebaseapp.com",
  projectId: "project-cost-tracker-e9485",
  storageBucket: "project-cost-tracker-e9485.appspot.com",
  messagingSenderId: "355390830435",
  appId: "1:355390830435:web:dde874ecdc286167d74556",
  measurementId: "G-VGHFBN4SHL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 