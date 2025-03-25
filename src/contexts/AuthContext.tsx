
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, AuthContextType } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { onAuthChange, signIn as firebaseSignIn, signOut as firebaseSignOut } from "@/services/authService";
import { getDocument, setDocument } from "@/services/dbService";
import { User as FirebaseUser } from "firebase/auth";
import { auth } from "@/config/firebase";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to convert Firebase user to our User type
const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  try {
    // Try to get user data from Firestore
    const userData = await getDocument("users", firebaseUser.uid);
    
    // If user exists in Firestore, return that data
    if (userData) {
      return userData as User;
    }
    
    // Default user data if not found in Firestore
    const defaultUser: User = {
      id: firebaseUser.uid,
      nome: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuário",
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
      email: firebaseUser.email || "",
      role: UserRole.CORRETOR, // Default role
      avatar: firebaseUser.photoURL || "",
    };
    
    // Save default user to Firestore
    await setDocument("users", firebaseUser.uid, defaultUser);
    
    return defaultUser;
  } catch (error) {
    console.error("Error mapping Firebase user:", error);
    // Fallback to basic user info from Firebase auth
    return {
      id: firebaseUser.uid,
      nome: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuário",
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
      email: firebaseUser.email || "",
      role: UserRole.CORRETOR,
      avatar: firebaseUser.photoURL || "",
    };
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState<boolean>(!!auth);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Firebase is available
    if (!auth) {
      console.error("Firebase authentication is not initialized. Auth features won't work.");
      setIsFirebaseInitialized(false);
      setIsLoading(false);
      return () => {};
    }
    
    let unsubscribe = () => {};
    
    try {
      unsubscribe = onAuthChange(async (firebaseUser) => {
        setIsLoading(true);
        
        if (firebaseUser) {
          try {
            const userData = await mapFirebaseUser(firebaseUser);
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          } catch (error) {
            console.error("Error mapping user data:", error);
            setUser(null);
            localStorage.removeItem("user");
          }
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
        
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error setting up auth state listener:", error);
      setIsLoading(false);
    }
    
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!isFirebaseInitialized) {
      toast({
        title: "Firebase não inicializado",
        description: "O serviço de autenticação não está disponível no momento.",
        variant: "destructive",
      });
      throw new Error("Firebase authentication is not initialized");
    }

    setIsLoading(true);
    
    try {
      const firebaseUser = await firebaseSignIn(email, password);
      const userData = await mapFirebaseUser(firebaseUser);
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo de volta, ${userData.nome}!`,
      });
      
      return userData;
    } catch (error: any) {
      toast({
        title: "Falha no login",
        description: error.message || "E-mail ou senha inválidos",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!isFirebaseInitialized) {
      setUser(null);
      localStorage.removeItem("user");
      return;
    }

    try {
      await firebaseSignOut();
      setUser(null);
      localStorage.removeItem("user");
      
      toast({
        title: "Desconectado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao desconectar",
        description: error.message || "Ocorreu um erro ao tentar desconectar",
        variant: "destructive",
      });
    }
  };

  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.some(role => user.role === role);
    }
    
    return user.role === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
        isFirebaseInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
