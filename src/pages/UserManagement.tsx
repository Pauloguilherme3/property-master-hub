
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, UserRole, UserStatus } from "@/types";
import { getCollection, updateDocument } from "@/services/dbService";
import { useToast } from "@/components/ui/use-toast";
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserPlus, 
  Check, 
  X, 
  UserCog, 
  Users, 
  AlertTriangle,
  Shield,
  Clock
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [inactiveUsers, setInactiveUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Load users from Firestore
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const usersData = await getCollection("users");
        const usersTyped = usersData as User[];
        
        setUsers(usersTyped);
        setPendingUsers(usersTyped.filter(u => u.status === UserStatus.PENDENTE));
        setActiveUsers(usersTyped.filter(u => u.status === UserStatus.ATIVO));
        setInactiveUsers(usersTyped.filter(u => u.status === UserStatus.INATIVO));
      } catch (error) {
        console.error("Error loading users:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar usuários",
          description: "Não foi possível carregar a lista de usuários."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [toast]);

  const handleApproveUser = async (userId: string) => {
    try {
      await updateDocument("users", userId, {
        status: UserStatus.ATIVO
      });

      toast({
        title: "Usuário aprovado",
        description: "O usuário foi aprovado com sucesso."
      });

      // Update local state
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, status: UserStatus.ATIVO } : u
      );
      
      setUsers(updatedUsers);
      setPendingUsers(updatedUsers.filter(u => u.status === UserStatus.PENDENTE));
      setActiveUsers(updatedUsers.filter(u => u.status === UserStatus.ATIVO));
    } catch (error) {
      console.error("Error approving user:", error);
      toast({
        variant: "destructive",
        title: "Erro ao aprovar usuário",
        description: "Não foi possível aprovar o usuário."
      });
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      await updateDocument("users", userId, {
        status: UserStatus.INATIVO
      });

      toast({
        title: "Usuário rejeitado",
        description: "O usuário foi rejeitado com sucesso."
      });

      // Update local state
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, status: UserStatus.INATIVO } : u
      );
      
      setUsers(updatedUsers);
      setPendingUsers(updatedUsers.filter(u => u.status === UserStatus.PENDENTE));
      setInactiveUsers(updatedUsers.filter(u => u.status === UserStatus.INATIVO));
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast({
        variant: "destructive",
        title: "Erro ao rejeitar usuário",
        description: "Não foi possível rejeitar o usuário."
      });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setEditDialogOpen(true);
  };

  const handleSaveUserRole = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      await updateDocument("users", selectedUser.id, {
        role: selectedRole
      });

      toast({
        title: "Função atualizada",
        description: "A função do usuário foi atualizada com sucesso."
      });

      // Update local state
      const updatedUsers = users.map(u => 
        u.id === selectedUser.id ? { ...u, role: selectedRole } : u
      );
      
      setUsers(updatedUsers);
      setActiveUsers(updatedUsers.filter(u => u.status === UserStatus.ATIVO));
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar função",
        description: "Não foi possível atualizar a função do usuário."
      });
    }
  };

  // Format user role for display
  const formatRole = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRADOR:
        return "Administrador";
      case UserRole.GERENTE:
        return "Gerente";
      case UserRole.SUPERVISOR:
        return "Supervisor";
      case UserRole.CORRETOR:
        return "Corretor";
      case UserRole.GERENTE_PRODUTO:
        return "Gerente de Produto";
      case UserRole.FUNCIONARIO:
        return "Funcionário";
      default:
        return role;
    }
  };

  // Get user status badge
  const getUserStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ATIVO:
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Ativo</Badge>;
      case UserStatus.PENDENTE:
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Pendente</Badge>;
      case UserStatus.INATIVO:
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get user role badge
  const getUserRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRADOR:
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Administrador</Badge>;
      case UserRole.GERENTE:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Gerente</Badge>;
      case UserRole.SUPERVISOR:
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">Supervisor</Badge>;
      case UserRole.CORRETOR:
        return <Badge className="bg-green-100 text-green-800 border-green-300">Corretor</Badge>;
      case UserRole.GERENTE_PRODUTO:
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Gerente de Produto</Badge>;
      case UserRole.FUNCIONARIO:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Funcionário</Badge>;
      default:
        return <Badge>{formatRole(role)}</Badge>;
    }
  };

  // Get avatar fallback from user name
  const getAvatarFallback = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!hasPermission(UserRole.ADMINISTRADOR)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Acesso Restrito</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página. Esta área é restrita aos administradores.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <Shield className="w-20 h-20 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, aprove cadastros e defina níveis de acesso
          </p>
        </div>

        <Tabs defaultValue="pending" className="mt-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Pendentes</span>
              {pendingUsers.length > 0 && (
                <Badge variant="secondary" className="ml-1">{pendingUsers.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="inactive">Inativos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Solicitações Pendentes
                </CardTitle>
                <CardDescription>
                  Usuários que se cadastraram e aguardam aprovação para acessar o sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Não há solicitações pendentes
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{getAvatarFallback(user.nome)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div>{user.nome}</div>
                                <div className="text-sm text-muted-foreground">
                                  {getUserStatusBadge(user.status)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{new Date(user.dataCadastro).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleApproveUser(user.id)}
                                className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                              >
                                <Check className="w-4 h-4 mr-1" /> Aprovar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleRejectUser(user.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                              >
                                <X className="w-4 h-4 mr-1" /> Rejeitar
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
          </TabsContent>
          
          <TabsContent value="active" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Usuários Ativos
                </CardTitle>
                <CardDescription>
                  Usuários ativos no sistema e suas funções
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeUsers.map((userData) => (
                      <TableRow key={userData.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={userData.avatar} />
                              <AvatarFallback>{getAvatarFallback(userData.nome)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{userData.nome}</div>
                              <div className="text-sm text-muted-foreground">
                                {getUserStatusBadge(userData.status)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{userData.email}</TableCell>
                        <TableCell>{getUserRoleBadge(userData.role)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={userData.id === user?.id} // Não pode editar a si mesmo
                            onClick={() => handleEditUser(userData)}
                          >
                            <UserCog className="w-4 h-4 mr-1" /> Editar Função
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inactive" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Usuários Inativos</CardTitle>
                <CardDescription>
                  Usuários inativos ou que tiveram o acesso negado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inactiveUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Não há usuários inativos
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inactiveUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{getAvatarFallback(user.nome)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div>{user.nome}</div>
                                <div className="text-sm text-muted-foreground">
                                  {getUserStatusBadge(user.status)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{new Date(user.dataCadastro).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleApproveUser(user.id)}
                            >
                              <UserPlus className="w-4 h-4 mr-1" /> Ativar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Função do Usuário</DialogTitle>
            <DialogDescription>
              Altere a função do usuário {selectedUser?.nome} no sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1">
                  Função
                </label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.CORRETOR}>Corretor</SelectItem>
                    <SelectItem value={UserRole.GERENTE}>Gerente</SelectItem>
                    <SelectItem value={UserRole.SUPERVISOR}>Supervisor</SelectItem>
                    <SelectItem value={UserRole.ADMINISTRADOR}>Administrador</SelectItem>
                    <SelectItem value={UserRole.GERENTE_PRODUTO}>Gerente de Produto</SelectItem>
                    <SelectItem value={UserRole.FUNCIONARIO}>Funcionário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUserRole}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
