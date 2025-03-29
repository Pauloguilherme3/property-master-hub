
// Real Firebase exports for authentication
export { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

// Define FirebaseUser type for compatibility with existing code
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Analytics exports
export { 
  getAnalytics, 
  isSupported 
} from "firebase/analytics";

// Firestore exports
export {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

// Firebase app exports
export { initializeApp } from "firebase/app";
