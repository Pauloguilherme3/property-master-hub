
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
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';

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
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';

// Re-export from firebase/analytics
export {
  getAnalytics,
  isSupported
} from 'firebase/analytics';
