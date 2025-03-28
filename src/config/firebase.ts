
// Firebase configuration - now using mock implementations

// Note: This file now provides mock Firebase functionality
// It uses the firebase-exports.ts mock implementations
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123def456",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ABC123DEF"
};

// Get mock implementations
import { 
  getAuth, 
  getAnalytics, 
  isSupported 
} from '@/lib/firebase-exports';

// Initialize mock auth and analytics
let app = {};
let analytics = {};
let auth = getAuth();
let db = {};

try {
  console.log("Using mock Firebase implementation with Google Sheets/Drive backend");
  
  // Only initialize analytics in browser environment
  if (typeof window !== 'undefined') {
    // Mock analytics initialization
    const initAnalytics = async () => {
      try {
        if (await isSupported()) {
          analytics = getAnalytics();
          console.log("Mock Analytics initialized");
        } else {
          console.log("Analytics not supported in this environment");
        }
      } catch (error) {
        console.error("Error initializing Analytics:", error);
      }
    };
    
    initAnalytics();
  }
  
  console.log("Mock Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing mock Firebase:", error);
}

export { app, analytics, auth, db };
