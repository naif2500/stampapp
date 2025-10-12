// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  indexedDBLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2GFY6Y4uBnDRM9KP_PwwRARUl6o49_Ro",
  authDomain: "stampr-446c9.firebaseapp.com",
  projectId: "stampr-446c9",
  storageBucket: "stampr-446c9.firebasestorage.app",
  messagingSenderId: "180971077866",
  appId: "1:180971077866:web:c311e8c33e7c8d37ae9793",
  measurementId: "G-KB0HL08QM7"
};

// Initialize Firebase app (avoid re-initializing)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// ✅ Ensure persistence is set globally, right after auth creation
setPersistence(auth, indexedDBLocalPersistence)
  .then(() => {
    console.log("🔥 Firebase Auth persistence set to IndexedDB (PWA-ready)");
  })
  .catch((err) => {
    console.error("⚠️ Failed to set persistence:", err);
  });

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Export all for use across your app
export { app, auth, db, storage };