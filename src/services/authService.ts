
// Auth service using real Firebase Authentication and Google Sheets for user data
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  firebaseSignOut,
  onAuthStateChanged,
  FirebaseUser,
  updateProfile
} from "@/lib/firebase-exports";
import { auth } from "@/config/firebase";
import { googleSheetsService } from "./googleSheetsService";
import { User, UserRole, UserStatus } from "@/types";

// Check if Google Sheets is initialized before operations
const checkGoogleSheetsInit = () => {
  if (!googleSheetsService.isConnectedToSheets()) {
    console.error("Google Sheets service is not connected");
    return false;
  }
  return true;
};

// Helper to handle Auth errors
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
  if (!checkGoogleSheetsInit()) {
    await googleSheetsService.connect();
  }
  
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Update profile with display name
    await updateProfile(firebaseUser, { displayName: name });
    
    // Set default role for new users
    const isAdmin = isAdminEmail(email);
    const userRole = isAdmin ? UserRole.ADMINISTRADOR : UserRole.CORRETOR;
    const userStatus = isAdmin ? UserStatus.ATIVO : UserStatus.PENDENTE;

    // Create user document in Google Sheets
    await googleSheetsService.addDocument("users", {
      id: firebaseUser.uid,
      nome: name,
      name: name,
      email: email,
      role: userRole,
      status: userStatus,
      dataCadastro: new Date().toISOString(),
    });

    return firebaseUser;
  } catch (error: any) {
    console.error("SignUp error:", error);
    throw new Error(handleAuthError(error));
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  if (!checkGoogleSheetsInit()) {
    await googleSheetsService.connect();
  }
  
  try {
    // Sign in with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Check if the user is the admin email
    const isAdmin = isAdminEmail(email);
    
    // Get user data from Google Sheets
    const userData = await googleSheetsService.findUserByEmail(email);
    
    if (!userData) {
      // Create user document if it doesn't exist
      const newUser = {
        id: firebaseUser.uid,
        nome: firebaseUser.displayName || email.split('@')[0],
        name: firebaseUser.displayName || email.split('@')[0],
        email: email,
        role: isAdmin ? UserRole.ADMINISTRADOR : UserRole.CORRETOR,
        status: isAdmin ? UserStatus.ATIVO : UserStatus.PENDENTE,
        dataCadastro: new Date().toISOString(),
      };
      
      await googleSheetsService.addDocument("users", newUser);
      console.log("User created in Google Sheets:", newUser);
    } else {
      // If admin email, ensure they have admin status in Google Sheets
      if (isAdmin && userData) {
        // Ensure admin has proper role and active status
        if (userData.role !== UserRole.ADMINISTRADOR || userData.status !== UserStatus.ATIVO) {
          await googleSheetsService.updateDocument("users", userData.id, {
            role: UserRole.ADMINISTRADOR,
            status: UserStatus.ATIVO
          });
          console.log("Admin privileges enforced for admin email");
        }
      }
    }
    
    return firebaseUser;
  } catch (error: any) {
    console.error("SignIn error:", error);
    throw new Error(handleAuthError(error));
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    console.error("SignOut error:", error);
    throw error;
  }
};

// Listen to auth state changes
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};
