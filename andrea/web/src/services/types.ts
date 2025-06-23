export interface Lead {
    id: number;
    empresa: string;
    representante: string;
    cnpj: string;
    localizacao: string;
    email: string;
    status: 'Ativo' | 'Inativo';
    statusColor: string;
    borderColor: string;
    razaoSocial: string;
    servicosProdutos: string;
    localContato: string;
    areaAtuacao: string;
    meioContato: string;
    telefoneContato: string;
    tarefas: { id: number; descricao: string; data: string }[];
  }
  
  export interface Task {
    id: number;
    leadId?: number;
    proposta: string;
    status: 'Em progresso' | 'Cancelado' | 'Concluído';
    statusColor: string;
    borderColor: string;
    empresa: string;
    representante: string;
    meioEncontro: string;
    ambiente: string;
    localizacao: string;
    data: string;
    avatar: string;
    descricao?: string; 
  }
  
  
  export interface TaskNotification {
    id: string;
    type: "added" | "edited" | "cancelled";
    description: string;
    timestamp: string;
  }
  