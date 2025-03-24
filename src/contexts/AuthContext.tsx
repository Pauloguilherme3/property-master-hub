
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, AuthContextType } from "@/types";
import { useToast } from "@/components/ui/use-toast";

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    nome: "Usuário Corretor",
    name: "Usuário Corretor", // Adding English alias for compatibility
    email: "corretor@example.com",
    password: "password",
    role: UserRole.CORRETOR,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: "2",
    nome: "Usuário Gerente",
    name: "Usuário Gerente", // Adding English alias for compatibility
    email: "gerente@example.com",
    password: "password",
    role: UserRole.GERENTE,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: "3",
    nome: "Usuário Administrador",
    name: "Usuário Administrador", // Adding English alias for compatibility
    email: "admin@example.com",
    password: "password",
    role: UserRole.ADMINISTRADOR,
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      // Explicitly setting as User type to ensure all required properties exist
      const userToStore: User = {
        id: userWithoutPassword.id,
        nome: userWithoutPassword.nome,
        email: userWithoutPassword.email,
        role: userWithoutPassword.role,
        avatar: userWithoutPassword.avatar,
        name: userWithoutPassword.name // Add the name alias for compatibility
      };
      
      setUser(userToStore);
      localStorage.setItem("user", JSON.stringify(userToStore));
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo de volta, ${userToStore.nome}!`,
      });
    } else {
      toast({
        title: "Falha no login",
        description: "E-mail ou senha inválidos",
        variant: "destructive",
      });
      throw new Error("Credenciais inválidas");
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Desconectado",
      description: "Você foi desconectado com sucesso",
    });
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
