
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Filter, 
  MoreHorizontal, 
  Plus 
} from "lucide-react";
import { Corretor, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

// Mock data - in a real app, this would come from an API
const mockCorretores: Corretor[] = [
  {
    id: "1",
    userId: "user1",
    nome: "João Silva",
    email: "joao.silva@propmaster.com",
    telefone: "(11) 98765-4321",
    biografia: "Corretor experiente especializado em imóveis de luxo",
    especialidades: ["Luxo", "Residencial", "Investimento"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    avaliacao: 4.8,
    volumeVendas: 5250000,
    imoveisAtivos: 12,
    negociosFechados: 45,
    dataIngresso: "2022-04-15T10:00:00Z",
    status: "ativo"
  },
  {
    id: "2",
    userId: "user2",
    nome: "Maria Santos",
    email: "maria.santos@propmaster.com",
    telefone: "(11) 91234-5678",
    biografia: "Nova corretora com experiência em marketing",
    especialidades: ["Residencial", "Primeiro imóvel"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    avaliacao: 4.2,
    volumeVendas: 1850000,
    imoveisAtivos: 5,
    negociosFechados: 12,
    dataIngresso: "2023-01-10T10:00:00Z",
    status: "ativo"
  },
  {
    id: "3",
    userId: "user3",
    nome: "Carlos Oliveira",
    email: "carlos.oliveira@propmaster.com",
    telefone: "(11) 94567-8901",
    biografia: "Corretor de alta performance com mais de 10 anos de experiência",
    especialidades: ["Comercial", "Investimento", "Desenvolvimento"],
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    avaliacao: 4.9,
    volumeVendas: 12500000,
    imoveisAtivos: 18,
    negociosFechados: 78,
    dataIngresso: "2018-09-20T10:00:00Z",
    status: "ativo"
  }
];

export default function Corretores() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetching corretores data
  const { data: corretores = [], isLoading } = useQuery({
    queryKey: ["corretores"],
    queryFn: async () => {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockCorretores;
    }
  });

  const canManageCorretores = hasPermission([
    UserRole.GERENTE, 
    UserRole.SUPERVISOR, 
    UserRole.ADMINISTRADOR
  ]);

  const filteredCorretores = corretores.filter(corretor => 
    corretor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    corretor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    corretor.especialidades.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddCorretor = () => {
    toast({
      title: "Funcionalidade em Breve",
      description: "A funcionalidade de adicionar corretor estará disponível em breve.",
    });
  };

  const handleActionClick = (action: string, corretorId: string) => {
    toast({
      title: `Ação ${action}`,
      description: `${action} para corretor ${corretorId} estará disponível em breve.`,
    });
  };

  return (
    <div className="container py-10 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Corretores</h1>
            <p className="text-muted-foreground">
              Gerencie seus corretores de imóveis e seu desempenho
            </p>
          </div>
          {canManageCorretores && (
            <Button onClick={handleAddCorretor}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Corretor
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              placeholder="Buscar corretores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Diretório de Corretores</CardTitle>
            <CardDescription>
              Visualize e gerencie seus corretores de imóveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Corretor</TableHead>
                  <TableHead>Especialidades</TableHead>
                  <TableHead className="text-right">Imóveis Ativos</TableHead>
                  <TableHead className="text-right">Negócios Fechados</TableHead>
                  <TableHead className="text-right">Avaliação</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  {canManageCorretores && <TableHead className="w-[50px]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Carregando corretores...
                    </TableCell>
                  </TableRow>
                ) : filteredCorretores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Nenhum corretor encontrado para sua busca.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCorretores.map((corretor) => (
                    <TableRow key={corretor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={corretor.avatar} alt={corretor.nome} />
                            <AvatarFallback>{corretor.nome.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{corretor.nome}</div>
                            <div className="text-sm text-muted-foreground">{corretor.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {corretor.especialidades.map((especialidade, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {especialidade}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{corretor.imoveisAtivos}</TableCell>
                      <TableCell className="text-right">{corretor.negociosFechados}</TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium">{corretor.avaliacao}</span>
                        <span className="text-muted-foreground">/5</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={corretor.status === 'ativo' ? 'default' : 'secondary'}>
                          {corretor.status === 'ativo' ? 'Ativo' : corretor.status === 'inativo' ? 'Inativo' : 'Férias'}
                        </Badge>
                      </TableCell>
                      {canManageCorretores && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Ações</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleActionClick("Ver Perfil", corretor.id)}>
                                Ver Perfil
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleActionClick("Editar", corretor.id)}>
                                Editar Corretor
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleActionClick("Atribuir Leads", corretor.id)}>
                                Atribuir Leads
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleActionClick("Desempenho", corretor.id)}>
                                Ver Desempenho
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
