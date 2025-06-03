// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, type Analytics } from 'firebase/analytics';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKX7h5X5ypyot9HUZBLxWRNjOn2T3j-rI",
  authDomain: "lingoroots-30066.firebaseapp.com",
  projectId: "lingoroots-30066",
  storageBucket: "lingoroots-30066.appspot.com", // Corrected storage bucket
  messagingSenderId: "100987690274",
  appId: "1:100987690274:web:876393787c77e6f32ad97b"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Export Firebase services
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app); // Added for future use

let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  // Initialize Analytics only on the client side
  analytics = getAnalytics(app); // Added for future use
}


export { app, auth, db, storage, analytics };
