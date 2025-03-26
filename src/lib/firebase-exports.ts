
// This file serves as a barrel export for Firebase modules
// It helps centralize and standardize Firebase imports across the application

// Re-export from firebase/app
export { initializeApp } from 'firebase/app';

// Re-export from firebase/auth
export { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

// Define FirebaseUser type without trying to import User directly
export type FirebaseUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  providerData?: Array<{
    providerId: string;
    uid: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
  }>;
};

// Re-export from firebase/firestore
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
  where,
  type DocumentData,
  type QueryConstraint
} from 'firebase/firestore';

// Re-export from firebase/analytics
export {
  getAnalytics,
  isSupported
} from 'firebase/analytics';
