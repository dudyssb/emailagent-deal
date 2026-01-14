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
  id: string;
  lista: string;
  assunto: string;
  nomeInterno: string;
  data: string;
  segmento: Segment;
  mensagensEnviadas: number;
  aberturas: number;
  aberturasUnicas: number;
  hardBounces: number;
  softBounces: number;
  cliques: number;
  cliquesUnicos: number;
  // Calculated rates
  taxaEntrega: number;
  taxaAbertura: number;
  taxaCliques: number;
  totalBounces: number;
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
