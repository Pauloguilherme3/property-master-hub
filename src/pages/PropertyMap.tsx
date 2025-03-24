
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Filter, 
  MapPin, 
  Search,
  List
} from "lucide-react";
import { Property } from "@/types";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { useToast } from "@/components/ui/use-toast";

// Mock properties with coordinates
const mockProperties: Property[] = [
  {
    id: "prop001",
    title: "Modern Downtown Apartment",
    description: "Beautiful apartment in the heart of downtown with amazing city views.",
    price: 450000,
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
    featured: true,
    status: "available",
    coordinates: {
      lat: 37.7749,
      lng: -122.4194
    },
    amenities: ["Parking", "Gym", "Pool", "Doorman"],
    createdAt: "2023-04-15T10:00:00Z",
    updatedAt: "2023-04-15T10:00:00Z",
    createdBy: "user1"
  },
  {
    id: "prop002",
    title: "Luxury Beach House",
    description: "Stunning beachfront property with direct access to the ocean.",
    price: 1200000,
    address: "456 Ocean Drive",
    city: "Malibu",
    state: "CA",
    zipCode: "90265",
    bedrooms: 4,
    bathrooms: 3.5,
    area: 2800,
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
    featured: true,
    status: "available",
    coordinates: {
      lat: 34.0259,
      lng: -118.7798
    },
    amenities: ["Beach Access", "Deck", "Hot Tub", "Fireplace"],
    createdAt: "2023-03-10T10:00:00Z",
    updatedAt: "2023-03-10T10:00:00Z",
    createdBy: "user2"
  },
  {
    id: "prop003",
    title: "Cozy Mountain Cabin",
    description: "Charming cabin surrounded by nature with stunning mountain views.",
    price: 350000,
    address: "789 Pine Road",
    city: "Aspen",
    state: "CO",
    zipCode: "81611",
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
    featured: false,
    status: "available",
    coordinates: {
      lat: 39.1911,
      lng: -106.8175
    },
    amenities: ["Fireplace", "Deck", "Mountain View", "Hiking Trails"],
    createdAt: "2023-05-22T10:00:00Z",
    updatedAt: "2023-05-22T10:00:00Z",
    createdBy: "user1"
  }
];

export default function PropertyMap() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  // Fetching properties data
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockProperties;
    }
  });

  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // This would be replaced with actual Map implementation
  const handleMapInteraction = () => {
    toast({
      title: "Map Feature",
      description: "Interactive map functionality will be integrated soon.",
    });
  };

  return (
    <div className="container py-10 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Property Map</h1>
            <p className="text-muted-foreground">
              Explore properties by location on the interactive map
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === "map" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("map")}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Map View
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="mr-2 h-4 w-4" />
              List View
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by address, city, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 max-w-lg"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {viewMode === "map" ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Interactive Property Map</CardTitle>
              <CardDescription>
                Click on a property marker to view details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="bg-muted h-[70vh] rounded-md relative flex items-center justify-center"
                onClick={handleMapInteraction}
              >
                <div className="text-center p-6 max-w-md">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Interactive Map Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    Our interactive property map will allow you to browse properties by location,
                    view property details, and get directions.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {filteredProperties.map((property) => (
                      <div key={property.id} className="inline-flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {property.city}, {property.state}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <p>Loading properties...</p>
            ) : filteredProperties.length === 0 ? (
              <p>No properties found matching your search.</p>
            ) : (
              filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
