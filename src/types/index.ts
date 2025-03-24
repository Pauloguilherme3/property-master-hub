
export enum UserRole {
  CORRETOR = "corretor",
  GERENTE = "gerente",
  SUPERVISOR = "supervisor",
  GERENTE_PRODUTO = "gerente_produto",
  ADMINISTRADOR = "administrador",
  FUNCIONARIO = "funcionario",
  
  // English aliases for backward compatibility
  AGENT = "corretor",
  MANAGER = "gerente",
  SUPERVISOR = "supervisor",
  PRODUCT_MANAGER = "gerente_produto",
  ADMINISTRATOR = "administrador",
  STAFF = "funcionario"
}

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatar?: string;
  
  // English alias for backward compatibility
  name?: string;
}

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
  tipoImovel: "casa" | "apartamento" | "lote" | "comercial";
  previsaoEntrega: string;
  dormitorios: number;
  banheiros: number;
  area: number;
  imagens: string[];
  tourVirtual?: string;
  videos?: string[];
  destaque: boolean;
  status: "disponivel" | "reservado" | "vendido";
  coordenadas?: {
    lat: number;
    lng: number;
  };
  comodidades?: string[];
  etapaConstrucao?: {
    nome: string;
    porcentagemConcluida: number;
  }[];
  dataCriacao: string;
  dataAtualizacao: string;
  criadoPor: string;
  corretorResponsavelId?: string;
  
  // English aliases for backward compatibility
  title?: string;
  description?: string;
  price?: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  builder?: string;
  propertyType?: "house" | "apartment" | "lot" | "commercial";
  deliveryForecast?: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  images?: string[];
  virtualTour?: string;
  featured?: boolean;
  amenities?: string[];
  constructionStage?: {
    name: string;
    percentageCompleted: number;
  }[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  agentInChargeId?: string;
}

// Alias for backward compatibility
export interface Property extends Empreendimento {}

export interface Unidade {
  id: string;
  empreendimentoId: string;
  numero: string;
  bloco?: string;
  andar?: number;
  dormitorios: number;
  banheiros: number;
  area: number;
  preco: number;
  status: "disponivel" | "reservado" | "vendido";
  plantaBaixa?: string;
  posicao?: {
    x: number;
    y: number;
  };
  
  // English aliases
  propertyId?: string;
  number?: string;
  block?: string;
  floor?: number;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  price?: number;
  floorPlan?: string;
  position?: {
    x: number;
    y: number;
  };
}

// Alias for backward compatibility
export interface Unit extends Unidade {}

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
  
  // English aliases
  name?: string;
  phone?: string;
  bio?: string;
  specialties?: string[];
  rating?: number;
  salesVolume?: number;
  activeListings?: number;
  closedDeals?: number;
  joinedAt?: string;
}

// Alias for backward compatibility
export interface Agent extends Corretor {}

export interface DesempenhoCorretor {
  corretorId: string;
  periodo: string;
  leadsAtribuidos: number;
  leadsConvertidos: number;
  imoveisVendidos: number;
  receita: number;
  satisfacaoCliente: number;
  tempoResposta: number;
  
  // English aliases
  agentId?: string;
  period?: string;
  leadsAssigned?: number;
  leadsConverted?: number;
  propertiesSold?: number;
  revenue?: number;
  customerSatisfaction?: number;
  responseTime?: number;
}

// Alias for backward compatibility
export interface AgentPerformance extends DesempenhoCorretor {}

export interface Lead {
  id: string;
  nomeCliente: string;
  emailCliente: string;
  telefoneCliente: string;
  empreendimentoId?: string;
  status: "novo" | "contatado" | "qualificado" | "nao_qualificado" | "convertido" | "perdido";
  origem: string;
  observacoes?: string;
  corretorResponsavelId?: string;
  dataCriacao: string;
  dataAtualizacao: string;
  
  // English aliases
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  propertyId?: string;
  source?: string;
  notes?: string;
  agentInChargeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Reserva {
  id: string;
  empreendimentoId: string;
  unidadeId: string;
  empreendimento?: Empreendimento;
  unidade?: Unidade;
  nomeCliente: string;
  emailCliente: string;
  telefoneCliente: string;
  dataInicio: string;
  dataFim: string;
  status: "pendente" | "confirmada" | "cancelada";
  observacoes?: string;
  corretorId?: string;
  tipoVisita: "presencial" | "virtual";
  dataCriacao: string;
  criadoPor: string;
  valorSinal?: number;
  documentos?: string[];
  
  // English aliases
  propertyId?: string;
  unitId?: string;
  property?: Property;
  unit?: Unit;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  agentId?: string;
  visitType?: "in-person" | "virtual";
  createdAt?: string;
  createdBy?: string;
  depositAmount?: number;
  documents?: string[];
}

// Alias for backward compatibility
export interface Reservation extends Reserva {}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

// Interfaces para formulários e filtros
export interface FiltroEmpreendimento {
  tipoImovel?: string[];
  cidade?: string[];
  precoMin?: number;
  precoMax?: number;
  areaMin?: number;
  areaMax?: number;
  dormitoriosMin?: number;
  banheirosMin?: number;
  status?: string[];
}

export interface PropertyFilter extends FiltroEmpreendimento {}

export interface FormaPagamento {
  id: string;
  nome: string;
  descricao: string;
  parcelas: number;
  taxaJuros?: number;
  entradaMinima?: number;
  
  // English aliases
  name?: string;
  description?: string;
  installments?: number;
  interestRate?: number;
  minimumDownPayment?: number;
}

export interface PaymentMethod extends FormaPagamento {}
