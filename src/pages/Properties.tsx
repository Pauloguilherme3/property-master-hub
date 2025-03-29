
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Filter, 
  Plus, 
  Building 
} from "lucide-react";
import { Empreendimento, UserRole, FiltroEmpreendimento, MANAGER, ADMINISTRATOR, PRODUCT_MANAGER } from "@/types";
import { mockEmpreendimentos } from "@/utils/animations";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { dataService } from "@/services/dataService";
import { CreatePropertyModal } from "@/components/modals/CreatePropertyModal";

const PropertiesPage = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FiltroEmpreendimento>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetching properties data
  const { data: properties = [], isLoading, refetch } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      try {
        // Try to get properties from the data service
        await dataService.initialize();
        const empreendimentos = await dataService.getAllDocuments<Empreendimento>("empreendimentos");
        
        if (empreendimentos.length === 0) {
          return mockEmpreendimentos;
        }
        
        return empreendimentos;
      } catch (error) {
        console.error("Error fetching properties:", error);
        // Fallback to mock data
        return mockEmpreendimentos;
      }
    }
  });

  const canManageProperties = hasPermission([
    MANAGER, 
    ADMINISTRATOR,
    PRODUCT_MANAGER
  ]);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.estado.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (filters.tipoImovel ? property.tipoImovel === filters.tipoImovel : true) &&
      (filters.cidade ? property.cidade === filters.cidade : true) &&
      (filters.estado ? property.estado === filters.estado : true) &&
      (filters.precoMin ? property.preco >= filters.precoMin : true) &&
      (filters.precoMax ? property.preco <= filters.precoMax : true) &&
      (filters.dormitoriosMin ? property.dormitorios >= filters.dormitoriosMin : true) &&
      (filters.areamin ? property.area >= filters.areamin : true) &&
      (filters.status ? property.status === filters.status : true);
    
    return matchesSearch && matchesFilters;
  });

  const handleAddProperty = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    refetch(); // Refresh the property list after adding a new one
  };

  return (
    <div className="container py-10 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
            <p className="text-muted-foreground">
              Manage your real estate properties and their details
            </p>
          </div>
          {canManageProperties && (
            <Button onClick={handleAddProperty}>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select onValueChange={(value) => setFilters({...filters, tipoImovel: value === "all" ? undefined : value})}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="lote">Land</SelectItem>
              <SelectItem value="casa">House</SelectItem>
              <SelectItem value="apartamento">Apartment</SelectItem>
              <SelectItem value="comercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Property Listings</CardTitle>
            <CardDescription>
              View and manage your real estate properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg"></div>
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredProperties.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any properties that match your search criteria.
                  </p>
                  <Button onClick={() => {
                    setSearchTerm("");
                    setFilters({});
                  }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                filteredProperties.map((property) => (
                  <Link 
                    to={`/properties/${property.id}`} 
                    key={property.id}
                    className="group"
                  >
                    <Card className="overflow-hidden transition-all group-hover:shadow-lg">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={property.imagens?.[0] || "/placeholder.svg"}
                          alt={property.nome}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle>{property.nome}</CardTitle>
                        <CardDescription>{property.cidade}, {property.estado}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-2 text-muted-foreground mb-3">
                          {property.descricao}
                        </p>
                        <Button variant="secondary" className="w-full">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <CreatePropertyModal 
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PropertiesPage;
