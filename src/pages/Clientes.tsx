
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, Users, Mail, Phone, MapPin } from "lucide-react";

// Mock data for clients
const mockClients = [
  {
    id: "cl-001",
    nome: "João Silva",
    email: "joao.silva@exemplo.com",
    telefone: "(48) 99123-4567",
    cidade: "Florianópolis",
    estado: "SC",
    interesse: "Lotes",
    origem: "Site",
    ultimoContato: "2023-06-15T10:30:00Z"
  },
  {
    id: "cl-002",
    nome: "Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    telefone: "(41) 98765-4321",
    cidade: "Curitiba",
    estado: "PR",
    interesse: "Casas",
    origem: "Indicação",
    ultimoContato: "2023-06-16T15:45:00Z"
  },
  {
    id: "cl-003",
    nome: "Pedro Santos",
    email: "pedro.santos@exemplo.com",
    telefone: "(47) 97654-3210",
    cidade: "Joinville",
    estado: "SC",
    interesse: "Lotes",
    origem: "Redes Sociais",
    ultimoContato: "2023-06-18T09:15:00Z"
  },
  {
    id: "cl-004",
    nome: "Ana Costa",
    email: "ana.costa@exemplo.com",
    telefone: "(48) 91234-5678",
    cidade: "Florianópolis",
    estado: "SC",
    interesse: "Casas",
    origem: "Anúncio",
    ultimoContato: "2023-06-20T14:00:00Z"
  }
];

const ClientesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [interestFilter, setInterestFilter] = useState("todos");
  const [originFilter, setOriginFilter] = useState("todos");
  
  // Filtered clients
  const clientesFiltrados = mockClients.filter(client => {
    const matchesSearch = 
      client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telefone.includes(searchTerm) ||
      client.cidade.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesInterest = interestFilter === "todos" || client.interesse.toLowerCase() === interestFilter.toLowerCase();
    const matchesOrigin = originFilter === "todos" || client.origem.toLowerCase() === originFilter.toLowerCase();
    
    return matchesSearch && matchesInterest && matchesOrigin;
  });

  return (
    <div className="container py-10 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie seus clientes e leads
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email, telefone ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={interestFilter} onValueChange={setInterestFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Interesse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="lotes">Lotes</SelectItem>
              <SelectItem value="casas">Casas</SelectItem>
              <SelectItem value="apartamentos">Apartamentos</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
            </SelectContent>
          </Select>
          <Select value={originFilter} onValueChange={setOriginFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="site">Site</SelectItem>
              <SelectItem value="indicação">Indicação</SelectItem>
              <SelectItem value="redes sociais">Redes Sociais</SelectItem>
              <SelectItem value="anúncio">Anúncio</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Mais Filtros
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle>Todos os Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            {clientesFiltrados.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Nenhum cliente encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Não encontramos clientes que correspondam aos seus critérios de busca.
                </p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setInterestFilter("todos");
                  setOriginFilter("todos");
                }}>
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Interesse</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Último Contato</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesFiltrados.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>
                        <div className="font-medium">{cliente.nome}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{cliente.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{cliente.telefone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{cliente.cidade}, {cliente.estado}</span>
                        </div>
                      </TableCell>
                      <TableCell>{cliente.interesse}</TableCell>
                      <TableCell>{cliente.origem}</TableCell>
                      <TableCell>
                        {new Date(cliente.ultimoContato).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                          <Button size="sm">
                            Contatar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientesPage;
