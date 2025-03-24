
export enum UserRole {
  CORRETOR = "corretor",
  GERENTE = "gerente",
  SUPERVISOR = "supervisor",
  GERENTE_PRODUTO = "gerente_produto",
  ADMINISTRADOR = "administrador",
  FUNCIONARIO = "funcionario"
}

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatar?: string;
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
}

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
}

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

export interface DesempenhoCorretor {
  corretorId: string;
  periodo: string;
  leadsAtribuidos: number;
  leadsConvertidos: number;
  imoveisVendidos: number;
  receita: number;
  satisfacaoCliente: number;
  tempoResposta: number;
}

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
}

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

export interface FormaPagamento {
  id: string;
  nome: string;
  descricao: string;
  parcelas: number;
  taxaJuros?: number;
  entradaMinima?: number;
}
