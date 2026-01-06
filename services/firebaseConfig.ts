import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA7ZAfTJ4FStmvjgE9_mHwvhP1msk0sYNM",
  authDomain: "academiaapp-bf258.firebaseapp.com",
  projectId: "academiaapp-bf258",
  storageBucket: "academiaapp-bf258.firebasestorage.app",
  messagingSenderId: "150886534308",
  appId: "1:150886534308:web:c96b79317a2b2b0f1aea31"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
