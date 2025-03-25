
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
    throw new Error("Firebase authentication is not initialized");
  }
};

// Sign up with email and password
export const signUp = async (email: string, password: string, name: string) => {
  checkFirebaseInit();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(userCredential.user, { displayName: name });
  }
  return userCredential.user;
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  checkFirebaseInit();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Sign out
export const signOut = () => {
  checkFirebaseInit();
  return firebaseSignOut(auth);
};

// Listen to auth state changes
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  checkFirebaseInit();
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  checkFirebaseInit();
  return auth.currentUser;
};
