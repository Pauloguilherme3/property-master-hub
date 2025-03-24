
import { DesempenhoCorretor } from "@/types";

// Sample agent performance data
export const sampleAgentPerformance: DesempenhoCorretor[] = [
  {
    corretorId: "corr001",
    periodo: "2023-05",
    leadsAtribuidos: 28,
    leadsConvertidos: 12,
    imoveisVendidos: 4,
    receita: 120000,
    satisfacaoCliente: 4.8,
    tempoResposta: 2.3,
    
    // English aliases for backward compatibility
    agentId: "corr001",
    period: "2023-05",
    leadsAssigned: 28,
    leadsConverted: 12,
    propertiesSold: 4,
    revenue: 120000,
    customerSatisfaction: 4.8,
    responseTime: 2.3
  },
  {
    corretorId: "corr002",
    periodo: "2023-05",
    leadsAtribuidos: 32,
    leadsConvertidos: 10,
    imoveisVendidos: 3,
    receita: 95000,
    satisfacaoCliente: 4.6,
    tempoResposta: 3.5,
    
    // English aliases
    agentId: "corr002",
    period: "2023-05",
    leadsAssigned: 32,
    leadsConverted: 10,
    propertiesSold: 3,
    revenue: 95000,
    customerSatisfaction: 4.6,
    responseTime: 3.5
  },
  {
    corretorId: "corr003",
    periodo: "2023-05",
    leadsAtribuidos: 25,
    leadsConvertidos: 14,
    imoveisVendidos: 5,
    receita: 150000,
    satisfacaoCliente: 4.9,
    tempoResposta: 1.8,
    
    // English aliases
    agentId: "corr003",
    period: "2023-05",
    leadsAssigned: 25,
    leadsConverted: 14,
    propertiesSold: 5,
    revenue: 150000,
    customerSatisfaction: 4.9,
    responseTime: 1.8
  }
];
