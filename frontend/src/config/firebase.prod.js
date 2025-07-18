import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Production Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyC7Uc70_Q7ynGZOeQNZKJNDYzSNn8P7A_k",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "seedbasket-342ca.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "seedbasket-342ca",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "seedbasket-342ca.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "757980611728",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:757980611728:web:7899ed5319aed69e928415",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-DG122MGYLL"
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

db._settings = {
  ...db._settings,
  ignoreUndefinedProperties: true
};

export const googleProvider = new GoogleAuthProvider();

export default app;