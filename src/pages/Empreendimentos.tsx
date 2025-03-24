
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Filter, 
  Search, 
  Plus, 
  MapPin, 
  Home, 
  Ruler, 
  Building 
} from "lucide-react";
import { mockEmpreendimentos } from "@/utils/animations";
import { Empreendimento, FiltroEmpreendimento } from "@/types";
import { formatCurrency } from "@/utils/animations";

const EmpreendimentosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtros, setFiltros] = useState<FiltroEmpreendimento>({});
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Fetching empreendimentos data
  const { data: empreendimentos = [], isLoading } = useQuery({
    queryKey: ["empreendimentos"],
    queryFn: async () => {
      // Este seria um chamada de API em uma aplicação real
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockEmpreendimentos;
    }
  });

  // Filtrar empreendimentos baseado nos critérios
  const empreendimentosFiltrados = empreendimentos.filter(empreendimento => {
    // Filtro por termo de busca
    const matchesSearch = 
      empreendimento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empreendimento.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empreendimento.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empreendimento.estado.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por tipo de imóvel
    const matchesTipo = !filtros.tipoImovel?.length || 
      filtros.tipoImovel.includes(empreendimento.tipoImovel);
    
    // Filtro por preço
    const matchesPreco = 
      (!filtros.precoMin || empreendimento.preco >= filtros.precoMin) &&
      (!filtros.precoMax || empreendimento.preco <= filtros.precoMax);
    
    // Filtro por área
    const matchesArea = 
      (!filtros.areaMin || empreendimento.area >= filtros.areaMin) &&
      (!filtros.areaMax || empreendimento.area <= filtros.areaMax);
    
    // Filtro por cidade
    const matchesCidade = !filtros.cidade?.length || 
      filtros.cidade.includes(empreendimento.cidade);
    
    return matchesSearch && matchesTipo && matchesPreco && matchesArea && matchesCidade;
  });

  const handleTipoChange = (value: string) => {
    setFiltros(prev => ({ 
      ...prev, 
      tipoImovel: value === "todos" ? [] : [value as "casa" | "apartamento" | "lote" | "comercial"] 
    }));
  };

  const handleCidadeChange = (value: string) => {
    setFiltros(prev => ({ 
      ...prev, 
      cidade: value === "todas" ? [] : [value] 
    }));
  };

  const limparFiltros = () => {
    setFiltros({});
    setSearchTerm("");
  };

  // Obter cidades únicas para o filtro
  const cidades = [...new Set(empreendimentos.map(e => e.cidade))];

  return (
    <div className="container py-10 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Empreendimentos</h1>
            <p className="text-muted-foreground">
              Gerencie todos os empreendimentos imobiliários
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/empreendimentos/mapa">
                <MapPin className="mr-2 h-4 w-4" />
                Ver no Mapa
              </Link>
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Empreendimento
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="w-full sm:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Select 
              value={filtros.tipoImovel?.length ? filtros.tipoImovel[0] : "todos"}
              onValueChange={handleTipoChange}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipo de Imóvel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="apartamento">Apartamento</SelectItem>
                <SelectItem value="lote">Lote</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={filtros.cidade?.length ? filtros.cidade[0] : "todas"}
              onValueChange={handleCidadeChange}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Cidades</SelectItem>
                {cidades.map(cidade => (
                  <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {mostrarFiltros && (
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Preço</h4>
                  <div className="flex gap-2 items-center">
                    <Input 
                      type="number" 
                      placeholder="Mínimo" 
                      value={filtros.precoMin || ""} 
                      onChange={(e) => setFiltros(prev => ({ ...prev, precoMin: Number(e.target.value) || undefined }))} 
                    />
                    <span>-</span>
                    <Input 
                      type="number" 
                      placeholder="Máximo" 
                      value={filtros.precoMax || ""} 
                      onChange={(e) => setFiltros(prev => ({ ...prev, precoMax: Number(e.target.value) || undefined }))} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Área (m²)</h4>
                  <div className="flex gap-2 items-center">
                    <Input 
                      type="number" 
                      placeholder="Mínimo" 
                      value={filtros.areaMin || ""} 
                      onChange={(e) => setFiltros(prev => ({ ...prev, areaMin: Number(e.target.value) || undefined }))} 
                    />
                    <span>-</span>
                    <Input 
                      type="number" 
                      placeholder="Máximo" 
                      value={filtros.areaMax || ""} 
                      onChange={(e) => setFiltros(prev => ({ ...prev, areaMax: Number(e.target.value) || undefined }))} 
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={limparFiltros} className="mr-2">
                  Limpar Filtros
                </Button>
                <Button onClick={() => setMostrarFiltros(false)}>
                  Aplicar Filtros
                </Button>
              </div>
            </Card>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
                <CardFooter>
                  <div className="h-10 bg-muted rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : empreendimentosFiltrados.length === 0 ? (
          <Card className="p-8 text-center">
            <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Nenhum empreendimento encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Não encontramos empreendimentos que correspondam aos seus critérios de busca.
            </p>
            <Button onClick={limparFiltros}>Limpar Filtros</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {empreendimentosFiltrados.map((empreendimento) => (
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
                    {empreendimento.destaque && (
                      <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                        Destaque
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{empreendimento.nome}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {empreendimento.cidade}, {empreendimento.estado}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm line-clamp-2 text-muted-foreground mb-3">
                      {empreendimento.descricao}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="flex items-center">
                        <Home className="h-3 w-3 mr-1" />
                        {empreendimento.tipoImovel === "lote" ? "Lote" : 
                          empreendimento.tipoImovel === "casa" ? "Casa" : 
                          empreendimento.tipoImovel === "apartamento" ? "Apartamento" : "Comercial"}
                      </Badge>
                      <Badge variant="outline" className="flex items-center">
                        <Ruler className="h-3 w-3 mr-1" />
                        {empreendimento.area}m²
                      </Badge>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div className="font-bold text-xl">
                        {formatCurrency(empreendimento.preco)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        A partir de
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" className="w-full">
                      Ver Detalhes
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpreendimentosPage;
