
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Corretor, DesempenhoCorretor } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for the performance page
const mockCorretores = [
  {
    id: "1",
    nome: "João Silva",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "2",
    nome: "Maria Santos",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "3",
    nome: "Carlos Oliveira",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  }
];

const mockDadosDesempenho: DesempenhoCorretor[] = [
  {
    corretorId: "1",
    periodo: "Jan 2024",
    leadsAtribuidos: 28,
    leadsConvertidos: 8,
    imoveisVendidos: 3,
    receita: 45000,
    satisfacaoCliente: 4.7,
    tempoResposta: 2.3
  },
  {
    corretorId: "1",
    periodo: "Fev 2024",
    leadsAtribuidos: 32,
    leadsConvertidos: 10,
    imoveisVendidos: 4,
    receita: 62000,
    satisfacaoCliente: 4.8,
    tempoResposta: 2.1
  },
  {
    corretorId: "1",
    periodo: "Mar 2024",
    leadsAtribuidos: 35,
    leadsConvertidos: 12,
    imoveisVendidos: 5,
    receita: 78000,
    satisfacaoCliente: 4.9,
    tempoResposta: 1.8
  },
  {
    corretorId: "2",
    periodo: "Jan 2024",
    leadsAtribuidos: 18,
    leadsConvertidos: 4,
    imoveisVendidos: 1,
    receita: 18000,
    satisfacaoCliente: 4.2,
    tempoResposta: 3.5
  },
  {
    corretorId: "2",
    periodo: "Fev 2024",
    leadsAtribuidos: 22,
    leadsConvertidos: 6,
    imoveisVendidos: 2,
    receita: 35000,
    satisfacaoCliente: 4.5,
    tempoResposta: 3.0
  },
  {
    corretorId: "2",
    periodo: "Mar 2024",
    leadsAtribuidos: 25,
    leadsConvertidos: 8,
    imoveisVendidos: 3,
    receita: 47000,
    satisfacaoCliente: 4.6,
    tempoResposta: 2.8
  },
  {
    corretorId: "3",
    periodo: "Jan 2024",
    leadsAtribuidos: 38,
    leadsConvertidos: 15,
    imoveisVendidos: 6,
    receita: 95000,
    satisfacaoCliente: 4.9,
    tempoResposta: 1.5
  },
  {
    corretorId: "3",
    periodo: "Fev 2024",
    leadsAtribuidos: 42,
    leadsConvertidos: 18,
    imoveisVendidos: 8,
    receita: 125000,
    satisfacaoCliente: 4.9,
    tempoResposta: 1.3
  },
  {
    corretorId: "3",
    periodo: "Mar 2024",
    leadsAtribuidos: 45,
    leadsConvertidos: 20,
    imoveisVendidos: 9,
    receita: 142000,
    satisfacaoCliente: 5.0,
    tempoResposta: 1.2
  }
];

export default function DesempenhoCorretores() {
  const [selectedCorretorId, setSelectedCorretorId] = useState("all");
  const [timeframe, setTimeframe] = useState("3m");

  // In a real app, these would be API calls
  const { data: corretores = [] } = useQuery({
    queryKey: ["corretores"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCorretores;
    }
  });

  const { data: dadosDesempenho = [] } = useQuery({
    queryKey: ["corretor-desempenho", selectedCorretorId, timeframe],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 700));
      if (selectedCorretorId === "all") {
        return mockDadosDesempenho;
      } else {
        return mockDadosDesempenho.filter(p => p.corretorId === selectedCorretorId);
      }
    }
  });

  // Aggregate performance data for charts
  const dadosVendas = dadosDesempenho.reduce((acc: Record<string, any>[], item) => {
    const existingPeriod = acc.find(p => p.periodo === item.periodo);
    
    if (existingPeriod) {
      existingPeriod.imoveisVendidos += item.imoveisVendidos;
      existingPeriod.receita += item.receita;
    } else {
      acc.push({
        periodo: item.periodo,
        imoveisVendidos: item.imoveisVendidos,
        receita: item.receita
      });
    }
    
    return acc;
  }, []);

  const dadosLeads = dadosDesempenho.reduce((acc: Record<string, any>[], item) => {
    const existingPeriod = acc.find(p => p.periodo === item.periodo);
    
    if (existingPeriod) {
      existingPeriod.leadsAtribuidos += item.leadsAtribuidos;
      existingPeriod.leadsConvertidos += item.leadsConvertidos;
      existingPeriod.taxaConversao = (existingPeriod.leadsConvertidos / existingPeriod.leadsAtribuidos) * 100;
    } else {
      acc.push({
        periodo: item.periodo,
        leadsAtribuidos: item.leadsAtribuidos,
        leadsConvertidos: item.leadsConvertidos,
        taxaConversao: (item.leadsConvertidos / item.leadsAtribuidos) * 100
      });
    }
    
    return acc;
  }, []);

  // Calculate total stats
  const totalImoveisVendidos = dadosDesempenho.reduce((sum, item) => sum + item.imoveisVendidos, 0);
  const totalReceita = dadosDesempenho.reduce((sum, item) => sum + item.receita, 0);
  const totalLeadsAtribuidos = dadosDesempenho.reduce((sum, item) => sum + item.leadsAtribuidos, 0);
  const totalLeadsConvertidos = dadosDesempenho.reduce((sum, item) => sum + item.leadsConvertidos, 0);
  const avgSatisfacao = dadosDesempenho.length > 0 
    ? dadosDesempenho.reduce((sum, item) => sum + item.satisfacaoCliente, 0) / dadosDesempenho.length
    : 0;

  return (
    <div className="container py-10 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Desempenho de Corretores</h1>
            <p className="text-muted-foreground">
              Monitore e analise métricas de desempenho dos corretores
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Mês</SelectItem>
                <SelectItem value="3m">3 Meses</SelectItem>
                <SelectItem value="6m">6 Meses</SelectItem>
                <SelectItem value="1y">1 Ano</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCorretorId} onValueChange={setSelectedCorretorId}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Selecionar Corretor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Corretores</SelectItem>
                {corretores.map((corretor) => (
                  <SelectItem key={corretor.id} value={corretor.id}>
                    {corretor.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              Exportar
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Imóveis Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalImoveisVendidos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Receita Gerada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {(totalReceita / 1000).toFixed(1)}k</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Conversão de Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalLeadsAtribuidos > 0 
                  ? ((totalLeadsConvertidos / totalLeadsAtribuidos) * 100).toFixed(1)
                  : "0"}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Satisfação do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSatisfacao.toFixed(1)}/5</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho de Vendas</CardTitle>
              <CardDescription>Imóveis vendidos e receita gerada por período</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosVendas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="imoveisVendidos" name="Imóveis Vendidos" fill="#3b82f6" />
                    <Bar yAxisId="right" dataKey="receita" name="Receita (R$)" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversão de Leads</CardTitle>
              <CardDescription>Atribuição de leads e taxas de conversão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosLeads}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="leadsAtribuidos" name="Leads Atribuídos" stroke="#8884d8" />
                    <Line yAxisId="left" type="monotone" dataKey="leadsConvertidos" name="Leads Convertidos" stroke="#82ca9d" />
                    <Line yAxisId="right" type="monotone" dataKey="taxaConversao" name="Taxa de Conversão (%)" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Performance Breakdown (only if multiple agents) */}
        {selectedCorretorId === "all" && (
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Corretores</CardTitle>
              <CardDescription>Detalhamento de desempenho por corretor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {corretores.map((corretor) => {
                  const dadosCorretor = mockDadosDesempenho.filter(p => p.corretorId === corretor.id);
                  const totalVendas = dadosCorretor.reduce((sum, item) => sum + item.imoveisVendidos, 0);
                  const totalReceita = dadosCorretor.reduce((sum, item) => sum + item.receita, 0);
                  const taxaConversao = dadosCorretor.length > 0
                    ? (dadosCorretor.reduce((sum, item) => sum + item.leadsConvertidos, 0) / 
                       dadosCorretor.reduce((sum, item) => sum + item.leadsAtribuidos, 0)) * 100
                    : 0;
                  
                  return (
                    <div key={corretor.id} className="flex flex-col items-center p-4 border rounded-lg">
                      <Avatar className="h-16 w-16 mb-3">
                        <AvatarImage src={corretor.avatar} alt={corretor.nome} />
                        <AvatarFallback>{corretor.nome.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-semibold mb-1">{corretor.nome}</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm w-full">
                        <div className="text-muted-foreground">Vendas:</div>
                        <div className="text-right font-medium">{totalVendas}</div>
                        <div className="text-muted-foreground">Receita:</div>
                        <div className="text-right font-medium">R$ {(totalReceita / 1000).toFixed(1)}k</div>
                        <div className="text-muted-foreground">Taxa de Conversão:</div>
                        <div className="text-right font-medium">{taxaConversao.toFixed(1)}%</div>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-4">Ver Detalhes</Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
