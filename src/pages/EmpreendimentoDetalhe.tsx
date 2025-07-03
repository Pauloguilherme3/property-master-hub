import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, Home, MapPin, Calendar, Building, Ruler, User, Phone, Mail, ArrowRight, CheckCircle, XCircle, Clock } from "lucide-react";
import { mockEmpreendimentos, mockUnidades, getStatusUnidade } from "@/utils/animations";
import { formatCurrency } from "@/utils/animations";
import { EditEmpreendimentoImages } from "@/components/forms/EditEmpreendimentoImages";

const EmpreendimentoDetalhePage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("informacoes");
  const [empreendimento, setEmpreendimento] = useState(null);
  const { hasPermission } = useAuth();
  
  // Check if user is admin
  const isAdmin = hasPermission([UserRole.ADMINISTRADOR]);
  
  // Fetching empreendimento data
  const { data: empreendimentoData, isLoading: loadingEmpreendimento } = useQuery({
    queryKey: ["empreendimento", id],
    queryFn: async () => {
      // Este seria uma chamada de API em uma aplicação real
      await new Promise(resolve => setTimeout(resolve, 1000));
      const resultado = mockEmpreendimentos.find(e => e.id === id);
      if (!resultado) throw new Error("Empreendimento não encontrado");
      setEmpreendimento(resultado);
      return resultado;
    }
  });
  
  // Use local state or fetched data
  const currentEmpreendimento = empreendimento || empreendimentoData;
  
  // Fetching unidades data
  const { data: unidades = [], isLoading: loadingUnidades } = useQuery({
    queryKey: ["unidades", id],
    enabled: !!id,
    queryFn: async () => {
      // Este seria uma chamada de API em uma aplicação real
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockUnidades.filter(u => u.empreendimentoId === id);
    }
  });
  
  const isLoading = loadingEmpreendimento || loadingUnidades;
  
  // Update empreendimento function
  const handleEmpreendimentoUpdate = (updatedEmpreendimento) => {
    setEmpreendimento(updatedEmpreendimento);
  };
  
  // Calcular estatísticas das unidades
  const estatisticasUnidades = {
    total: unidades.length,
    disponiveis: unidades.filter(u => u.status === "disponivel").length,
    reservadas: unidades.filter(u => u.status === "reservado").length,
    vendidas: unidades.filter(u => u.status === "vendido").length,
    percentualVendido: unidades.length > 0 
      ? Math.round((unidades.filter(u => u.status === "vendido").length / unidades.length) * 100)
      : 0
  };
  
  if (isLoading) {
    return (
      <div className="container py-8 animate-pulse space-y-6">
        <div className="h-4 bg-muted rounded w-32"></div>
        <div className="h-8 bg-muted rounded w-3/4"></div>
        <div className="h-64 bg-muted rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!currentEmpreendimento) {
    return (
      <div className="container py-8 text-center">
        <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Empreendimento não encontrado</h2>
        <p className="text-muted-foreground mb-4">
          O empreendimento que você está procurando não existe ou foi removido.
        </p>
        <Button asChild>
          <Link to="/empreendimentos">Ver Todos os Empreendimentos</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/empreendimentos">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Link to="/" className="text-muted-foreground hover:text-foreground text-sm flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Início
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <Link to="/empreendimentos" className="text-muted-foreground hover:text-foreground text-sm">
            Empreendimentos
          </Link>
        </div>
        
        {/* Admin Image Edit Component */}
        {isAdmin && (
          <EditEmpreendimentoImages
            empreendimento={currentEmpreendimento}
            onUpdate={handleEmpreendimentoUpdate}
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div>
            <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-lg mb-4">
              <img 
                src={currentEmpreendimento.imagens[0]} 
                alt={currentEmpreendimento.nome} 
                className="w-full h-full object-cover"
              />
              {currentEmpreendimento.destaque && (
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  Destaque
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {currentEmpreendimento.imagens.slice(1).map((imagem, index) => (
                <div key={index} className="h-20 w-32 flex-shrink-0 rounded overflow-hidden">
                  <img 
                    src={imagem} 
                    alt={`${currentEmpreendimento.nome} - Imagem ${index + 2}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{currentEmpreendimento.nome}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {currentEmpreendimento.endereco}, {currentEmpreendimento.cidade}, {currentEmpreendimento.estado}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="flex items-center">
                  <Building className="h-3 w-3 mr-1" />
                  {currentEmpreendimento.tipoImovel === "lote" ? "Lote" : 
                    currentEmpreendimento.tipoImovel === "casa" ? "Casa" : 
                    currentEmpreendimento.tipoImovel === "apartamento" ? "Apartamento" : "Comercial"}
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Ruler className="h-3 w-3 mr-1" />
                  {currentEmpreendimento.area}m²
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Entrega: {new Date(currentEmpreendimento.previsaoEntrega).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Building className="h-3 w-3 mr-1" />
                  {currentEmpreendimento.construtora}
                </Badge>
              </div>
              <p className="text-lg mb-4">
                A partir de <span className="font-bold">{formatCurrency(currentEmpreendimento.preco)}</span>
              </p>
              <p className="text-muted-foreground mb-4">
                {currentEmpreendimento.descricao}
              </p>
            </div>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>Entre em contato para mais informações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Corretor: Carlos Oliveira</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>(48) 99123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>contato@imobiliaria.com.br</span>
                  </div>
                  <Separator />
                  <div className="pt-2 space-y-3">
                    <Button className="w-full">Solicitar Contato</Button>
                    <Button variant="outline" className="w-full">Agendar Visita</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Status do Empreendimento</CardTitle>
                <CardDescription>Acompanhe o progresso da obra</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentEmpreendimento.etapaConstrucao?.map((etapa, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{etapa.nome}</span>
                        <span className="text-sm">{etapa.porcentagemConcluida}%</span>
                      </div>
                      <Progress value={etapa.porcentagemConcluida} className="h-2" />
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="pt-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Unidades Disponíveis:</span>
                      <span className="text-sm font-medium">{estatisticasUnidades.disponiveis} de {estatisticasUnidades.total}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 h-5 bg-muted overflow-hidden rounded-full">
                        <div className="absolute inset-y-0 left-0 bg-green-500" style={{ width: `${estatisticasUnidades.disponiveis / estatisticasUnidades.total * 100}%` }}></div>
                        <div className="absolute inset-y-0 left-0 bg-yellow-500" style={{ width: `${(estatisticasUnidades.disponiveis + estatisticasUnidades.reservadas) / estatisticasUnidades.total * 100}%`, marginLeft: `${estatisticasUnidades.disponiveis / estatisticasUnidades.total * 100}%` }}></div>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                        <span>Disponível</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                        <span>Reservado</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                        <span>Vendido</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="informacoes">Informações</TabsTrigger>
            <TabsTrigger value="unidades">Unidades</TabsTrigger>
            <TabsTrigger value="mapa">Mapa</TabsTrigger>
            <TabsTrigger value="galeria">Galeria</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informacoes" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sobre o Empreendimento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  {currentEmpreendimento.descricao}
                </p>
                
                <h3 className="text-lg font-semibold mt-4">Especificações</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo</p>
                      <p className="font-medium">
                        {currentEmpreendimento.tipoImovel === "lote" ? "Lote" : 
                          currentEmpreendimento.tipoImovel === "casa" ? "Casa" : 
                          currentEmpreendimento.tipoImovel === "apartamento" ? "Apartamento" : "Comercial"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Área</p>
                      <p className="font-medium">A partir de {currentEmpreendimento.area}m²</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Previsão de Entrega</p>
                      <p className="font-medium">
                        {new Date(currentEmpreendimento.previsaoEntrega).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Construtora</p>
                      <p className="font-medium">{currentEmpreendimento.construtora}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="unidades" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Unidades Disponíveis</CardTitle>
                <CardDescription>
                  Selecione uma unidade para mais informações ou para reservar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unidade</TableHead>
                      <TableHead className="text-right">Área</TableHead>
                      <TableHead className="text-right">Preço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unidades.map((unidade) => (
                      <TableRow key={unidade.id}>
                        <TableCell>
                          <div className="font-medium">{unidade.numero}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          {unidade.area} m²
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(unidade.preco)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusUnidade(unidade.status).color}>
                            {unidade.status === "disponivel" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {unidade.status === "reservado" && <Clock className="h-3 w-3 mr-1" />}
                            {unidade.status === "vendido" && <XCircle className="h-3 w-3 mr-1" />}
                            {getStatusUnidade(unidade.status).label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {unidade.status === "disponivel" && (
                            <Button size="sm" asChild>
                              <Link to={`/unidades/${unidade.id}/reserva`}>
                                Reservar
                              </Link>
                            </Button>
                          )}
                          {unidade.status === "reservado" && (
                            <Button variant="outline" size="sm" disabled>
                              Reservado
                            </Button>
                          )}
                          {unidade.status === "vendido" && (
                            <Button variant="outline" size="sm" disabled>
                              Vendido
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Button variant="default" asChild>
              <Link to={`/empreendimentos/${currentEmpreendimento.id}/mapa`} className="flex items-center">
                Ver Todas as Unidades no Mapa
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </TabsContent>
          
          <TabsContent value="mapa" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
                <CardDescription>
                  Confira a localização do empreendimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] bg-muted rounded-md flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">Mapa Interativo em Breve</h3>
                    <p className="text-muted-foreground mb-4">
                      Estamos trabalhando para disponibilizar o mapa interativo deste empreendimento.
                    </p>
                    <Badge variant="outline" className="mx-auto flex items-center w-fit">
                      <MapPin className="h-3 w-3 mr-1" />
                      {currentEmpreendimento.cidade}, {currentEmpreendimento.estado}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="galeria" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Galeria de Imagens</CardTitle>
                <CardDescription>
                  Confira todas as imagens do empreendimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {currentEmpreendimento.imagens.map((imagem, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-md">
                      <img 
                        src={imagem} 
                        alt={`${currentEmpreendimento.nome} - Imagem ${index + 1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {currentEmpreendimento.tourVirtual && (
              <Card>
                <CardHeader>
                  <CardTitle>Tour Virtual</CardTitle>
                  <CardDescription>
                    Explore o empreendimento virtualmente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <div className="text-center p-6">
                      <Building className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <h3 className="text-lg font-semibold mb-2">Tour Virtual em Breve</h3>
                      <p className="text-muted-foreground mb-4">
                        Estamos trabalhando para disponibilizar o tour virtual deste empreendimento.
                      </p>
                      <Button>Acessar Tour Virtual</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmpreendimentoDetalhePage;
