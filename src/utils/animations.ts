import { UserRole, Empreendimento, Reserva, Unidade, FormaPagamento } from "@/types";

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Mock data para empreendimentos
export const mockEmpreendimentos: Empreendimento[] = [
  {
    id: "emp-001",
    nome: "Residencial Jardim das Palmeiras",
    descricao: "Loteamento exclusivo com infraestrutura completa, áreas verdes e lazer",
    preco: 250000,
    endereco: "Rodovia BR-101, Km 123",
    cidade: "Florianópolis",
    estado: "SC",
    cep: "88000-000",
    construtora: "Construtora Horizonte",
    tipoImovel: "lote",
    previsaoEntrega: "2024-12-01",
    dormitorios: 0,
    banheiros: 0,
    area: 300,
    imagens: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    etapaConstrucao: [
      { nome: "Terraplanagem", porcentagemConcluida: 100 },
      { nome: "Infraestrutura", porcentagemConcluida: 80 },
      { nome: "Pavimentação", porcentagemConcluida: 50 },
      { nome: "Áreas Comuns", porcentagemConcluida: 30 }
    ],
    destaque: true,
    status: "disponivel",
    dataCriacao: "2023-04-10T10:30:00Z",
    dataAtualizacao: "2023-04-15T14:20:00Z",
    criadoPor: "corretor1"
  },
  {
    id: "emp-002",
    nome: "Condomínio Villa Verde",
    descricao: "Casas em condomínio fechado com total segurança e área de lazer completa",
    preco: 450000,
    endereco: "Rua das Oliveiras, 456",
    cidade: "Curitiba",
    estado: "PR",
    cep: "80000-000",
    construtora: "Construtora Premium",
    tipoImovel: "casa",
    previsaoEntrega: "2023-12-01",
    dormitorios: 3,
    banheiros: 2,
    area: 150,
    imagens: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    etapaConstrucao: [
      { nome: "Fundação", porcentagemConcluida: 100 },
      { nome: "Estrutura", porcentagemConcluida: 100 },
      { nome: "Alvenaria", porcentagemConcluida: 90 },
      { nome: "Acabamento", porcentagemConcluida: 60 },
      { nome: "Paisagismo", porcentagemConcluida: 20 }
    ],
    destaque: false,
    status: "disponivel",
    dataCriacao: "2023-05-05T09:15:00Z",
    dataAtualizacao: "2023-05-10T11:45:00Z",
    criadoPor: "corretor2"
  },
  {
    id: "emp-003",
    nome: "Loteamento Bosque dos Ipês",
    descricao: "Lotes residenciais em área privilegiada com vista panorâmica",
    preco: 180000,
    endereco: "Estrada do Campo, Km 5",
    cidade: "Joinville",
    estado: "SC",
    cep: "89000-000",
    construtora: "Loteadora Nacional",
    tipoImovel: "lote",
    previsaoEntrega: "2023-10-15",
    dormitorios: 0,
    banheiros: 0,
    area: 400,
    imagens: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    etapaConstrucao: [
      { nome: "Terraplanagem", porcentagemConcluida: 100 },
      { nome: "Infraestrutura", porcentagemConcluida: 100 },
      { nome: "Pavimentação", porcentagemConcluida: 80 },
      { nome: "Áreas Comuns", porcentagemConcluida: 50 }
    ],
    destaque: true,
    status: "disponivel",
    dataCriacao: "2023-03-20T13:40:00Z",
    dataAtualizacao: "2023-06-15T16:30:00Z",
    criadoPor: "corretor1"
  }
];

// Mock data para unidades
export const mockUnidades: Unidade[] = [
  {
    id: "unid-001",
    empreendimentoId: "emp-001",
    numero: "L01",
    area: 300,
    dormitorios: 0,
    banheiros: 0,
    preco: 250000,
    status: "disponivel",
    posicao: { x: 100, y: 150 }
  },
  {
    id: "unid-002",
    empreendimentoId: "emp-001",
    numero: "L02",
    area: 320,
    dormitorios: 0,
    banheiros: 0,
    preco: 260000,
    status: "reservado",
    posicao: { x: 200, y: 150 }
  },
  {
    id: "unid-003",
    empreendimentoId: "emp-001",
    numero: "L03",
    area: 280,
    dormitorios: 0,
    banheiros: 0,
    preco: 240000,
    status: "disponivel",
    posicao: { x: 300, y: 150 }
  },
  {
    id: "unid-004",
    empreendimentoId: "emp-002",
    numero: "C01",
    dormitorios: 3,
    banheiros: 2,
    area: 150,
    preco: 450000,
    status: "disponivel",
    posicao: { x: 100, y: 100 }
  },
  {
    id: "unid-005",
    empreendimentoId: "emp-002",
    numero: "C02",
    dormitorios: 3,
    banheiros: 2,
    area: 150,
    preco: 450000,
    status: "disponivel",
    posicao: { x: 250, y: 100 }
  }
];

// Mock data para formas de pagamento
export const mockFormasPagamento: FormaPagamento[] = [
  {
    id: "fp-001",
    nome: "À Vista",
    descricao: "Pagamento integral no ato da compra",
    parcelas: 1
  },
  {
    id: "fp-002",
    nome: "Financiamento Próprio",
    descricao: "Entrada + parcelas mensais direto com a construtora",
    parcelas: 180,
    taxaJuros: 0.99,
    entradaMinima: 20
  },
  {
    id: "fp-003",
    nome: "Financiamento Bancário",
    descricao: "Entrada + parcelas financiadas por banco parceiro",
    parcelas: 360,
    taxaJuros: 0.79,
    entradaMinima: 20
  }
];

// Mock data para reservas
export const mockReservas: Reserva[] = [
  {
    id: "res-001",
    empreendimentoId: "emp-001",
    unidadeId: "unid-002",
    nomeCliente: "João Silva",
    emailCliente: "joao.silva@exemplo.com",
    telefoneCliente: "(48) 99123-4567",
    dataInicio: "2023-06-20T14:00:00Z",
    dataFim: "2023-06-20T15:30:00Z",
    status: "confirmada",
    observacoes: "Cliente tem interesse em fazer proposta após a visita",
    tipoVisita: "presencial",
    dataCriacao: "2023-06-15T10:30:00Z",
    criadoPor: "corretor1",
    valorSinal: 5000
  },
  {
    id: "res-002",
    empreendimentoId: "emp-002",
    unidadeId: "unid-004",
    nomeCliente: "Maria Oliveira",
    emailCliente: "maria.oliveira@exemplo.com",
    telefoneCliente: "(41) 98765-4321",
    dataInicio: "2023-06-22T10:00:00Z",
    dataFim: "2023-06-22T11:30:00Z",
    status: "pendente",
    tipoVisita: "virtual",
    dataCriacao: "2023-06-16T15:45:00Z",
    criadoPor: "corretor2"
  },
  {
    id: "res-003",
    empreendimentoId: "emp-003",
    unidadeId: "unid-003",
    nomeCliente: "Pedro Santos",
    emailCliente: "pedro.santos@exemplo.com",
    telefoneCliente: "(47) 97654-3210",
    dataInicio: "2023-06-25T13:00:00Z",
    dataFim: "2023-06-25T14:30:00Z",
    status: "confirmada",
    observacoes: "Cliente está se mudando de outro estado, esta é sua única oportunidade de visita",
    tipoVisita: "presencial",
    dataCriacao: "2023-06-18T09:15:00Z",
    criadoPor: "corretor1"
  }
];

// Utilities for animations
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

export const staggerChildren = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

export const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMINISTRADOR:
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case UserRole.GERENTE:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case UserRole.SUPERVISOR:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    case UserRole.GERENTE_PRODUTO:
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
    case UserRole.CORRETOR:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case UserRole.FUNCIONARIO:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

export const getStatusUnidade = (status: string): { label: string; color: string } => {
  switch (status) {
    case "disponivel":
      return {
        label: "Disponível",
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      };
    case "reservado":
      return {
        label: "Reservado",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      };
    case "vendido":
      return {
        label: "Vendido",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      };
    default:
      return {
        label: "Desconhecido",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
      };
  }
};

export const getStatusReserva = (status: string): { label: string; color: string } => {
  switch (status) {
    case "confirmada":
      return {
        label: "Confirmada",
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      };
    case "pendente":
      return {
        label: "Pendente",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      };
    case "cancelada":
      return {
        label: "Cancelada",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      };
    default:
      return {
        label: "Desconhecido",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
      };
  }
};

