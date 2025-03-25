import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Slider 
} from "@/components/ui/slider";
import { 
  Grid2X2, 
  List, 
  Search, 
  SlidersHorizontal, 
  X, 
  Plus 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Empreendimento, FiltroEmpreendimento, UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { mockEmpreendimentos } from "@/utils/animations";

export default function Empreendimentos() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState<FiltroEmpreendimento>({});

  // Obter dados dos empreendimentos
  const { data: empreendimentos = [] } = useQuery({
    queryKey: ["empreendimentos"],
    queryFn: async () => {
      // Este seria uma chamada de API em uma aplicação real
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockEmpreendimentos;
    }
  });

  // Filtrar empreendimentos
  const empreendimentosFiltrados = empreendimentos.filter(emp => {
    const matchesSearch = 
      emp.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.estado.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (filtros.tipoImovel ? emp.tipoImovel === filtros.tipoImovel : true) &&
      (filtros.cidade ? emp.cidade.includes(filtros.cidade) : true) &&
      (filtros.estado ? emp.estado === filtros.estado : true) &&
      (filtros.precoMin ? emp.preco >= filtros.precoMin : true) &&
      (filtros.precoMax ? emp.preco <= filtros.precoMax : true) &&
      (filtros.dormitoriosMin ? emp.dormitorios >= filtros.dormitoriosMin : true) &&
      (filtros.areamin ? emp.area >= filtros.areamin : true) &&
      (filtros.areaMax ? emp.area <= filtros.areaMax : true) &&
      (filtros.status ? emp.status === filtros.status : true);
    
    return matchesSearch && matchesFilters;
  });

  // Obter valores únicos para os filtros
  const tiposImoveis = [...new Set(empreendimentos.map(e => e.tipoImovel))];
  const cidades = [...new Set(empreendimentos.map(e => e.cidade))];
  const estados = [...new Set(empreendimentos.map(e => e.estado))];

  const handleFilterTipoImovel = (value: string) => {
    setFiltros(prev => ({
      ...prev,
      tipoImovel: value === "todos" ? undefined : value
    }));
  };

  const handleFilterCidade = (value: string) => {
    setFiltros(prev => ({
      ...prev,
      cidade: value === "todas" ? undefined : value
    }));
  };

  const handleAddProperty = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Add property functionality will be available soon.",
    });
  };

  const canManageProperties = hasPermission([
    UserRole.GERENTE, 
    UserRole.ADMINISTRADOR,
    UserRole.GERENTE_PRODUTO
  ]);

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
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div>
                    <h4 className="mb-2 font-medium">Tipo de Imóvel</h4>
                    <Select onValueChange={handleFilterTipoImovel}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todos os Tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os Tipos</SelectItem>
                        {tiposImoveis.map(tipo => (
                          <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium">Cidade</h4>
                    <Select onValueChange={handleFilterCidade}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todas as Cidades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas as Cidades</SelectItem>
                        {cidades.map(cidade => (
                          <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium">Estado</h4>
                    <Select onValueChange={(value) => setFiltros(prev => ({ ...prev, estado: value === "todos" ? undefined : value }))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todos os Estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os Estados</SelectItem>
                        {estados.map(estado => (
                          <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-3">
                    <Separator />
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium">Faixa de Preço</h4>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Preço Mínimo"
                        className="w-full"
                        value={filtros.precoMin || ""}
                        onChange={(e) => setFiltros(prev => ({ ...prev, precoMin: Number(e.target.value) }))}
                      />
                      <Input
                        type="number"
                        placeholder="Preço Máximo"
                        className="w-full"
                        value={filtros.precoMax || ""}
                        onChange={(e) => setFiltros(prev => ({ ...prev, precoMax: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium">Número de Quartos</h4>
                    <Select onValueChange={(value) => setFiltros(prev => ({ ...prev, dormitoriosMin: Number(value) }))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Qualquer Número" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Qualquer Número</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium">Tamanho (m²)</h4>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Mínimo"
                        className="w-full"
                        value={filtros.areamin || ""}
                        onChange={(e) => setFiltros(prev => ({ ...prev, areamin: Number(e.target.value) }))}
                      />
                       <Input
                        type="number"
                        placeholder="Máximo"
                        className="w-full"
                        value={filtros.areaMax || ""}
                        onChange={(e) => setFiltros(prev => ({ ...prev, areaMax: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-3">
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

            {empreendimentosFiltrados.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center space-y-4 py-20">
                  <h2 className="text-2xl font-semibold">Nenhum resultado encontrado</h2>
                  <p className="text-muted-foreground">
                    Não encontramos nenhum empreendimento que corresponda aos seus critérios de busca.
                  </p>
                </CardContent>
              </Card>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {empreendimentosFiltrados.map(empreendimento => (
                  <Card key={empreendimento.id}>
                    <CardHeader>
                      <CardTitle>{empreendimento.nome}</CardTitle>
                      <CardDescription>{empreendimento.cidade}, {empreendimento.estado}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Preço: {empreendimento.preco}</p>
                      <Badge>{empreendimento.status}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {empreendimentosFiltrados.map(empreendimento => (
                  <Card key={empreendimento.id}>
                    <CardHeader>
                      <CardTitle>{empreendimento.nome}</CardTitle>
                      <CardDescription>{empreendimento.cidade}, {empreendimento.estado}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Preço: {empreendimento.preco}</p>
                      <Badge>{empreendimento.status}</Badge>
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
