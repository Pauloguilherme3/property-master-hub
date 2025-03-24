
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Building, Users, PieChart, List, ArrowRight } from "lucide-react";
import { mockEmpreendimentos, mockReservas } from "@/utils/animations";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  // Get most recent properties
  const empreendimentosRecentes = [...mockEmpreendimentos].sort(
    (a, b) => new Date(b.dataAtualizacao).getTime() - new Date(a.dataAtualizacao).getTime()
  ).slice(0, 3);

  // Get upcoming reservations
  const reservasProximas = [...mockReservas]
    .filter(res => res.status !== "cancelada")
    .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())
    .slice(0, 5);

  return (
    <div className="container px-4 mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Bem-vindo de volta, {user.nome}
        </h1>
        <p className="text-muted-foreground">
          Aqui está o que está acontecendo com seus empreendimentos hoje.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total de Empreendimentos",
            value: "24",
            description: "7% de aumento em relação ao mês passado",
            icon: Building,
            color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30"
          },
          {
            title: "Reservas Ativas",
            value: "18",
            description: "5 novas desde a semana passada",
            icon: CalendarIcon,
            color: "text-green-500 bg-green-100 dark:bg-green-900/30"
          },
          {
            title: "Total de Clientes",
            value: "137",
            description: "12 novos clientes este mês",
            icon: Users,
            color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30"
          },
          {
            title: "Taxa de Conversão",
            value: "24%",
            description: "3% de aumento em relação ao mês passado",
            icon: PieChart,
            color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30"
          }
        ].map((stat, index) => (
          <Card key={index} className="hover-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Properties */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Empreendimentos Recentes</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/empreendimentos" className="flex items-center">
              Ver todos
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {empreendimentosRecentes.map(empreendimento => (
            <div key={empreendimento.id} className="card">
              {/* Just placeholder for the PropertyCard component */}
              <div className="border rounded-lg overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  {empreendimento.imagens && empreendimento.imagens.length > 0 ? (
                    <img 
                      src={empreendimento.imagens[0]} 
                      alt={empreendimento.nome} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Building className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-1 text-xs bg-primary text-white rounded-full">
                    {empreendimento.status}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{empreendimento.nome}</h3>
                  <p className="text-sm text-muted-foreground truncate">{empreendimento.cidade}, {empreendimento.estado}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold">R$ {empreendimento.preco.toLocaleString()}</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/empreendimentos/${empreendimento.id}`}>Detalhes</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Reservations */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Próximas Reservas</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/reservas" className="flex items-center">
              Ver todas
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Agenda de Reservas</CardTitle>
            <CardDescription>
              Você tem {reservasProximas.length} reservas próximas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservasProximas.map((reserva) => {
                const empreendimento = mockEmpreendimentos.find(p => p.id === reserva.empreendimentoId);
                return (
                  <div key={reserva.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={empreendimento?.imagens[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"}
                        alt={empreendimento?.nome || "Empreendimento"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {empreendimento?.nome || "Empreendimento Desconhecido"}
                      </p>
                      <div className="flex text-xs text-muted-foreground">
                        <span className="truncate">
                          Cliente: {reserva.nomeCliente}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {new Date(reserva.dataInicio).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(reserva.dataInicio).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      reserva.status === "confirmada"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                      {reserva.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Atividade Recente</h2>
          <Button variant="ghost" size="sm">
            <span className="flex items-center">
              Ver tudo
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                {
                  icon: Building,
                  title: "Novo empreendimento adicionado",
                  description: "Apartamento Moderno no Centro foi adicionado aos anúncios",
                  time: "2 horas atrás",
                  user: "Jane Cooper"
                },
                {
                  icon: Users,
                  title: "Novo cliente registrado",
                  description: "Michael Johnson se cadastrou pelo site",
                  time: "5 horas atrás",
                  user: "Sistema"
                },
                {
                  icon: List,
                  title: "Atualização de empreendimento",
                  description: "Preço da Vila de Luxo à Beira-Mar foi atualizado",
                  time: "Ontem",
                  user: "John Doe"
                },
                {
                  icon: CalendarIcon,
                  title: "Reserva confirmada",
                  description: "Visita para Casa Familiar Suburbana confirmada",
                  time: "Ontem",
                  user: "Sistema"
                }
              ].map((activity, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="p-2 rounded-full bg-muted flex-shrink-0">
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">Por: {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
