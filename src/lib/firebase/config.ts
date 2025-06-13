// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, type Analytics } from 'firebase/analytics';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjMU18Te84wNDtk3dgrGP0t5n_ZyHEJI8",
  authDomain: "lingoroots.firebaseapp.com",
  projectId: "lingoroots",
  storageBucket: "lingoroots.firebasestorage.app",
  messagingSenderId: "492045873515",
  appId: "1:492045873515:web:7338c5c284277e1b415c2e"
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
