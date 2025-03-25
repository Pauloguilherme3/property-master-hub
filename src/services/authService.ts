
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  AuthError
} from "firebase/auth";
import { auth } from "@/config/firebase";

// Check if Firebase is initialized before operations
const checkFirebaseInit = () => {
  if (!auth) {
    console.error("Firebase authentication is not initialized");
    return false;
  }
  return true;
};

// Helper to handle Firebase Auth errors
const handleAuthError = (error: any): string => {
  console.error("Auth error details:", error);
  
  if (error.code === "auth/user-disabled") {
    return "Esta conta de usuário foi desativada pelo administrador.";
  } else if (error.code === "auth/invalid-credential") {
    return "Credenciais inválidas. Verifique seu e-mail e senha.";
  } else if (error.code === "auth/invalid-email") {
    return "O endereço de e-mail não é válido.";
  } else if (error.code === "auth/user-not-found") {
    return "Não há usuário correspondente a este e-mail.";
  } else if (error.code === "auth/wrong-password") {
    return "A senha está incorreta.";
  } else if (error.code === "auth/too-many-requests") {
    return "Acesso temporariamente bloqueado devido a muitas tentativas falhas. Tente novamente mais tarde.";
  } else if (error.code === "auth/network-request-failed") {
    return "Falha na conexão de rede. Verifique sua conexão com a internet.";
  } else {
    return error.message || "Ocorreu um erro de autenticação.";
  }
};

// Sign up with email and password
export const signUp = async (email: string, password: string, name: string) => {
  if (!checkFirebaseInit()) {
    throw new Error("Firebase authentication is not initialized");
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }
    return userCredential.user;
  } catch (error: any) {
    console.error("SignUp error:", error);
    throw new Error(handleAuthError(error));
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  if (!checkFirebaseInit()) {
    throw new Error("Firebase authentication is not initialized");
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("SignIn error:", error);
    throw new Error(handleAuthError(error));
  }
};

// Sign out
export const signOut = () => {
  if (!checkFirebaseInit()) {
    throw new Error("Firebase authentication is not initialized");
  }
  
  try {
    return firebaseSignOut(auth);
  } catch (error: any) {
    console.error("SignOut error:", error);
    throw new Error(error.message || "Erro ao fazer logout");
  }
};

// Listen to auth state changes
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  if (!checkFirebaseInit()) {
    // If auth is not initialized, immediately call the callback with null
    setTimeout(() => callback(null), 0);
    // Return a no-op unsubscribe function
    return () => {};
  }
  
  try {
    return onAuthStateChanged(auth, callback);
  } catch (error) {
    console.error("Error setting up auth state listener:", error);
    setTimeout(() => callback(null), 0);
    return () => {};
  }
};

// Get current user
export const getCurrentUser = () => {
  if (!checkFirebaseInit()) {
    return null;
  }
  return auth.currentUser;
};
