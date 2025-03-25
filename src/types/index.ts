export enum UserRole {
  CORRETOR = "corretor",
  GERENTE = "gerente",
  SUPERVISOR = "supervisor",
  ADMINISTRADOR = "administrador",
  GERENTE_PRODUTO = "gerente_produto"
}

export interface User {
  id: string;
  nome: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirebaseInitialized: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}
