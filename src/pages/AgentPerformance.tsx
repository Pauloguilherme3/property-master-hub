
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
import { Agent, AgentPerformance as AgentPerformanceType } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock data for the performance page
const mockAgents = [
  {
    id: "1",
    name: "John Smith",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  }
];

const mockPerformanceData: DesempenhoCorretor[] = [
  {
    corretorId: "1",
    periodo: "Jan 2024",
    leadsAtribuidos: 28,
    leadsConvertidos: 8,
    imoveisVendidos: 3,
    receita: 45000,
    satisfacaoCliente: 4.7,
    tempoResposta: 2.3,
    // English aliases for compatibility
    agentId: "1",
    period: "Jan 2024",
    leadsAssigned: 28,
    leadsConverted: 8,
    propertiesSold: 3,
    revenue: 45000,
    customerSatisfaction: 4.7,
    responseTime: 2.3
  },
  {
    corretorId: "1",
    periodo: "Feb 2024",
    leadsAtribuidos: 32,
    leadsConvertidos: 10,
    imoveisVendidos: 4,
    receita: 62000,
    satisfacaoCliente: 4.8,
    tempoResposta: 2.1,
    // English aliases
    agentId: "1",
    period: "Feb 2024",
    leadsAssigned: 32,
    leadsConverted: 10,
    propertiesSold: 4,
    revenue: 62000,
    customerSatisfaction: 4.8,
    responseTime: 2.1
  },
  {
    corretorId: "1",
    periodo: "Mar 2024",
    leadsAtribuidos: 35,
    leadsConvertidos: 12,
    imoveisVendidos: 5,
    receita: 78000,
    satisfacaoCliente: 4.9,
    tempoResposta: 1.8,
    // English aliases
    agentId: "1",
    period: "Mar 2024",
    leadsAssigned: 35,
    leadsConverted: 12,
    propertiesSold: 5,
    revenue: 78000,
    customerSatisfaction: 4.9,
    responseTime: 1.8
  },
  {
    corretorId: "2",
    periodo: "Jan 2024",
    leadsAtribuidos: 18,
    leadsConvertidos: 4,
    imoveisVendidos: 1,
    receita: 18000,
    satisfacaoCliente: 4.2,
    tempoResposta: 3.5,
    // English aliases
    agentId: "2",
    period: "Jan 2024",
    leadsAssigned: 18,
    leadsConverted: 4,
    propertiesSold: 1,
    revenue: 18000,
    customerSatisfaction: 4.2,
    responseTime: 3.5
  },
  {
    corretorId: "2",
    periodo: "Feb 2024",
    leadsAtribuidos: 22,
    leadsConvertidos: 6,
    imoveisVendidos: 2,
    receita: 35000,
    satisfacaoCliente: 4.5,
    tempoResposta: 3.0,
    // English aliases
    agentId: "2",
    period: "Feb 2024",
    leadsAssigned: 22,
    leadsConverted: 6,
    propertiesSold: 2,
    revenue: 35000,
    customerSatisfaction: 4.5,
    responseTime: 3.0
  },
  {
    corretorId: "2",
    periodo: "Mar 2024",
    leadsAtribuidos: 25,
    leadsConvertidos: 8,
    imoveisVendidos: 3,
    receita: 47000,
    satisfacaoCliente: 4.6,
    tempoResposta: 2.8,
    // English aliases
    agentId: "2",
    period: "Mar 2024",
    leadsAssigned: 25,
    leadsConverted: 8,
    propertiesSold: 3,
    revenue: 47000,
    customerSatisfaction: 4.6,
    responseTime: 2.8
  },
  {
    corretorId: "3",
    periodo: "Jan 2024",
    leadsAtribuidos: 38,
    leadsConvertidos: 15,
    imoveisVendidos: 6,
    receita: 95000,
    satisfacaoCliente: 4.9,
    tempoResposta: 1.5,
    // English aliases
    agentId: "3",
    period: "Jan 2024",
    leadsAssigned: 38,
    leadsConverted: 15,
    propertiesSold: 6,
    revenue: 95000,
    customerSatisfaction: 4.9,
    responseTime: 1.5
  },
  {
    corretorId: "3",
    periodo: "Feb 2024",
    leadsAtribuidos: 42,
    leadsConvertidos: 18,
    imoveisVendidos: 8,
    receita: 125000,
    satisfacaoCliente: 4.9,
    tempoResposta: 1.3,
    // English aliases
    agentId: "3",
    period: "Feb 2024",
    leadsAssigned: 42,
    leadsConverted: 18,
    propertiesSold: 8,
    revenue: 125000,
    customerSatisfaction: 4.9,
    responseTime: 1.3
  },
  {
    corretorId: "3",
    periodo: "Mar 2024",
    leadsAtribuidos: 45,
    leadsConvertidos: 20,
    imoveisVendidos: 9,
    receita: 142000,
    satisfacaoCliente: 5.0,
    tempoResposta: 1.2,
    // English aliases
    agentId: "3",
    period: "Mar 2024",
    leadsAssigned: 45,
    leadsConverted: 20,
    propertiesSold: 9,
    revenue: 142000,
    customerSatisfaction: 5.0,
    responseTime: 1.2
  }
];

export default function AgentPerformance() {
  const [selectedAgentId, setSelectedAgentId] = useState("all");
  const [timeframe, setTimeframe] = useState("3m");

  // In a real app, these would be API calls
  const { data: agents = [] } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAgents;
    }
  });

  const { data: performanceData = [] } = useQuery({
    queryKey: ["agent-performance", selectedAgentId, timeframe],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 700));
      if (selectedAgentId === "all") {
        return mockPerformanceData;
      } else {
        return mockPerformanceData.filter(p => p.agentId === selectedAgentId);
      }
    }
  });

  // Aggregate performance data for charts
  const salesData = performanceData.reduce((acc: Record<string, any>[], item) => {
    const existingPeriod = acc.find(p => p.period === item.period);
    
    if (existingPeriod) {
      existingPeriod.propertiesSold += item.propertiesSold;
      existingPeriod.revenue += item.revenue;
    } else {
      acc.push({
        period: item.period,
        propertiesSold: item.propertiesSold,
        revenue: item.revenue
      });
    }
    
    return acc;
  }, []);

  const leadsData = performanceData.reduce((acc: Record<string, any>[], item) => {
    const existingPeriod = acc.find(p => p.period === item.period);
    
    if (existingPeriod) {
      existingPeriod.leadsAssigned += item.leadsAssigned;
      existingPeriod.leadsConverted += item.leadsConverted;
      existingPeriod.conversionRate = (existingPeriod.leadsConverted / existingPeriod.leadsAssigned) * 100;
    } else {
      acc.push({
        period: item.period,
        leadsAssigned: item.leadsAssigned,
        leadsConverted: item.leadsConverted,
        conversionRate: (item.leadsConverted / item.leadsAssigned) * 100
      });
    }
    
    return acc;
  }, []);

  // Calculate total stats
  const totalPropertiesSold = performanceData.reduce((sum, item) => sum + item.propertiesSold, 0);
  const totalRevenue = performanceData.reduce((sum, item) => sum + item.revenue, 0);
  const totalLeadsAssigned = performanceData.reduce((sum, item) => sum + item.leadsAssigned, 0);
  const totalLeadsConverted = performanceData.reduce((sum, item) => sum + item.leadsConverted, 0);
  const avgSatisfaction = performanceData.length > 0 
    ? performanceData.reduce((sum, item) => sum + item.customerSatisfaction, 0) / performanceData.length
    : 0;

  return (
    <div className="container py-10 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agent Performance</h1>
            <p className="text-muted-foreground">
              Monitor and analyze agent performance metrics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              Export
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Properties Sold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPropertiesSold}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenue Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(1)}k</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lead Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalLeadsAssigned > 0 
                  ? ((totalLeadsConverted / totalLeadsAssigned) * 100).toFixed(1)
                  : "0"}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Customer Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSatisfaction.toFixed(1)}/5</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>Properties sold and revenue generated per period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="propertiesSold" name="Properties Sold" fill="#3b82f6" />
                    <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lead Conversion</CardTitle>
              <CardDescription>Lead assignment and conversion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={leadsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="leadsAssigned" name="Leads Assigned" stroke="#8884d8" />
                    <Line yAxisId="left" type="monotone" dataKey="leadsConverted" name="Leads Converted" stroke="#82ca9d" />
                    <Line yAxisId="right" type="monotone" dataKey="conversionRate" name="Conversion Rate (%)" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Performance Breakdown (only if multiple agents) */}
        {selectedAgentId === "all" && (
          <Card>
            <CardHeader>
              <CardTitle>Agent Comparison</CardTitle>
              <CardDescription>Performance breakdown by agent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {agents.map((agent) => {
                  const agentData = mockPerformanceData.filter(p => p.agentId === agent.id);
                  const totalSales = agentData.reduce((sum, item) => sum + item.propertiesSold, 0);
                  const totalRevenue = agentData.reduce((sum, item) => sum + item.revenue, 0);
                  const conversionRate = agentData.length > 0
                    ? (agentData.reduce((sum, item) => sum + item.leadsConverted, 0) / 
                       agentData.reduce((sum, item) => sum + item.leadsAssigned, 0)) * 100
                    : 0;
                  
                  return (
                    <div key={agent.id} className="flex flex-col items-center p-4 border rounded-lg">
                      <Avatar className="h-16 w-16 mb-3">
                        <AvatarImage src={agent.avatar} alt={agent.name} />
                        <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-semibold mb-1">{agent.name}</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm w-full">
                        <div className="text-muted-foreground">Sales:</div>
                        <div className="text-right font-medium">{totalSales}</div>
                        <div className="text-muted-foreground">Revenue:</div>
                        <div className="text-right font-medium">${(totalRevenue / 1000).toFixed(1)}k</div>
                        <div className="text-muted-foreground">Conversion Rate:</div>
                        <div className="text-right font-medium">{conversionRate.toFixed(1)}%</div>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-4">View Details</Button>
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
