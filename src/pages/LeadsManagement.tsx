
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Plus, 
  Search, 
  Filter, 
  Users,
  Mail, 
  Phone, 
  Calendar, 
  UserCheck,
  MessageSquare
} from "lucide-react";
import { 
  getLeads, 
  addLead, 
  updateLead, 
  Lead, 
  LeadCreate, 
  registrarContatoLead, 
  atribuirCorretorLead 
} from "@/services/leadService";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

// Form validation schema
const leadFormSchema = z.object({
  nome: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  telefone: z.string().min(8, { message: "Telefone inválido" }),
  origem: z.string().min(1, { message: "Origem é obrigatória" }),
  interesse: z.string().min(1, { message: "Interesse é obrigatório" }),
  observacoes: z.string().optional(),
  status: z.enum(["novo", "contatado", "qualificado", "oportunidade", "convertido", "perdido"]).optional()
});

const LeadsManagement = () => {
  const { toast } = useToast();
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [origemFilter, setOrigemFilter] = useState("todos");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [contactNote, setContactNote] = useState("");

  // Initialize form
  const form = useForm<z.infer<typeof leadFormSchema>>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      origem: "",
      interesse: "",
      observacoes: "",
      status: "novo"
    },
  });

  // Fetch leads data
  const { data: leads = [], isLoading, refetch } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const filters: any = {};
      
      // Only filter by agent if current user is an agent
      if (user && user.role === UserRole.CORRETOR) {
        filters.corretorId = user.id;
      }
      
      return getLeads(filters);
    }
  });

  // Filter leads based on search and filters
  const filteredLeads = leads.filter((lead: Lead) => {
    const matchesSearch = 
      lead.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === "todos" || lead.status === statusFilter;
    const matchesOrigem = origemFilter === "todos" || lead.origem === origemFilter;
    
    return matchesSearch && matchesStatus && matchesOrigem;
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof leadFormSchema>) => {
    try {
      await addLead(values);
      toast({
        title: "Lead adicionado",
        description: "O lead foi adicionado com sucesso."
      });
      form.reset();
      setIsAddDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar lead.",
        variant: "destructive"
      });
    }
  };

  // Handle contact registration
  const handleContactRegistration = async () => {
    if (!selectedLead || !selectedLead.id) return;
    
    try {
      await registrarContatoLead(selectedLead.id, contactNote);
      toast({
        title: "Contato registrado",
        description: "O contato com o lead foi registrado com sucesso."
      });
      setContactNote("");
      setIsContactDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar contato.",
        variant: "destructive"
      });
    }
  };

  // Handle agent assignment
  const handleAssignAgent = async (leadId: string) => {
    if (!user?.id) return;
    
    try {
      await atribuirCorretorLead(leadId, user.id);
      toast({
        title: "Lead atribuído",
        description: "O lead foi atribuído a você com sucesso."
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atribuir lead.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container py-10 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Leads</h1>
            <p className="text-muted-foreground">
              Acompanhe e gerencie seus leads imobiliários
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Lead
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 max-w-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="novo">Novos</SelectItem>
              <SelectItem value="contatado">Contatados</SelectItem>
              <SelectItem value="qualificado">Qualificados</SelectItem>
              <SelectItem value="oportunidade">Oportunidades</SelectItem>
              <SelectItem value="convertido">Convertidos</SelectItem>
              <SelectItem value="perdido">Perdidos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={origemFilter} onValueChange={setOrigemFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              <SelectItem value="site">Site</SelectItem>
              <SelectItem value="indicação">Indicação</SelectItem>
              <SelectItem value="redes sociais">Redes Sociais</SelectItem>
              <SelectItem value="portais">Portais Imobiliários</SelectItem>
              <SelectItem value="anúncio">Anúncio</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Mais Filtros
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle>Todos os Leads</CardTitle>
            <CardDescription>
              {filteredLeads.length} leads encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">
                <p>Carregando leads...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Nenhum lead encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Não encontramos leads que correspondam aos seus critérios de busca.
                </p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("todos");
                  setOrigemFilter("todos");
                }}>
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome/Contato</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Interesse</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Último Contato</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead: Lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="font-medium">{lead.nome}</div>
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{lead.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{lead.telefone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.origem}</TableCell>
                      <TableCell>{lead.interesse}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lead.status === 'novo' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'contatado' ? 'bg-yellow-100 text-yellow-800' :
                          lead.status === 'qualificado' ? 'bg-purple-100 text-purple-800' :
                          lead.status === 'oportunidade' ? 'bg-orange-100 text-orange-800' :
                          lead.status === 'convertido' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.dataCriacao instanceof Date ? 
                          lead.dataCriacao.toLocaleDateString('pt-BR') : 
                          'N/A'}
                      </TableCell>
                      <TableCell>
                        {lead.ultimoContato instanceof Date ? 
                          lead.ultimoContato.toLocaleDateString('pt-BR') : 
                          'Nunca contatado'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedLead(lead);
                              setIsContactDialogOpen(true);
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Contatar
                          </Button>
                          {user?.role === UserRole.CORRETOR && !lead.corretorId && (
                            <Button 
                              size="sm"
                              onClick={() => lead.id && handleAssignAgent(lead.id)}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Atribuir a mim
                            </Button>
                          )}
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

      {/* Add Lead Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Lead</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="Telefone com DDD" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="origem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origem</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a origem" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="site">Site</SelectItem>
                          <SelectItem value="indicação">Indicação</SelectItem>
                          <SelectItem value="redes sociais">Redes Sociais</SelectItem>
                          <SelectItem value="portais">Portais Imobiliários</SelectItem>
                          <SelectItem value="anúncio">Anúncio</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interesse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interesse</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o interesse" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="lotes">Lotes</SelectItem>
                          <SelectItem value="casas">Casas</SelectItem>
                          <SelectItem value="apartamentos">Apartamentos</SelectItem>
                          <SelectItem value="comercial">Comercial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações ou informações adicionais" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Adicionar Lead</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Contact Lead Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registrar Contato</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedLead && (
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">{selectedLead.nome}</p>
                <div className="flex items-center text-sm mt-1">
                  <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>{selectedLead.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>{selectedLead.telefone}</span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <FormLabel>Registrar Interação</FormLabel>
              <Textarea 
                placeholder="Descreva a interação com o lead..." 
                value={contactNote}
                onChange={(e) => setContactNote(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleContactRegistration}>
                Registrar Contato
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsManagement;
