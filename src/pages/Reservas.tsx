
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar as CalendarIcon, Search, Filter, Eye, CheckCircle, XCircle, Clock, Plus } from "lucide-react";
import { mockEmpreendimentos, mockUnidades, mockReservas, getStatusReserva } from "@/utils/animations";
import { Reserva, Empreendimento, Unidade } from "@/types";
import { ReservaModal } from "@/components/modals/ReservaModal";

const ReservasPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("lista");
  const [reservas, setReservas] = useState<(Reserva & { empreendimento?: Empreendimento, unidade?: Unidade })[]>([]);
  const [reservasFiltradas, setReservasFiltradas] = useState<(Reserva & { empreendimento?: Empreendimento, unidade?: Unidade })[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [isReservaModalOpen, setIsReservaModalOpen] = useState(false);
  
  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Inicializar reservas com dados do empreendimento e unidade
    const reservasCompletas = mockReservas.map(reserva => ({
      ...reserva,
      empreendimento: mockEmpreendimentos.find(e => e.id === reserva.empreendimentoId),
      unidade: mockUnidades.find(u => u.id === reserva.unidadeId)
    }));
    
    setReservas(reservasCompletas);
    setReservasFiltradas(reservasCompletas);
  }, []);

  useEffect(() => {
    filtrarReservas();
  }, [searchTerm, statusFilter, selectedDate, reservas]);

  const filtrarReservas = () => {
    let filtradas = [...reservas];
    
    // Aplicar filtro de termo de busca
    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      filtradas = filtradas.filter(reserva => 
        reserva.nomeCliente.toLowerCase().includes(termo) ||
        reserva.emailCliente.toLowerCase().includes(termo) ||
        reserva.empreendimento?.nome.toLowerCase().includes(termo) ||
        reserva.empreendimento?.endereco.toLowerCase().includes(termo)
      );
    }
    
    // Aplicar filtro de status
    if (statusFilter !== "todos") {
      filtradas = filtradas.filter(reserva => reserva.status === statusFilter);
    }
    
    // Aplicar filtro de data
    if (selectedDate) {
      filtradas = filtradas.filter(reserva => {
        const dataReserva = new Date(reserva.dataInicio);
        return (
          dataReserva.getDate() === selectedDate.getDate() &&
          dataReserva.getMonth() === selectedDate.getMonth() &&
          dataReserva.getFullYear() === selectedDate.getFullYear()
        );
      });
    }
    
    setReservasFiltradas(filtradas);
  };

  if (!user) return null;

  return (
    <div className="container px-4 mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reservas
          </h1>
          <p className="text-muted-foreground">
            Gerencie e visualize todas as reservas de imóveis.
          </p>
        </div>
        <Button onClick={() => setIsReservaModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Reserva
        </Button>
      </div>
      
      <Tabs
        defaultValue="lista"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="lista">Visualização em Lista</TabsTrigger>
            <TabsTrigger value="calendario">Visualização em Calendário</TabsTrigger>
          </TabsList>
          
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Buscar reservas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-[200px]"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Empreendimento</TableHead>
                    <TableHead>Data e Hora</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservasFiltradas.length > 0 ? (
                    reservasFiltradas.map((reserva) => (
                      <TableRow key={reserva.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{reserva.nomeCliente}</p>
                            <p className="text-sm text-muted-foreground">{reserva.emailCliente}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{reserva.empreendimento?.nome || "Empreendimento Desconhecido"}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {reserva.empreendimento?.endereco || ""}, {reserva.empreendimento?.cidade || ""}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {new Date(reserva.dataInicio).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(reserva.dataInicio).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                              {" - "}
                              {new Date(reserva.dataFim).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusReserva(reserva.status).color}>
                            {reserva.status === "confirmada" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {reserva.status === "pendente" && <Clock className="h-3 w-3 mr-1" />}
                            {reserva.status === "cancelada" && <XCircle className="h-3 w-3 mr-1" />}
                            {getStatusReserva(reserva.status).label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                            >
                              <Link to={`/empreendimentos/${reserva.empreendimentoId}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Ver empreendimento</span>
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <CalendarIcon className="h-10 w-10 mb-2" />
                          <p className="text-lg font-medium">Nenhuma reserva encontrada</p>
                          <p className="text-sm">
                            {searchTerm || statusFilter !== "todos" || selectedDate
                              ? "Tente ajustar seus filtros"
                              : "Nenhuma reserva foi agendada ainda"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendario" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Calendário de Reservas</CardTitle>
              <CardDescription>
                Visualize e gerencie reservas por data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="border rounded-md"
                    initialFocus
                  />
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-3">
                    {selectedDate ? (
                      `Reservas para ${selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                    ) : (
                      "Selecione uma data para ver as reservas"
                    )}
                  </h3>
                  
                  {reservasFiltradas.length > 0 ? (
                    <div className="space-y-3">
                      {reservasFiltradas.map(reserva => (
                        <Card key={reserva.id} className="hover-card">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">
                                {new Date(reserva.dataInicio).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                                {" - "}
                                {new Date(reserva.dataFim).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </div>
                              <Badge className={getStatusReserva(reserva.status).color}>
                                {reserva.status === "confirmada" && <CheckCircle className="h-3 w-3 mr-1" />}
                                {reserva.status === "pendente" && <Clock className="h-3 w-3 mr-1" />}
                                {reserva.status === "cancelada" && <XCircle className="h-3 w-3 mr-1" />}
                                {getStatusReserva(reserva.status).label}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={reserva.empreendimento?.imagens[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"}
                                  alt={reserva.empreendimento?.nome || "Empreendimento"}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{reserva.empreendimento?.nome || "Empreendimento Desconhecido"}</p>
                                <p className="text-sm text-muted-foreground">
                                  {reserva.empreendimento?.endereco || ""}, {reserva.empreendimento?.cidade || ""}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div>
                                <p><span className="font-medium">Cliente:</span> {reserva.nomeCliente}</p>
                                <p>{reserva.emailCliente}</p>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                              >
                                <Link to={`/empreendimentos/${reserva.empreendimentoId}`}>
                                  Ver Empreendimento
                                </Link>
                              </Button>
                            </div>
                            
                            {reserva.observacoes && (
                              <div className="mt-3 pt-3 border-t text-sm">
                                <p className="font-medium mb-1">Observações:</p>
                                <p className="text-muted-foreground">{reserva.observacoes}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-lg font-medium">Nenhuma reserva encontrada</p>
                        <p className="text-sm text-muted-foreground">
                          Não há reservas agendadas para esta data
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ReservaModal 
        isOpen={isReservaModalOpen}
        onClose={() => setIsReservaModalOpen(false)}
      />
    </div>
  );
};

export default ReservasPage;
