
// Firebase configuration
import { 
  initializeApp, 
  getAuth, 
  getFirestore, 
  getAnalytics, 
  isSupported 
} from '@/lib/firebase-exports';

// Firebase configuration using GitHub Actions secrets
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
let app;
let analytics;
let auth;
let db;

try {
  // Check if Firebase is already initialized
  if (!app) {
    console.log("Initializing Firebase with config:", { 
      ...firebaseConfig, 
      apiKey: firebaseConfig.apiKey ? "REDACTED" : "NOT_SET"
    });
    
    app = initializeApp(firebaseConfig);
    
    // Only initialize analytics if supported and in browser environment
    if (typeof window !== 'undefined') {
      // Use async function for analytics to handle support check
      const initAnalytics = async () => {
        try {
          if (await isSupported()) {
            analytics = getAnalytics(app);
            console.log("Firebase Analytics initialized");
          } else {
            console.log("Firebase Analytics not supported in this environment");
          }
        } catch (error) {
          console.error("Error initializing Analytics:", error);
        }
      };
      
      initAnalytics();
    }
    
    auth = getAuth(app);
    db = getFirestore(app);
    
    console.log("Firebase initialized successfully");
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  console.error("Firebase initialization failed. Some features may not work properly.");
}

export { app, analytics, auth, db };
