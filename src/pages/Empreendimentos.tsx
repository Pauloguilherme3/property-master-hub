
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Grid2X2, 
  List, 
  Search, 
  SlidersHorizontal, 
  X, 
  Plus, 
  Building2,
  MapPin,
  Eye,
  Edit
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { UserRole } from "@/types";

export default function Empreendimentos() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState<any>({});
  const [categorias, setCategorias] = useState<any[]>([]);
  const [cidades, setCidades] = useState<any[]>([]);

  // Obter dados dos empreendimentos
  const { data: empreendimentos = [], isLoading, refetch } = useQuery({
    queryKey: ["empreendimentos"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('empreendimentos')
          .select(`
            *,
            empreendimento_categorias(categoria_id),
            empreendimento_cidades(cidade_id),
            empreendimento_construtoras(construtora_id)
          `)
          .eq('status_empreendimento', 'ativo');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Erro ao buscar empreendimentos:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar empreendimentos",
          variant: "destructive"
        });
        return [];
      }
    }
  });

  // Carregar filtros
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [categoriasResult, cidadesResult] = await Promise.allSettled([
          supabase.from('categorias').select('*').eq('ativo', true),
          supabase.from('cidades').select('*').eq('ativo', true)
        ]);

        if (categoriasResult.status === 'fulfilled' && categoriasResult.value.data) {
          setCategorias(categoriasResult.value.data);
        }
        if (cidadesResult.status === 'fulfilled' && cidadesResult.value.data) {
          setCidades(cidadesResult.value.data);
        }
      } catch (error) {
        console.error('Erro ao carregar filtros:', error);
      }
    };

    loadFilters();
  }, []);

  // Filtrar empreendimentos
  const empreendimentosFiltrados = empreendimentos.filter(emp => {
    const matchesSearch = 
      emp.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.endereco_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.titulo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (filtros.metragemMin ? (emp.metragem_min || 0) >= filtros.metragemMin : true) &&
      (filtros.metragemMax ? (emp.metragem_max || 0) <= filtros.metragemMax : true);
    
    return matchesSearch && matchesFilters;
  });

  const handleAddProperty = () => {
    navigate('/empreendimento-cadastro');
  };

  const handleViewProperty = (id: string) => {
    navigate(`/empreendimentos/${id}`);
  };

  const handleEditProperty = (id: string) => {
    navigate(`/empreendimentos/${id}/editar`);
  };

  const canManageProperties = user && (user.role === UserRole.ADMINISTRADOR || user.role === UserRole.GERENTE);

  return (
    <div className="container py-10 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Empreendimentos</h1>
            <p className="text-muted-foreground">
              Explore e gerencie seus empreendimentos imobiliários
            </p>
          </div>
          {canManageProperties && (
            <Button onClick={handleAddProperty}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Empreendimento
            </Button>
          )}
        </div>

        <Tabs defaultValue="properties" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="properties">Empreendimentos</TabsTrigger>
              {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
            </TabsList>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid2X2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <TabsContent value="properties" className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-0.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar empreendimentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {showFilters && (
              <Card>
                <CardHeader>
                  <CardTitle>Filtros</CardTitle>
                  <CardDescription>
                    Use os filtros abaixo para refinar sua busca
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-medium">Metragem (m²)</h4>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Mínimo"
                        className="w-full"
                        value={filtros.metragemMin || ""}
                        onChange={(e) => setFiltros(prev => ({ ...prev, metragemMin: Number(e.target.value) }))}
                      />
                      <Input
                        type="number"
                        placeholder="Máximo"
                        className="w-full"
                        value={filtros.metragemMax || ""}
                        onChange={(e) => setFiltros(prev => ({ ...prev, metragemMax: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        setSearchTerm("");
                        setFiltros({});
                        setShowFilters(false);
                      }}
                    >
                      Limpar Filtros
                      <X className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg" />
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-muted rounded w-full mb-2" />
                      <div className="h-6 bg-muted rounded w-20" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : empreendimentosFiltrados.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center space-y-4 py-20">
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                  <h2 className="text-2xl font-semibold">Nenhum empreendimento encontrado</h2>
                  <p className="text-muted-foreground text-center max-w-md">
                    Não encontramos nenhum empreendimento que corresponda aos seus critérios de busca.
                  </p>
                  {canManageProperties && (
                    <Button onClick={handleAddProperty}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Primeiro Empreendimento
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {empreendimentosFiltrados.map(empreendimento => (
                  <PropertyCard
                    key={empreendimento.id}
                    empreendimento={empreendimento}
                    onView={() => handleViewProperty(empreendimento.id)}
                    onEdit={canManageProperties ? () => handleEditProperty(empreendimento.id) : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {empreendimentosFiltrados.map(empreendimento => (
                  <Card key={empreendimento.id} className="transition-all hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{empreendimento.nome}</h3>
                            <Badge variant="outline">{empreendimento.status_empreendimento}</Badge>
                          </div>
                          {empreendimento.endereco_completo && (
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {empreendimento.endereco_completo}
                            </div>
                          )}
                          {empreendimento.descricao && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                              {empreendimento.descricao}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            {empreendimento.metragem_min && empreendimento.metragem_max && (
                              <span className="text-muted-foreground">
                                {empreendimento.metragem_min}m² - {empreendimento.metragem_max}m²
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProperty(empreendimento.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          {canManageProperties && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProperty(empreendimento.id)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
