
// Firebase configuration for authentication and hosting
import { initializeApp, getAuth, getAnalytics, isSupported, getFirestore } from "@/lib/firebase-exports";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123def456",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ABC123DEF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
let analytics = null;

// Initialize Analytics in browser environment
if (typeof window !== 'undefined') {
  const initAnalytics = async () => {
    try {
      if (await isSupported()) {
        analytics = getAnalytics(app);
        console.log("Firebase Analytics initialized");
      } else {
        console.log("Analytics not supported in this environment");
      }
    } catch (error) {
      console.error("Error initializing Analytics:", error);
    }
  };
  
  initAnalytics();
}

console.log("Firebase initialized successfully for authentication");

export { app, analytics, auth, firestore };
