
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  Clipboard, 
  MapPin, 
  Home, 
  Ruler, 
  Check, 
  ChevronRight, 
  Search, 
  Filter,
  UserPlus,
  LineChart,
  Calendar,
  LogIn
} from "lucide-react";
import { mockEmpreendimentos, formatCurrency } from "@/utils/animations";
import { useAuth } from "@/contexts/AuthContext";

export default function IndexPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoImovelFilter, setTipoImovelFilter] = useState("todos");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Filtrar empreendimentos em destaque
  const empreendimentosDestaque = mockEmpreendimentos
    .filter(e => e.destaque)
    .filter(e => {
      const matchesSearch = searchTerm === "" || 
        e.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.estado.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTipo = tipoImovelFilter === "todos" || e.tipoImovel === tipoImovelFilter;
      
      return matchesSearch && matchesTipo;
    });

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent z-10" />
        <div className="relative h-[500px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Empreendimento Imobiliário" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container">
            <div className="max-w-lg space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
                CRM Imobiliário Completo para Gestão de Empreendimentos
              </h1>
              <p className="text-white/90 text-lg drop-shadow-md">
                Gerencie empreendimentos, reservas e clientes em um único sistema integrado e interativo.
              </p>
              <div className="flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <Button asChild size="lg" className="font-medium">
                    <Link to="/dashboard">
                      Acessar Dashboard
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                 ) : (
                   <Button asChild size="lg" className="font-medium">
                     <Link to="/auth">
                       <LogIn className="mr-2 h-4 w-4" />
                       Entrar no Sistema
                     </Link>
                   </Button>
                 )}
                <Button asChild variant="secondary" size="lg">
                  <Link to="/empreendimentos">
                    Ver Empreendimentos
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Section */}
      <div className="container py-8">
        <Card className="-mt-16 relative z-30 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle>Encontre seu Empreendimento Ideal</CardTitle>
            <CardDescription>
              Busque entre nossos empreendimentos disponíveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, cidade ou estado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={tipoImovelFilter} onValueChange={setTipoImovelFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
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
              <Button variant="outline" className="md:w-[100px]">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button className="md:w-[120px]">Buscar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Featured Developments */}
      <div className="container py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Empreendimentos em Destaque</h2>
            <p className="text-muted-foreground">
              Conheça nossos principais empreendimentos
            </p>
          </div>
          <Button asChild variant="link" className="md:self-end mt-2 md:mt-0">
            <Link to="/empreendimentos" className="flex items-center">
              Ver Todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {empreendimentosDestaque.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Nenhum empreendimento encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Não encontramos empreendimentos que correspondam aos seus critérios de busca.
              </p>
              <Button onClick={() => {
                setSearchTerm("");
                setTipoImovelFilter("todos");
              }}>
                Limpar Filtros
              </Button>
            </div>
          ) : (
            empreendimentosDestaque.map((empreendimento) => (
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
                  <CardContent className="pb-2">
                    <p className="text-sm line-clamp-2 text-muted-foreground mb-3">
                      {empreendimento.descricao}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full flex items-center">
                        <Home className="h-3 w-3 mr-1" />
                        {empreendimento.tipoImovel === "lote" ? "Lote" : 
                          empreendimento.tipoImovel === "casa" ? "Casa" : 
                          empreendimento.tipoImovel === "apartamento" ? "Apartamento" : "Comercial"}
                      </div>
                      <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full flex items-center">
                        <Ruler className="h-3 w-3 mr-1" />
                        {empreendimento.area}m²
                      </div>
                    </div>
                    <div className="font-bold text-xl">
                      {formatCurrency(empreendimento.preco)}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" className="w-full">
                      Ver Detalhes
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-muted/50">
        <div className="container py-16">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Sistema Completo de Gestão Imobiliária
            </h2>
            <p className="text-muted-foreground text-lg">
              Nossa plataforma oferece todas as ferramentas necessárias para gerenciar empreendimentos, reservas e clientes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Building className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Gestão de Empreendimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Cadastro detalhado de empreendimentos</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Upload de plantas, imagens 3D e vídeos</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Gestão de tabelas de preços</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Controle de etapas da construção</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/empreendimentos">Explorar Empreendimentos</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <Clipboard className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Reservas Interativas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Interface visual para seleção de unidades</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Visualização em tempo real de disponibilidade</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Processo de reserva simplificado</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Geração de contratos automatizada</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/reservas">Gerenciar Reservas</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <UserPlus className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Gestão de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Cadastro completo de clientes</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Segmentação por perfil e interesse</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Ferramentas de comunicação personalizadas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Histórico de interações</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/clientes">Gerenciar Clientes</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Dashboard Preview */}
      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Relatórios e Análises Completos
            </h2>
            <p className="text-muted-foreground mb-6">
              Acompanhe o desempenho de vendas, reservas e leads com dashboards intuitivos e relatórios detalhados.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Dashboards Interativos</h4>
                  <p className="text-muted-foreground text-sm">Visualize KPIs importantes e acompanhe tendências de vendas.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Análise Temporal</h4>
                  <p className="text-muted-foreground text-sm">Compare desempenho por período e preveja tendências futuras.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Desempenho de Corretores</h4>
                  <p className="text-muted-foreground text-sm">Avalie o desempenho da equipe e incentive melhores resultados.</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link to="/relatorios">
                  Explorar Relatórios
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 sm:p-8 rounded-lg">
            <img 
              src="https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Dashboard Preview" 
              className="rounded-lg shadow-lg w-full border border-border"
            />
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary">
        <div className="container py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground mb-4">
              Comece a gerenciar seus empreendimentos hoje mesmo
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Experimente nosso sistema completo de CRM imobiliário e aumente suas vendas
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary">
                Solicitar Demonstração
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Ver Planos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
