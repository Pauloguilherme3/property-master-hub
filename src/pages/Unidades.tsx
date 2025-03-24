
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Filter,
  Search, 
  Home, 
  Ruler, 
  Calendar,
  ArrowUpDown
} from "lucide-react";
import { mockEmpreendimentos, mockUnidades, getStatusUnidade } from "@/utils/animations";
import { formatCurrency } from "@/utils/animations";

const UnidadesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("numero");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetching unidades data
  const { data: unidades = [], isLoading } = useQuery({
    queryKey: ["unidades"],
    queryFn: async () => {
      // Este seria uma chamada de API em uma aplicação real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockUnidades.map(unidade => {
        const empreendimento = mockEmpreendimentos.find(e => e.id === unidade.empreendimentoId);
        return {
          ...unidade,
          empreendimento
        };
      });
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filtrar e ordenar unidades
  const unidadesFiltradas = unidades
    .filter(unidade => {
      const matchesSearch = 
        unidade.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unidade.empreendimento?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unidade.empreendimento?.cidade?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "numero":
          comparison = a.numero.localeCompare(b.numero);
          break;
        case "empreendimento":
          comparison = (a.empreendimento?.nome || "").localeCompare(b.empreendimento?.nome || "");
          break;
        case "area":
          comparison = a.area - b.area;
          break;
        case "preco":
          comparison = a.preco - b.preco;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });

  return (
    <div className="container py-10 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Unidades</h1>
            <p className="text-muted-foreground">
              Visualize e gerencie todas as unidades disponíveis
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número, empreendimento ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle>Todas as Unidades</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-muted rounded w-full"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded w-full"></div>
                  ))}
                </div>
              </div>
            ) : unidadesFiltradas.length === 0 ? (
              <div className="text-center py-8">
                <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma unidade encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  Não encontramos unidades que correspondam aos seus critérios de busca.
                </p>
                <Button onClick={() => setSearchTerm("")}>Limpar Busca</Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("numero")}
                    >
                      <div className="flex items-center">
                        Número
                        {sortField === "numero" && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("empreendimento")}
                    >
                      <div className="flex items-center">
                        Empreendimento
                        {sortField === "empreendimento" && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer text-right"
                      onClick={() => handleSort("area")}
                    >
                      <div className="flex items-center justify-end">
                        Área
                        {sortField === "area" && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer text-right"
                      onClick={() => handleSort("preco")}
                    >
                      <div className="flex items-center justify-end">
                        Preço
                        {sortField === "preco" && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === "status" && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unidadesFiltradas.map((unidade) => (
                    <TableRow key={unidade.id}>
                      <TableCell>
                        <span className="font-medium">{unidade.numero}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{unidade.empreendimento?.nome || "Sem empreendimento"}</p>
                          <p className="text-sm text-muted-foreground">
                            {unidade.empreendimento?.cidade}, {unidade.empreendimento?.estado}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <Ruler className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{unidade.area} m²</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(unidade.preco)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusUnidade(unidade.status).color}>
                          {getStatusUnidade(unidade.status).label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                          >
                            <Link to={`/empreendimentos/${unidade.empreendimentoId}`}>
                              Ver
                            </Link>
                          </Button>
                          {unidade.status === "disponivel" && (
                            <Button 
                              size="sm"
                              asChild
                            >
                              <Link to={`/unidades/${unidade.id}/reserva`}>
                                <Calendar className="h-4 w-4 mr-1" />
                                Reservar
                              </Link>
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
    </div>
  );
};

export default UnidadesPage;
