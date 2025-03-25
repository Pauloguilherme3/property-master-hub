
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from "firebase/auth";
import { auth } from "@/config/firebase";

// Check if Firebase is initialized before operations
const checkFirebaseInit = () => {
  if (!auth) {
    // Instead of throwing, return a null state that can be handled
    console.error("Firebase authentication is not initialized");
    return false;
  }
  return true;
};

// Sign up with email and password
export const signUp = async (email: string, password: string, name: string) => {
  if (!checkFirebaseInit()) {
    throw new Error("Firebase authentication is not initialized");
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(userCredential.user, { displayName: name });
  }
  return userCredential.user;
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  if (!checkFirebaseInit()) {
    throw new Error("Firebase authentication is not initialized");
  }
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Sign out
export const signOut = () => {
  if (!checkFirebaseInit()) {
    throw new Error("Firebase authentication is not initialized");
  }
  return firebaseSignOut(auth);
};

// Listen to auth state changes
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  if (!checkFirebaseInit()) {
    // If auth is not initialized, immediately call the callback with null
    setTimeout(() => callback(null), 0);
    // Return a no-op unsubscribe function
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  if (!checkFirebaseInit()) {
    return null;
  }
  return auth.currentUser;
};
