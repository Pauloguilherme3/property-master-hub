
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, AuthContextType } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { onAuthChange, signIn as firebaseSignIn, signOut as firebaseSignOut } from "@/services/authService";
import { getDocument, setDocument } from "@/services/dbService";
import { User as FirebaseUser } from "firebase/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to convert Firebase user to our User type
const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
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
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
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
    
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
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
