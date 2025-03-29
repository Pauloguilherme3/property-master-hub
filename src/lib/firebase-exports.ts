
// Mock Firebase exports for authentication
// These are used for compatibility with the rest of the code
// while we use the mock implementations

// Auth types
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Mock Auth functions
export const getAuth = () => ({});
export const createUserWithEmailAndPassword = async () => ({ user: {} });
export const signInWithEmailAndPassword = async () => ({ user: {} });
export const firebaseSignOut = async () => {};
export const onAuthStateChanged = () => () => {};
export const updateProfile = async () => {};

// Mock Analytics functions
export const getAnalytics = () => ({});
export const isSupported = async () => true;

// Mock Firestore functions
export const getFirestore = () => ({});
export const collection = () => ({});
export const doc = () => ({});
export const setDoc = async () => {};
export const getDoc = async () => ({ exists: () => false, data: () => ({}) });
export const getDocs = async () => ({ docs: [] });
export const updateDoc = async () => {};
export const deleteDoc = async () => {};
export const query = () => ({});
export const where = () => ({});

// Mock Firebase app
export const initializeApp = () => ({});
