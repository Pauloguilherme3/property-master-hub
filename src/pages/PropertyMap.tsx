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
const sampleProperties = [
  {
    id: "1",
    nome: "Edifício Aurora",
    descricao: "Apartamentos de luxo com vista para o mar",
    endereco: "Av. Beira Mar, 1000",
    cidade: "Florianópolis",
    estado: "SC",
    preco: 750000,
    coordenadas: { lat: -27.595417, lng: -48.548361 },
    status: "disponivel",
    imagens: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"],
    // ... other properties
  },
  {
    id: "2",
    nome: "Residencial Montanha",
    descricao: "Casas em condomínio fechado com área verde",
    endereco: "Rua das Palmeiras, 500",
    cidade: "Gramado",
    estado: "RS",
    preco: 950000,
    coordenadas: { lat: -29.373464, lng: -50.876490 },
    status: "disponivel",
    imagens: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"],
    // ... other properties
  },
  {
    id: "3",
    nome: "Condomínio Vista Verde",
    descricao: "Terrenos em loteamento planejado",
    endereco: "Estrada do Sol, Km 10",
    cidade: "Belo Horizonte",
    estado: "MG",
    preco: 320000,
    coordenadas: { lat: -19.917854, lng: -43.934450 },
    status: "disponivel",
    imagens: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"],
    // ... other properties
  },
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
      return sampleProperties;
    }
  });

  const filteredProperties = properties.filter(property => 
    property.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.estado.toLowerCase().includes(searchTerm.toLowerCase())
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
                        {property.cidade}, {property.estado}
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
