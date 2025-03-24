
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
  virtualTour?: string;
  videos?: string[];
  featured: boolean;
  status: "available" | "reserved" | "sold";
  coordinates?: {
    lat: number;
    lng: number;
  };
  amenities?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedAgentId?: string;
}

export interface Agent {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  specialties: string[];
  avatar?: string;
  rating: number;
  salesVolume: number;
  activeListings: number;
  closedDeals: number;
  joinedAt: string;
  status: "active" | "inactive" | "on_leave";
}

export interface AgentPerformance {
  agentId: string;
  period: string;
  leadsAssigned: number;
  leadsConverted: number;
  propertiesSold: number;
  revenue: number;
  customerSatisfaction: number;
  responseTime: number;
}

export interface Lead {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyId?: string;
  status: "new" | "contacted" | "qualified" | "unqualified" | "converted" | "lost";
  source: string;
  notes?: string;
  assignedAgentId?: string;
  createdAt: string;
  updatedAt: string;
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
  agentId?: string;
  visitType: "in_person" | "virtual";
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
