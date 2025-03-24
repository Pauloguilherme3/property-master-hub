
export enum UserRole {
  AGENT = "agent",
  MANAGER = "manager",
  SUPERVISOR = "supervisor",
  PRODUCT_MANAGER = "product_manager",
  ADMINISTRATOR = "administrator",
  STAFF = "staff"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  featured: boolean;
  status: "available" | "reserved" | "sold";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Reservation {
  id: string;
  propertyId: string;
  property?: Property;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  startDate: string;
  endDate: string;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}
