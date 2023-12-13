import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCYHeFeisUwVCwul5t66q1OJXbuyJbarr8",
  authDomain: "midroader-18f6b.firebaseapp.com",
  projectId: "midroader-18f6b",
  storageBucket: "midroader-18f6b.appspot.com",
  messagingSenderId: "363084646146",
  appId: "1:363084646146:web:dadaeef9669f978ec6641b",
  measurementId: "G-FV9WPP89N3"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);