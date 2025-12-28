import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiswjUfmkNWULCR61RySji3kYzlGneo6k",
  authDomain: "sushila-enclave.firebaseapp.com",
  projectId: "sushila-enclave",
  storageBucket: "sushila-enclave.firebasestorage.app",
  messagingSenderId: "981538720200",
  appId: "1:981538720200:web:7d490a41f63ed25ad898fd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
