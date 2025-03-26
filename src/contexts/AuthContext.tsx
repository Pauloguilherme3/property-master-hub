import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, UserStatus, AuthContextType } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { 
  onAuthChange, 
  signIn as firebaseSignIn, 
  signOut as firebaseSignOut,
  signUp as firebaseSignUp
} from "@/services/authService";
import { getDocument, setDocument, updateDocument } from "@/services/dbService";
import { FirebaseUser } from "@/lib/firebase-exports";
import { auth } from "@/config/firebase";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "paulo100psy@gmail.com";

const isAdminEmail = (email: string): boolean => {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
};

const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  try {
    const email = firebaseUser.email || "";
    const isAdmin = isAdminEmail(email);
    
    const userData = await getDocument("users", firebaseUser.uid);
    
    if (userData) {
      if (isAdmin && (userData.role !== UserRole.ADMINISTRADOR || userData.status !== UserStatus.ATIVO)) {
        const updatedUser = {
          ...userData,
          role: UserRole.ADMINISTRADOR,
          status: UserStatus.ATIVO
        };
        
        await updateDocument("users", firebaseUser.uid, {
          role: UserRole.ADMINISTRADOR,
          status: UserStatus.ATIVO
        });
        
        console.log("Admin privileges enforced for admin user");
        return updatedUser as User;
      }
      
      return userData as User;
    }
    
    const defaultUser: User = {
      id: firebaseUser.uid,
      nome: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuário",
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
      email: email,
      role: isAdmin ? UserRole.ADMINISTRADOR : UserRole.CORRETOR,
      status: isAdmin ? UserStatus.ATIVO : UserStatus.PENDENTE,
      dataCadastro: new Date().toISOString(),
      avatar: firebaseUser.photoURL || "",
    };
    
    await setDocument("users", firebaseUser.uid, defaultUser);
    
    return defaultUser;
  } catch (error) {
    console.error("Error mapping Firebase user:", error);
    const email = firebaseUser.email || "";
    const isAdmin = isAdminEmail(email);
    
    return {
      id: firebaseUser.uid,
      nome: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuário",
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
      email: email,
      role: isAdmin ? UserRole.ADMINISTRADOR : UserRole.CORRETOR,
      status: isAdmin ? UserStatus.ATIVO : UserStatus.PENDENTE,
      dataCadastro: new Date().toISOString(),
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
            
            if (isAdminEmail(firebaseUser.email || "")) {
              console.log("Admin user detected, granting full access");
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
              setIsLoading(false);
              return;
            }
            
            if (userData.status === UserStatus.ATIVO) {
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
            } else {
              setUser(null);
              localStorage.removeItem("user");
              
              if (auth.currentUser) {
                await firebaseSignOut();
              }
              
              if (userData.status === UserStatus.PENDENTE) {
                toast({
                  title: "Cadastro pendente",
                  description: "Seu cadastro está aguardando aprovação por um administrador.",
                  duration: 5000,
                });
              } else if (userData.status === UserStatus.INATIVO) {
                toast({
                  variant: "destructive",
                  title: "Acesso negado",
                  description: "Seu cadastro foi desativado ou rejeitado.",
                  duration: 5000,
                });
              }
            }
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
  }, [toast]);

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
      const isAdmin = isAdminEmail(email);
      
      const firebaseUser = await firebaseSignIn(email, password);
      const userData = await mapFirebaseUser(firebaseUser);
      
      if (isAdmin) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, Administrador!`,
        });
        
        return userData;
      }
      
      if (userData.status !== UserStatus.ATIVO) {
        await firebaseSignOut();
        
        if (userData.status === UserStatus.PENDENTE) {
          throw new Error("Seu cadastro está aguardando aprovação por um administrador.");
        } else {
          throw new Error("Seu cadastro foi desativado ou rejeitado.");
        }
      }
      
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

  const register = async (email: string, password: string, name: string) => {
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
      const firebaseUser = await firebaseSignUp(email, password, name);
      
      const newUser: User = {
        id: firebaseUser.uid,
        nome: name,
        name: name,
        email: email,
        role: UserRole.CORRETOR,
        status: UserStatus.PENDENTE,
        dataCadastro: new Date().toISOString(),
        avatar: "",
      };
      
      await setDocument("users", firebaseUser.uid, newUser);
      
      await firebaseSignOut();
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
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
    
    if (user.status !== UserStatus.ATIVO) return false;
    
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
        register,
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
