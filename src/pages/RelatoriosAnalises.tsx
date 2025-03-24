
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { formatCurrency } from "@/utils/animations";

// Mock data for sales report
const vendasPorMes = [
  { nome: 'Jan', vendas: 4, valor: 1200000 },
  { nome: 'Fev', vendas: 3, valor: 900000 },
  { nome: 'Mar', vendas: 6, valor: 1800000 },
  { nome: 'Abr', vendas: 8, valor: 2400000 },
  { nome: 'Mai', vendas: 7, valor: 2100000 },
  { nome: 'Jun', vendas: 5, valor: 1500000 },
];

// Mock data for property status
const statusPropriedades = [
  { nome: 'Disponível', valor: 45, color: '#22c55e' },
  { nome: 'Reservado', valor: 15, color: '#eab308' },
  { nome: 'Vendido', valor: 40, color: '#ef4444' },
];

// Mock data for leads by source
const leadsPorFonte = [
  { nome: 'Site', valor: 35, color: '#3b82f6' },
  { nome: 'Indicação', valor: 25, color: '#8b5cf6' },
  { nome: 'Redes Sociais', valor: 20, color: '#ec4899' },
  { nome: 'Anúncios', valor: 15, color: '#f97316' },
  { nome: 'Outros', valor: 5, color: '#64748b' },
];

// Mock data for performance by agent
const desempenhoPorCorretor = [
  { nome: 'Ana Silva', vendas: 12, valor: 3600000 },
  { nome: 'Carlos Santos', vendas: 8, valor: 2400000 },
  { nome: 'Mariana Oliveira', vendas: 15, valor: 4500000 },
  { nome: 'Roberto Lima', vendas: 10, valor: 3000000 },
  { nome: 'Juliana Costa', vendas: 7, valor: 2100000 },
];

// Custom tooltip for currency
const CurrencyTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-md shadow-md">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-primary">{`Valor: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const RelatoriosAnalisesPage = () => {
  const [periodoVendas, setPeriodoVendas] = useState("6meses");
  const [tipoPropriedade, setTipoPropriedade] = useState("todos");

  return (
    <div className="container py-10 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios e Análises</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho das vendas, reservas e leads
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Select value={periodoVendas} onValueChange={setPeriodoVendas}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="3meses">Últimos 3 meses</SelectItem>
                <SelectItem value="6meses">Últimos 6 meses</SelectItem>
                <SelectItem value="1ano">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoPropriedade} onValueChange={setTipoPropriedade}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de Propriedade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="lotes">Lotes</SelectItem>
                <SelectItem value="casas">Casas</SelectItem>
                <SelectItem value="apartamentos">Apartamentos</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">150</CardTitle>
                <CardDescription>Total de Unidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium">+12% </span>
                  em relação ao período anterior
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">33</CardTitle>
                <CardDescription>Vendas Realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium">+8% </span>
                  em relação ao período anterior
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{formatCurrency(9900000)}</CardTitle>
                <CardDescription>Volume de Vendas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium">+15% </span>
                  em relação ao período anterior
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="vendas">
            <TabsList className="mb-4">
              <TabsTrigger value="vendas">Vendas</TabsTrigger>
              <TabsTrigger value="propriedades">Propriedades</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="corretores">Corretores</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vendas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendas por Mês</CardTitle>
                    <CardDescription>
                      Número de unidades vendidas nos últimos meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={vendasPorMes}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nome" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="vendas" name="Unidades Vendidas" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Volume de Vendas</CardTitle>
                    <CardDescription>
                      Valor total das vendas nos últimos meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={vendasPorMes}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nome" />
                          <YAxis tickFormatter={(value) => formatCurrency(value).slice(0, -3) + 'K'} />
                          <Tooltip content={<CurrencyTooltip />} />
                          <Legend />
                          <Line type="monotone" dataKey="valor" name="Valor de Vendas" stroke="#8b5cf6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="propriedades">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status das Unidades</CardTitle>
                    <CardDescription>
                      Distribuição das unidades por status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusPropriedades}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="valor"
                          >
                            {statusPropriedades.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} unidades`, 'Quantidade']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Tipo</CardTitle>
                    <CardDescription>
                      Distribuição das unidades por tipo de imóvel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { nome: 'Lotes', valor: 60 },
                            { nome: 'Casas', valor: 25 },
                            { nome: 'Apartamentos', valor: 10 },
                            { nome: 'Comercial', valor: 5 },
                          ]}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="nome" type="category" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="valor" name="Quantidade" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="leads">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Origem dos Leads</CardTitle>
                    <CardDescription>
                      Distribuição dos leads por canal de origem
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={leadsPorFonte}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="valor"
                          >
                            {leadsPorFonte.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} leads`, 'Quantidade']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Taxa de Conversão</CardTitle>
                    <CardDescription>
                      Taxa de conversão mensal de leads para vendas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { nome: 'Jan', taxa: 15 },
                            { nome: 'Fev', taxa: 18 },
                            { nome: 'Mar', taxa: 20 },
                            { nome: 'Abr', taxa: 25 },
                            { nome: 'Mai', taxa: 22 },
                            { nome: 'Jun', taxa: 24 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nome" />
                          <YAxis domain={[0, 30]} tickFormatter={(value) => `${value}%`} />
                          <Tooltip formatter={(value) => [`${value}%`, 'Taxa de Conversão']} />
                          <Legend />
                          <Line type="monotone" dataKey="taxa" name="Taxa de Conversão" stroke="#f97316" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="corretores">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendas por Corretor</CardTitle>
                    <CardDescription>
                      Número de unidades vendidas por corretor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={desempenhoPorCorretor}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="nome" type="category" width={120} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="vendas" name="Unidades Vendidas" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Volume por Corretor</CardTitle>
                    <CardDescription>
                      Volume de vendas por corretor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={desempenhoPorCorretor}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tickFormatter={(value) => formatCurrency(value).slice(0, -3) + 'K'} />
                          <YAxis dataKey="nome" type="category" width={120} />
                          <Tooltip content={<CurrencyTooltip />} />
                          <Legend />
                          <Bar dataKey="valor" name="Volume de Vendas" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosAnalisesPage;
