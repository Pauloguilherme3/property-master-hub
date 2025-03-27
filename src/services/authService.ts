import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  firebaseSignOut,
  onAuthStateChanged,
  FirebaseUser,
  updateProfile
} from "@/lib/firebase-exports";
import { auth } from "@/config/firebase";
import { setDocument, getDocument, updateDocument } from "./dbService";
import { User, UserRole, UserStatus } from "@/types";

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

// Define admin email with exact match
const ADMIN_EMAIL = "paulo100psy@gmail.com";

// Check if email is admin
const isAdminEmail = (email: string): boolean => {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
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

    // Set default role for new users
    const isAdmin = isAdminEmail(email);
    const userRole = isAdmin ? UserRole.ADMINISTRADOR : UserRole.CORRETOR;
    const userStatus = isAdmin ? UserStatus.ATIVO : UserStatus.PENDENTE;

    // Create user document in Firestore
    await setDocument("users", userCredential.user.uid, {
      nome: name,
      name: name,
      email: email,
      role: userRole,
      status: userStatus,
      dataCadastro: new Date().toISOString(),
    });

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
    // Check if the user is the admin email
    const isAdmin = isAdminEmail(email);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // If admin email, ensure they have admin status in Firestore
    if (isAdmin) {
      const userData = await getDocument("users", userCredential.user.uid);
      if (userData) {
        // Ensure admin has proper role and active status
        if (userData.role !== UserRole.ADMINISTRADOR || userData.status !== UserStatus.ATIVO) {
          await updateDocument("users", userCredential.user.uid, {
            role: UserRole.ADMINISTRADOR,
            status: UserStatus.ATIVO
          });
          console.log("Admin privileges enforced for admin email");
        }
      }
    }
    
    return userCredential.user;
  } catch (error: any) {
    console.error("SignIn error:", error);
    throw new Error(handleAuthError(error));
  }
};

// Sign out
export const signOut = async () => {
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
