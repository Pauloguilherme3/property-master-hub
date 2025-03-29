
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
export const getAuth = () => {
  return {
    currentUser: {
      uid: "mock-user-id",
      email: "mock@example.com",
      displayName: "Mock User",
      photoURL: null
    }
  };
};

export const createUserWithEmailAndPassword = async (auth: any, email: string, password: string) => {
  return {
    user: {
      uid: "mock-user-id",
      email: email,
      displayName: null,
      photoURL: null
    }
  };
};

export const signInWithEmailAndPassword = async (auth: any, email: string, password: string) => {
  return {
    user: {
      uid: "mock-user-id",
      email: email,
      displayName: email.split('@')[0],
      photoURL: null
    }
  };
};

export const firebaseSignOut = async (auth: any) => {};

export const onAuthStateChanged = (auth: any, callback: any) => {
  // Simulate an authentication state change
  setTimeout(() => {
    callback({
      uid: "mock-user-id",
      email: "mock@example.com",
      displayName: "Mock User",
      photoURL: null
    });
  }, 100);
  
  // Return a function to unsubscribe
  return () => {};
};

export const updateProfile = async (user: any, profile: any) => {};

// Mock Analytics functions
export const getAnalytics = (app?: any) => ({});
export const isSupported = async () => true;

// Mock Firestore functions
export const getFirestore = (app?: any) => ({});
export const collection = (firestore: any, path: string) => ({});
export const doc = (firestore: any, path: string, ...pathSegments: string[]) => ({});
export const setDoc = async (docRef: any, data: any) => {};
export const getDoc = async (docRef: any) => ({ exists: () => false, data: () => ({}) });
export const getDocs = async (query: any) => ({ docs: [] });
export const updateDoc = async (docRef: any, data: any) => {};
export const deleteDoc = async (docRef: any) => {};
export const query = (collection: any, ...constraints: any[]) => ({});
export const where = (field: string, operator: string, value: any) => ({});

// Mock Firebase app
export const initializeApp = (config: any) => ({});
