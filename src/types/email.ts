export type Segment = 
  | 'Mercado Financeiro' 
  | 'Agro/relacionados' 
  | 'Varejo' 
  | 'Tech/Indústria/Inovação' 
  | 'Outros';

export interface EmailContact {
  nome: string;
  email: string;
  segmento?: Segment;
  site?: string;
  tamanhoEmpresa?: number;
  ultimasMovimentacoes?: string;
  movimentacoesCLevel?: string;
  funcionariosTI?: number;
  cargoLead?: string;
}

export interface ValidationError {
  linha_afetada: number;
  campo: string;
  mensagem_erro: string;
}

export interface CampaignMetrics {
  segmento: Segment;
  taxa_entrega: number;
  taxa_abertura: number;
  taxa_cliques: number;
  bounces: number;
}

export interface ProcessingResult {
  contacts: EmailContact[];
  errors: ValidationError[];
  segmentCounts: Record<Segment, number>;
}

export interface NurturingEmail {
  id: string;
  subject: string;
  htmlContent: string;
  targetContact: EmailContact;
  sequence: number;
}
