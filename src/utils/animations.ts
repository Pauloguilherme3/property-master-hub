import { UserRole, Property, Reservation } from "@/types";

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Mock data for properties
export const mockProperties: Property[] = [
  {
    id: "prop-001",
    title: "Luxury Waterfront Villa",
    description: "Stunning waterfront villa with panoramic ocean views, private pool and direct beach access",
    price: 1250000,
    address: "123 Coastal Drive",
    city: "Miami",
    state: "FL",
    zipCode: "33101",
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    status: "available",
    createdAt: "2023-04-10T10:30:00Z",
    updatedAt: "2023-04-15T14:20:00Z",
    createdBy: "agent1"
  },
  {
    id: "prop-002",
    title: "Modern Downtown Apartment",
    description: "Sleek, contemporary apartment in the heart of downtown with high-end finishes and city views",
    price: 750000,
    address: "456 Urban Avenue",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    status: "available",
    createdAt: "2023-05-05T09:15:00Z",
    updatedAt: "2023-05-10T11:45:00Z",
    createdBy: "agent2"
  },
  {
    id: "prop-003",
    title: "Suburban Family Home",
    description: "Spacious family home in a quiet neighborhood with large yard and modern amenities",
    price: 520000,
    address: "789 Maple Street",
    city: "Chicago",
    state: "IL",
    zipCode: "60007",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    status: "reserved",
    createdAt: "2023-03-20T13:40:00Z",
    updatedAt: "2023-06-15T16:30:00Z",
    createdBy: "agent1"
  },
  {
    id: "prop-004",
    title: "Historic Brownstone",
    description: "Beautifully restored historic brownstone with original features and modern updates",
    price: 875000,
    address: "321 Heritage Avenue",
    city: "Boston",
    state: "MA",
    zipCode: "02108",
    bedrooms: 3,
    bathrooms: 2.5,
    area: 210,
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    status: "available",
    createdAt: "2023-02-10T09:30:00Z",
    updatedAt: "2023-02-15T14:20:00Z",
    createdBy: "agent3"
  }
];

// Mock data for reservations
export const mockReservations: Reservation[] = [
  {
    id: "res-001",
    propertyId: "prop-003",
    clientName: "John Smith",
    clientEmail: "john.smith@example.com",
    clientPhone: "555-123-4567",
    startDate: "2023-06-20T14:00:00Z",
    endDate: "2023-06-20T15:30:00Z",
    status: "confirmed",
    notes: "Client is interested in making an offer if the viewing goes well",
    visitType: "in_person",
    createdAt: "2023-06-15T10:30:00Z",
    createdBy: "agent1"
  },
  {
    id: "res-002",
    propertyId: "prop-001",
    clientName: "Emma Johnson",
    clientEmail: "emma.johnson@example.com",
    clientPhone: "555-987-6543",
    startDate: "2023-06-22T10:00:00Z",
    endDate: "2023-06-22T11:30:00Z",
    status: "pending",
    visitType: "virtual",
    createdAt: "2023-06-16T15:45:00Z",
    createdBy: "agent2"
  },
  {
    id: "res-003",
    propertyId: "prop-004",
    clientName: "Michael Brown",
    clientEmail: "michael.brown@example.com",
    clientPhone: "555-456-7890",
    startDate: "2023-06-25T13:00:00Z",
    endDate: "2023-06-25T14:30:00Z",
    status: "confirmed",
    notes: "Client is relocating from out of state, this is their only viewing opportunity",
    visitType: "in_person",
    createdAt: "2023-06-18T09:15:00Z",
    createdBy: "agent1"
  }
];

// Animation utilities
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

export const staggerChildren = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

export const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMINISTRATOR:
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case UserRole.MANAGER:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case UserRole.SUPERVISOR:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    case UserRole.PRODUCT_MANAGER:
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
    case UserRole.AGENT:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case UserRole.STAFF:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};
