
// This file serves as a barrel export for compatibility with existing code
// It provides browser-compatible types and interfaces for Google Sheets/Drive integrations

// Define FirebaseUser type for compatibility with existing code
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Define minimal authentication methods required by existing code
export const getAuth = () => ({ currentUser: null });
export const createUserWithEmailAndPassword = async () => ({ user: {} as FirebaseUser });
export const signInWithEmailAndPassword = async () => ({ user: {} as FirebaseUser });
export const firebaseSignOut = async () => {};
export const onAuthStateChanged = (auth: any, callback: (user: FirebaseUser | null) => void) => {
  // Invoke callback immediately with null (no user)
  setTimeout(() => callback(null), 0);
  // Return no-op unsubscribe
  return () => {};
};
export const updateProfile = async () => {};

// Define minimal Firestore methods required by existing code
export const collection = () => ({});
export const doc = () => ({});
export const setDoc = async () => {};
export const getDoc = async () => ({ exists: () => false, data: () => null, id: '' });
export const getDocs = async () => ({ docs: [] });
export const updateDoc = async () => {};
export const deleteDoc = async () => {};
export const query = () => ({});
export const where = () => ({});

// Export a placeholder DocumentData type for compatibility
export type DocumentData = Record<string, any>;
export type QueryConstraint = any;

// Define a minimal analytics interface
export const getAnalytics = () => ({});
export const isSupported = async () => true;
