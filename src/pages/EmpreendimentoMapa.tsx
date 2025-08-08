
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
  MapPin, 
  Search,
  List,
  Building
} from "lucide-react";
import EmpreendimentosMap from "@/components/map/EmpreendimentosMap";
import { Empreendimento } from "@/types";
import { mockEmpreendimentos } from "@/utils/animations";
import { useToast } from "@/components/ui/use-toast";

const EmpreendimentoMapaPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"mapa" | "lista">("mapa");
  const [tipoImovelFilter, setTipoImovelFilter] = useState("todos");
  const [cidadeFilter, setCidadeFilter] = useState("todas");

  // Fetching empreendimentos data
  const { data: empreendimentos = [], isLoading } = useQuery({
    queryKey: ["empreendimentos"],
    queryFn: async () => {
      // Este seria uma chamada de API em uma aplicação real
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockEmpreendimentos;
    }
  });

  const filteredEmpreendimentos = empreendimentos.filter(empreendimento => {
    const matchesSearch = 
      empreendimento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empreendimento.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empreendimento.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empreendimento.estado.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipoImovel = tipoImovelFilter === "todos" || 
      empreendimento.tipoImovel === tipoImovelFilter;
    
    const matchesCidade = cidadeFilter === "todas" || 
      empreendimento.cidade === cidadeFilter;
    
    return matchesSearch && matchesTipoImovel && matchesCidade;
  });

  // Obter cidades únicas para o filtro
  const cidades = [...new Set(empreendimentos.map(e => e.cidade))];

  // Esta seria uma função real de interação com o mapa
  const handleMapInteraction = () => {
    toast({
      title: "Funcionalidade de Mapa",
      description: "A funcionalidade de mapa interativo será integrada em breve.",
    });
  };

  return (
    <div className="container py-10 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mapa de Empreendimentos</h1>
            <p className="text-muted-foreground">
              Explore empreendimentos por localização no mapa interativo
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === "mapa" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("mapa")}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Visualização de Mapa
            </Button>
            <Button 
              variant={viewMode === "lista" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("lista")}
            >
              <List className="mr-2 h-4 w-4" />
              Visualização em Lista
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por endereço, cidade ou estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={tipoImovelFilter} onValueChange={setTipoImovelFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Imóvel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Tipos</SelectItem>
              <SelectItem value="lote">Lotes</SelectItem>
              <SelectItem value="casa">Casas</SelectItem>
              <SelectItem value="apartamento">Apartamentos</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
            </SelectContent>
          </Select>
          <Select value={cidadeFilter} onValueChange={setCidadeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Cidades</SelectItem>
              {cidades.map(cidade => (
                <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {viewMode === "mapa" ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Mapa Interativo de Empreendimentos</CardTitle>
              <CardDescription>
                Clique em um marcador de empreendimento para ver detalhes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmpreendimentosMap empreendimentos={filteredEmpreendimentos} />
            </CardContent>
          </Card>
        ) : (
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
            ) : filteredEmpreendimentos.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Nenhum empreendimento encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Não encontramos empreendimentos que correspondam aos seus critérios de busca.
                </p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setTipoImovelFilter("todos");
                  setCidadeFilter("todas");
                }}>
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              filteredEmpreendimentos.map((empreendimento) => (
                <Link 
                  to={`/empreendimentos/${empreendimento.id}`} 
                  key={empreendimento.id}
                  className="group"
                >
                  <Card className="overflow-hidden transition-all group-hover:shadow-lg">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={empreendimento.imagens[0]}
                        alt={empreendimento.nome}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{empreendimento.nome}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {empreendimento.cidade}, {empreendimento.estado}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-2 text-muted-foreground mb-3">
                        {empreendimento.descricao}
                      </p>
                      <Button variant="secondary" className="w-full">
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpreendimentoMapaPage;
