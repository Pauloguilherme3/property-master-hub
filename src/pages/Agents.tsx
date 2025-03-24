
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
import { Agent, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

// Mock data - in a real app, this would come from an API
const mockAgents: Agent[] = [
  {
    id: "1",
    userId: "user1",
    name: "John Smith",
    email: "john.smith@proprmaster.com",
    phone: "(555) 123-4567",
    bio: "Experienced agent specializing in luxury properties",
    specialties: ["Luxury", "Residential", "Investment"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 4.8,
    salesVolume: 5250000,
    activeListings: 12,
    closedDeals: 45,
    joinedAt: "2022-04-15T10:00:00Z",
    status: "active"
  },
  {
    id: "2",
    userId: "user2",
    name: "Sarah Johnson",
    email: "sarah.johnson@proprmaster.com",
    phone: "(555) 987-6543",
    bio: "New agent with a background in marketing",
    specialties: ["Residential", "First-time buyers"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 4.2,
    salesVolume: 1850000,
    activeListings: 5,
    closedDeals: 12,
    joinedAt: "2023-01-10T10:00:00Z",
    status: "active"
  },
  {
    id: "3",
    userId: "user3",
    name: "Michael Rodriguez",
    email: "michael.rodriguez@proprmaster.com",
    phone: "(555) 456-7890",
    bio: "Top-performing agent with 10+ years of experience",
    specialties: ["Commercial", "Investment", "Development"],
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 4.9,
    salesVolume: 12500000,
    activeListings: 18,
    closedDeals: 78,
    joinedAt: "2018-09-20T10:00:00Z",
    status: "active"
  }
];

export default function Agents() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetching agents data
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockAgents;
    }
  });

  const canManageAgents = hasPermission([
    UserRole.MANAGER, 
    UserRole.SUPERVISOR, 
    UserRole.ADMINISTRATOR
  ]);

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddAgent = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Add agent functionality will be available soon.",
    });
  };

  const handleActionClick = (action: string, agentId: string) => {
    toast({
      title: `${action} Action`,
      description: `${action} for agent ${agentId} will be available soon.`,
    });
  };

  return (
    <div className="container py-10 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
            <p className="text-muted-foreground">
              Manage your real estate agents and their performance
            </p>
          </div>
          {canManageAgents && (
            <Button onClick={handleAddAgent}>
              <Plus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search agents..."
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
            <CardTitle>Agent Directory</CardTitle>
            <CardDescription>
              View and manage your real estate agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Specialties</TableHead>
                  <TableHead className="text-right">Active Listings</TableHead>
                  <TableHead className="text-right">Closed Deals</TableHead>
                  <TableHead className="text-right">Rating</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  {canManageAgents && <TableHead className="w-[50px]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Loading agents...
                    </TableCell>
                  </TableRow>
                ) : filteredAgents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      No agents found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={agent.avatar} alt={agent.name} />
                            <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-muted-foreground">{agent.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {agent.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{agent.activeListings}</TableCell>
                      <TableCell className="text-right">{agent.closedDeals}</TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium">{agent.rating}</span>
                        <span className="text-muted-foreground">/5</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                          {agent.status === 'active' ? 'Active' : agent.status === 'inactive' ? 'Inactive' : 'On Leave'}
                        </Badge>
                      </TableCell>
                      {canManageAgents && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleActionClick("View Profile", agent.id)}>
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleActionClick("Edit", agent.id)}>
                                Edit Agent
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleActionClick("Assign Leads", agent.id)}>
                                Assign Leads
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleActionClick("Performance", agent.id)}>
                                View Performance
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
