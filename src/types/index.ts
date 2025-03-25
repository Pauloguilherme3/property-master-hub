
export enum UserRole {
  CORRETOR = "corretor",
  GERENTE = "gerente",
  SUPERVISOR = "supervisor",
  ADMINISTRADOR = "administrador",
  GERENTE_PRODUTO = "gerente_produto",
  FUNCIONARIO = "funcionario"
}

// English aliases for backward compatibility
export const MANAGER = UserRole.GERENTE;
export const ADMINISTRATOR = UserRole.ADMINISTRADOR;
export const PRODUCT_MANAGER = UserRole.GERENTE_PRODUTO;

export interface User {
  id: string;
  nome: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirebaseInitialized: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

// Property/Real Estate Types
export interface Empreendimento {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  construtora: string;
  tipoImovel: "lote" | "casa" | "apartamento" | "comercial";
  previsaoEntrega: string;
  dormitorios: number;
  banheiros: number;
  area: number;
  imagens: string[];
  etapaConstrucao?: Array<{
    nome: string;
    porcentagemConcluida: number;
  }>;
  destaque: boolean;
  status: "disponivel" | "reservado" | "vendido";
  dataCriacao: string;
  dataAtualizacao: string;
  criadoPor: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  tourVirtual?: string;
}

// English alias for backward compatibility
export type Property = Empreendimento;

export interface FiltroEmpreendimento {
  tipoImovel?: string;
  cidade?: string;
  estado?: string;
  precoMin?: number;
  precoMax?: number;
  dormitoriosMin?: number;
  areamin?: number;
  areaMax?: number;
  status?: string;
}

export interface Unidade {
  id: string;
  empreendimentoId: string;
  numero: string;
  dormitorios: number;
  banheiros: number;
  area: number;
  preco: number;
  status: "disponivel" | "reservado" | "vendido";
  posicao: {
    x: number;
    y: number;
  };
}

export interface FormaPagamento {
  id: string;
  nome: string;
  descricao: string;
  parcelas: number;
  taxaJuros?: number;
  entradaMinima?: number;
}

export interface Reserva {
  id: string;
  empreendimentoId: string;
  unidadeId: string;
  nomeCliente: string;
  emailCliente: string;
  telefoneCliente: string;
  dataInicio: string;
  dataFim: string;
  status: "pendente" | "confirmada" | "cancelada";
  observacoes?: string;
  tipoVisita: "presencial" | "virtual";
  dataCriacao: string;
  criadoPor: string;
  valorSinal?: number;
  empreendimento?: Empreendimento;
  unidade?: Unidade;
}

// English aliases for backward compatibility
export type Unit = Unidade;
export type Reservation = Reserva;

// Agent Types 
export interface Corretor {
  id: string;
  userId: string;
  nome: string;
  email: string;
  telefone: string;
  biografia: string;
  especialidades: string[];
  avatar?: string;
  avaliacao: number;
  volumeVendas: number;
  imoveisAtivos: number;
  negociosFechados: number;
  dataIngresso: string;
  status: "ativo" | "inativo" | "ferias";
}

// English alias for backward compatibility
export type Agent = Corretor;

export interface DesempenhoCorretor {
  corretorId: string;
  periodo: string;
  leadsAtribuidos: number;
  leadsConvertidos: number;
  imoveisVendidos: number;
  receita: number;
  satisfacaoCliente: number;
  tempoResposta: number;
  
  // English aliases for backward compatibility
  agentId: string;
  period: string;
  leadsAssigned: number;
  leadsConverted: number;
  propertiesSold: number;
  revenue: number;
  customerSatisfaction: number;
  responseTime: number;
}
