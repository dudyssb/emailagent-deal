import { EmailContact, ValidationError, Segment, ProcessingResult, CampaignMetrics } from '@/types/email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_SEGMENTS: Segment[] = [
  'Mercado Financeiro',
  'Agro/relacionados',
  'Varejo',
  'Tech/Indústria/Inovação',
  'Outros',
];

export interface MetricsProcessingResult {
  metrics: CampaignMetrics[];
  errors: ValidationError[];
}

const DOMAIN_SEGMENT_MAP: Record<string, Segment> = {
  // Financial
  'itau': 'Mercado Financeiro',
  'bradesco': 'Mercado Financeiro',
  'santander': 'Mercado Financeiro',
  'bb.com': 'Mercado Financeiro',
  'caixa': 'Mercado Financeiro',
  'btg': 'Mercado Financeiro',
  'xp.com': 'Mercado Financeiro',
  'nubank': 'Mercado Financeiro',
  'inter': 'Mercado Financeiro',
  'banco': 'Mercado Financeiro',
  'finance': 'Mercado Financeiro',
  'invest': 'Mercado Financeiro',
  'capital': 'Mercado Financeiro',
  'corretora': 'Mercado Financeiro',
  'seguro': 'Mercado Financeiro',
  
  // Agro
  'agro': 'Agro/relacionados',
  'fazenda': 'Agro/relacionados',
  'rural': 'Agro/relacionados',
  'agricola': 'Agro/relacionados',
  'soja': 'Agro/relacionados',
  'milho': 'Agro/relacionados',
  'cafe': 'Agro/relacionados',
  'pecuaria': 'Agro/relacionados',
  'coop': 'Agro/relacionados',
  'granja': 'Agro/relacionados',
  
  // Varejo
  'loja': 'Varejo',
  'store': 'Varejo',
  'shop': 'Varejo',
  'magazine': 'Varejo',
  'mercado': 'Varejo',
  'supermercado': 'Varejo',
  'atacado': 'Varejo',
  'varejo': 'Varejo',
  'retail': 'Varejo',
  'comercio': 'Varejo',
  
  // Tech
  'tech': 'Tech/Indústria/Inovação',
  'tecnologia': 'Tech/Indústria/Inovação',
  'software': 'Tech/Indústria/Inovação',
  'sistemas': 'Tech/Indústria/Inovação',
  'digital': 'Tech/Indústria/Inovação',
  'cloud': 'Tech/Indústria/Inovação',
  'data': 'Tech/Indústria/Inovação',
  'labs': 'Tech/Indústria/Inovação',
  'dev': 'Tech/Indústria/Inovação',
  'io': 'Tech/Indústria/Inovação',
  'industria': 'Tech/Indústria/Inovação',
  'manufacturing': 'Tech/Indústria/Inovação',
  'inovacao': 'Tech/Indústria/Inovação',
  'startup': 'Tech/Indústria/Inovação',
};

// Mapping keywords in "nome interno" to segments
const NOME_INTERNO_SEGMENT_MAP: Record<string, Segment> = {
  // Financial
  'financeiro': 'Mercado Financeiro',
  'financeiras': 'Mercado Financeiro',
  'banco': 'Mercado Financeiro',
  'bancos': 'Mercado Financeiro',
  'finance': 'Mercado Financeiro',
  'fintech': 'Mercado Financeiro',
  'investimento': 'Mercado Financeiro',
  'investimentos': 'Mercado Financeiro',
  'seguro': 'Mercado Financeiro',
  'seguros': 'Mercado Financeiro',
  'corretora': 'Mercado Financeiro',
  'corretoras': 'Mercado Financeiro',
  
  // Agro
  'agro': 'Agro/relacionados',
  'agronegocio': 'Agro/relacionados',
  'agronegócio': 'Agro/relacionados',
  'agricola': 'Agro/relacionados',
  'agrícola': 'Agro/relacionados',
  'rural': 'Agro/relacionados',
  'fazenda': 'Agro/relacionados',
  'fazendas': 'Agro/relacionados',
  'pecuaria': 'Agro/relacionados',
  'pecuária': 'Agro/relacionados',
  'cooperativa': 'Agro/relacionados',
  'cooperativas': 'Agro/relacionados',
  
  // Varejo
  'varejo': 'Varejo',
  'retail': 'Varejo',
  'loja': 'Varejo',
  'lojas': 'Varejo',
  'comercio': 'Varejo',
  'comércio': 'Varejo',
  'ecommerce': 'Varejo',
  'e-commerce': 'Varejo',
  'atacado': 'Varejo',
  'supermercado': 'Varejo',
  'supermercados': 'Varejo',
  'magazine': 'Varejo',
  
  // Tech
  'tech': 'Tech/Indústria/Inovação',
  'tecnologia': 'Tech/Indústria/Inovação',
  'software': 'Tech/Indústria/Inovação',
  'saas': 'Tech/Indústria/Inovação',
  'industria': 'Tech/Indústria/Inovação',
  'indústria': 'Tech/Indústria/Inovação',
  'industrial': 'Tech/Indústria/Inovação',
  'inovacao': 'Tech/Indústria/Inovação',
  'inovação': 'Tech/Indústria/Inovação',
  'startup': 'Tech/Indústria/Inovação',
  'startups': 'Tech/Indústria/Inovação',
  'ti': 'Tech/Indústria/Inovação',
  'digital': 'Tech/Indústria/Inovação',
  'manufacturing': 'Tech/Indústria/Inovação',
  'manufatura': 'Tech/Indústria/Inovação',
};

export function categorizeByDomain(email: string): Segment {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  
  for (const [keyword, segment] of Object.entries(DOMAIN_SEGMENT_MAP)) {
    if (domain.includes(keyword)) {
      return segment;
    }
  }
  
  return 'Outros';
}

export function categorizeByNomeInterno(nomeInterno: string): Segment {
  const normalized = nomeInterno.toLowerCase();
  
  for (const [keyword, segment] of Object.entries(NOME_INTERNO_SEGMENT_MAP)) {
    if (normalized.includes(keyword)) {
      return segment;
    }
  }
  
  return 'Outros';
}

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function parseCSV(csvContent: string): ProcessingResult {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const contacts: EmailContact[] = [];
  const errors: ValidationError[] = [];
  const segmentCounts: Record<Segment, number> = {
    'Mercado Financeiro': 0,
    'Agro/relacionados': 0,
    'Varejo': 0,
    'Tech/Indústria/Inovação': 0,
    'Outros': 0,
  };

  if (lines.length === 0) {
    errors.push({
      linha_afetada: 0,
      campo: 'arquivo',
      mensagem_erro: 'Arquivo CSV vazio ou inválido.',
    });
    return { contacts, errors, segmentCounts };
  }

  // Parse header
  const header = lines[0].split(/[,;]/).map(h => h.trim().toLowerCase().replace(/"/g, ''));
  const nomeIndex = header.findIndex(h => h === 'nome');
  const emailIndex = header.findIndex(h => h === 'email');

  if (nomeIndex === -1 || emailIndex === -1) {
    errors.push({
      linha_afetada: 1,
      campo: 'cabeçalho',
      mensagem_erro: `Colunas obrigatórias não encontradas. Esperado: 'nome' e 'email'. Encontrado: ${header.join(', ')}`,
    });
    return { contacts, errors, segmentCounts };
  }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = line.split(/[,;]/).map(v => v.trim().replace(/"/g, ''));
    
    const nome = values[nomeIndex]?.trim();
    const email = values[emailIndex]?.trim();

    if (!nome) {
      errors.push({
        linha_afetada: i + 1,
        campo: 'nome',
        mensagem_erro: 'Nome não informado.',
      });
      continue;
    }

    if (!email) {
      errors.push({
        linha_afetada: i + 1,
        campo: 'email',
        mensagem_erro: 'E-mail não informado.',
      });
      continue;
    }

    if (!validateEmail(email)) {
      errors.push({
        linha_afetada: i + 1,
        campo: 'email',
        mensagem_erro: `Endereço de e-mail inválido: ${email}`,
      });
      continue;
    }

    const segmento = categorizeByDomain(email);
    segmentCounts[segmento]++;

    contacts.push({
      nome,
      email,
      segmento,
      site: `https://${email.split('@')[1]}`,
    });
  }

  return { contacts, errors, segmentCounts };
}

export function exportToCSV(contacts: EmailContact[]): string {
  const headers = [
    'Segmento',
    'Site',
    'Tamanho da empresa em funcionários',
    'Últimas movimentações da empresa no mercado',
    'Últimas movimentações de C-level',
    'Quantos funcionários de TI a empresa tem',
    'Cargo do lead',
    'Nome',
    'Email'
  ];

  const rows = contacts.map(contact => [
    contact.segmento || '',
    contact.site || '',
    contact.tamanhoEmpresa?.toString() || '',
    contact.ultimasMovimentacoes || '',
    contact.movimentacoesCLevel || '',
    contact.funcionariosTI?.toString() || '',
    contact.cargoLead || '',
    contact.nome,
    contact.email
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
}

// E-goi CSV columns mapping
const EGOI_COLUMNS = {
  id: ['id'],
  lista: ['lista'],
  assunto: ['assunto'],
  nomeInterno: ['nome interno', 'nome_interno', 'nomeinterno'],
  data: ['data'],
  mensagensEnviadas: ['mensagens enviadas', 'mensagens_enviadas', 'enviadas'],
  aberturas: ['aberturas'],
  aberturasUnicas: ['aberturas únicas', 'aberturas unicas', 'aberturas_unicas'],
  hardBounces: ['hard bounces', 'hard_bounces', 'hardbounces'],
  softBounces: ['soft bounces', 'soft_bounces', 'softbounces'],
  cliques: ['cliques'],
  cliquesUnicos: ['cliques únicos', 'cliques unicos', 'cliques_unicos'],
};

function findColumnIndex(header: string[], aliases: string[]): number {
  for (const alias of aliases) {
    const index = header.findIndex(h => h === alias);
    if (index !== -1) return index;
  }
  return -1;
}

export function parseMetricsCSV(csvContent: string): MetricsProcessingResult {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const metrics: CampaignMetrics[] = [];
  const errors: ValidationError[] = [];

  if (lines.length === 0) {
    errors.push({
      linha_afetada: 0,
      campo: 'arquivo',
      mensagem_erro: 'Arquivo CSV vazio ou inválido.',
    });
    return { metrics, errors };
  }

  // Parse header - normalize to lowercase
  const header = lines[0].split(/[,;]/).map(h => h.trim().toLowerCase().replace(/"/g, ''));
  
  // Find column indices
  const idIndex = findColumnIndex(header, EGOI_COLUMNS.id);
  const listaIndex = findColumnIndex(header, EGOI_COLUMNS.lista);
  const assuntoIndex = findColumnIndex(header, EGOI_COLUMNS.assunto);
  const nomeInternoIndex = findColumnIndex(header, EGOI_COLUMNS.nomeInterno);
  const dataIndex = findColumnIndex(header, EGOI_COLUMNS.data);
  const mensagensEnviadasIndex = findColumnIndex(header, EGOI_COLUMNS.mensagensEnviadas);
  const aberturasIndex = findColumnIndex(header, EGOI_COLUMNS.aberturas);
  const aberturasUnicasIndex = findColumnIndex(header, EGOI_COLUMNS.aberturasUnicas);
  const hardBouncesIndex = findColumnIndex(header, EGOI_COLUMNS.hardBounces);
  const softBouncesIndex = findColumnIndex(header, EGOI_COLUMNS.softBounces);
  const cliquesIndex = findColumnIndex(header, EGOI_COLUMNS.cliques);
  const cliquesUnicosIndex = findColumnIndex(header, EGOI_COLUMNS.cliquesUnicos);

  // Check required columns
  const missingColumns: string[] = [];
  if (idIndex === -1) missingColumns.push('id');
  if (listaIndex === -1) missingColumns.push('lista');
  if (assuntoIndex === -1) missingColumns.push('assunto');
  if (nomeInternoIndex === -1) missingColumns.push('nome interno');
  if (dataIndex === -1) missingColumns.push('data');
  if (mensagensEnviadasIndex === -1) missingColumns.push('mensagens enviadas');
  if (aberturasIndex === -1) missingColumns.push('aberturas');
  if (aberturasUnicasIndex === -1) missingColumns.push('aberturas únicas');
  if (hardBouncesIndex === -1) missingColumns.push('hard bounces');
  if (softBouncesIndex === -1) missingColumns.push('soft bounces');
  if (cliquesIndex === -1) missingColumns.push('cliques');
  if (cliquesUnicosIndex === -1) missingColumns.push('cliques únicos');

  if (missingColumns.length > 0) {
    errors.push({
      linha_afetada: 1,
      campo: 'cabeçalho',
      mensagem_erro: `Colunas não encontradas: ${missingColumns.join(', ')}. Colunas do arquivo: ${header.join(', ')}`,
    });
    return { metrics, errors };
  }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = line.split(/[,;]/).map(v => v.trim().replace(/"/g, ''));
    
    const id = values[idIndex]?.trim() || '';
    const lista = values[listaIndex]?.trim() || '';
    const assunto = values[assuntoIndex]?.trim() || '';
    const nomeInterno = values[nomeInternoIndex]?.trim() || '';
    const data = values[dataIndex]?.trim() || '';
    const mensagensEnviadasRaw = values[mensagensEnviadasIndex]?.trim() || '0';
    const aberturasRaw = values[aberturasIndex]?.trim() || '0';
    const aberturasUnicasRaw = values[aberturasUnicasIndex]?.trim() || '0';
    const hardBouncesRaw = values[hardBouncesIndex]?.trim() || '0';
    const softBouncesRaw = values[softBouncesIndex]?.trim() || '0';
    const cliquesRaw = values[cliquesIndex]?.trim() || '0';
    const cliquesUnicosRaw = values[cliquesUnicosIndex]?.trim() || '0';

    // Parse numeric values
    const mensagensEnviadas = parseInt(mensagensEnviadasRaw.replace(/[^\d]/g, ''), 10) || 0;
    const aberturas = parseInt(aberturasRaw.replace(/[^\d]/g, ''), 10) || 0;
    const aberturasUnicas = parseInt(aberturasUnicasRaw.replace(/[^\d]/g, ''), 10) || 0;
    const hardBounces = parseInt(hardBouncesRaw.replace(/[^\d]/g, ''), 10) || 0;
    const softBounces = parseInt(softBouncesRaw.replace(/[^\d]/g, ''), 10) || 0;
    const cliques = parseInt(cliquesRaw.replace(/[^\d]/g, ''), 10) || 0;
    const cliquesUnicos = parseInt(cliquesUnicosRaw.replace(/[^\d]/g, ''), 10) || 0;

    // Calculate rates
    const totalBounces = hardBounces + softBounces;
    const entregues = mensagensEnviadas - totalBounces;
    const taxaEntrega = mensagensEnviadas > 0 ? (entregues / mensagensEnviadas) * 100 : 0;
    const taxaAbertura = entregues > 0 ? (aberturasUnicas / entregues) * 100 : 0;
    const taxaCliques = entregues > 0 ? (cliquesUnicos / entregues) * 100 : 0;

    // Categorize segment from nome interno
    const segmento = categorizeByNomeInterno(nomeInterno);

    metrics.push({
      id,
      lista,
      assunto,
      nomeInterno,
      data,
      segmento,
      mensagensEnviadas,
      aberturas,
      aberturasUnicas,
      hardBounces,
      softBounces,
      cliques,
      cliquesUnicos,
      taxaEntrega,
      taxaAbertura,
      taxaCliques,
      totalBounces,
    });
  }

  return { metrics, errors };
}
