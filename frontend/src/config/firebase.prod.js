import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Production Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7Uc70_Q7ynGZOeQNZKJNDYzSNn8P7A_k",
  authDomain: "seedbasket-342ca.firebaseapp.com",
  projectId: "seedbasket-342ca",
  storageBucket: "seedbasket-342ca.firebasestorage.app",
  messagingSenderId: "757980611728",
  appId: "1:757980611728:web:7899ed5319aed69e928415",
  measurementId: "G-DG122MGYLL"
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