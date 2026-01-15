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

// Known companies/brands that should be mapped to specific segments
const KNOWN_COMPANIES: Record<string, Segment> = {
  // Fintechs & Financial
  'picpay': 'Mercado Financeiro',
  'pagseguro': 'Mercado Financeiro',
  'pagbank': 'Mercado Financeiro',
  'stone': 'Mercado Financeiro',
  'cielo': 'Mercado Financeiro',
  'getnet': 'Mercado Financeiro',
  'rede': 'Mercado Financeiro',
  'mercadopago': 'Mercado Financeiro',
  'safrapay': 'Mercado Financeiro',
  'creditas': 'Mercado Financeiro',
  'neon': 'Mercado Financeiro',
  'c6bank': 'Mercado Financeiro',
  'original': 'Mercado Financeiro',
  'modal': 'Mercado Financeiro',
  'genial': 'Mercado Financeiro',
  'clear': 'Mercado Financeiro',
  'rico': 'Mercado Financeiro',
  'easynvest': 'Mercado Financeiro',
  'warren': 'Mercado Financeiro',
  'orama': 'Mercado Financeiro',
  'bndes': 'Mercado Financeiro',
  'sicredi': 'Mercado Financeiro',
  'sicoob': 'Mercado Financeiro',
  'cresol': 'Mercado Financeiro',
  'daycoval': 'Mercado Financeiro',
  'pine': 'Mercado Financeiro',
  'abc': 'Mercado Financeiro',
  'votorantim': 'Mercado Financeiro',
  'pan': 'Mercado Financeiro',
  'bmg': 'Mercado Financeiro',
  'banrisul': 'Mercado Financeiro',
  'brb': 'Mercado Financeiro',
  'banestes': 'Mercado Financeiro',
  'banese': 'Mercado Financeiro',
  'banpara': 'Mercado Financeiro',
  'portoseguro': 'Mercado Financeiro',
  'sulamerica': 'Mercado Financeiro',
  'tokio': 'Mercado Financeiro',
  'mapfre': 'Mercado Financeiro',
  'allianz': 'Mercado Financeiro',
  'zurich': 'Mercado Financeiro',
  'axa': 'Mercado Financeiro',
  'chubb': 'Mercado Financeiro',
  'sompo': 'Mercado Financeiro',
  'icatu': 'Mercado Financeiro',
  'mongeral': 'Mercado Financeiro',
  'brasilprev': 'Mercado Financeiro',
  
  // Agro companies
  'bunge': 'Agro/relacionados',
  'cargill': 'Agro/relacionados',
  'adm': 'Agro/relacionados',
  'cofco': 'Agro/relacionados',
  'dreyfus': 'Agro/relacionados',
  'amaggi': 'Agro/relacionados',
  'slc': 'Agro/relacionados',
  'terramaggi': 'Agro/relacionados',
  'brf': 'Agro/relacionados',
  'jbs': 'Agro/relacionados',
  'marfrig': 'Agro/relacionados',
  'minerva': 'Agro/relacionados',
  'aurora': 'Agro/relacionados',
  'seara': 'Agro/relacionados',
  'sadia': 'Agro/relacionados',
  'perdigao': 'Agro/relacionados',
  'friboi': 'Agro/relacionados',
  'cooxupe': 'Agro/relacionados',
  'cocamar': 'Agro/relacionados',
  'coamo': 'Agro/relacionados',
  'lar': 'Agro/relacionados',
  'copacol': 'Agro/relacionados',
  'frimesa': 'Agro/relacionados',
  'castrolanda': 'Agro/relacionados',
  'batavo': 'Agro/relacionados',
  'capal': 'Agro/relacionados',
  'agraria': 'Agro/relacionados',
  'jacto': 'Agro/relacionados',
  'stara': 'Agro/relacionados',
  'massey': 'Agro/relacionados',
  'johndeere': 'Agro/relacionados',
  'deere': 'Agro/relacionados',
  'case': 'Agro/relacionados',
  'valtra': 'Agro/relacionados',
  'newholland': 'Agro/relacionados',
  'kuhn': 'Agro/relacionados',
  'syngenta': 'Agro/relacionados',
  'basf': 'Agro/relacionados',
  'bayer': 'Agro/relacionados',
  'corteva': 'Agro/relacionados',
  'upl': 'Agro/relacionados',
  'fmc': 'Agro/relacionados',
  'yara': 'Agro/relacionados',
  'mosaic': 'Agro/relacionados',
  'heringer': 'Agro/relacionados',
  'fertipar': 'Agro/relacionados',
  'ourofertil': 'Agro/relacionados',
  
  // Varejo major retailers
  'americanas': 'Varejo',
  'casasbahia': 'Varejo',
  'pontofrio': 'Varejo',
  'viavarejo': 'Varejo',
  'magalu': 'Varejo',
  'magazineluiza': 'Varejo',
  'riachuelo': 'Varejo',
  'renner': 'Varejo',
  'cea': 'Varejo',
  'marisa': 'Varejo',
  'havan': 'Varejo',
  'leroy': 'Varejo',
  'leroymerlin': 'Varejo',
  'telhanorte': 'Varejo',
  'centauro': 'Varejo',
  'netshoes': 'Varejo',
  'zattini': 'Varejo',
  'dafiti': 'Varejo',
  'kanui': 'Varejo',
  'tricae': 'Varejo',
  'carrefour': 'Varejo',
  'extra': 'Varejo',
  'paoDeacucar': 'Varejo',
  'gpa': 'Varejo',
  'assai': 'Varejo',
  'atacadao': 'Varejo',
  'makro': 'Varejo',
  'sams': 'Varejo',
  'costco': 'Varejo',
  'bigbom': 'Varejo',
  'condor': 'Varejo',
  'muffato': 'Varejo',
  'supernosso': 'Varejo',
  'prezunic': 'Varejo',
  'savegnago': 'Varejo',
  'sonda': 'Varejo',
  'zaffari': 'Varejo',
  'angeloni': 'Varejo',
  'comepi': 'Varejo',
  'boticario': 'Varejo',
  'natura': 'Varejo',
  'avon': 'Varejo',
  'jequiti': 'Varejo',
  'arezzo': 'Varejo',
  'anacapri': 'Varejo',
  'schutz': 'Varejo',
  'vivara': 'Varejo',
  'hstern': 'Varejo',
  'pandora': 'Varejo',
  
  // Tech companies Brazil
  'totvs': 'Tech/Indústria/Inovação',
  'locaweb': 'Tech/Indústria/Inovação',
  'vtex': 'Tech/Indústria/Inovação',
  'linx': 'Tech/Indústria/Inovação',
  'ciandt': 'Tech/Indústria/Inovação',
  'stefanini': 'Tech/Indústria/Inovação',
  'positivo': 'Tech/Indústria/Inovação',
  'movile': 'Tech/Indústria/Inovação',
  'ifood': 'Tech/Indústria/Inovação',
  'rappi': 'Tech/Indústria/Inovação',
  '99': 'Tech/Indústria/Inovação',
  'loggi': 'Tech/Indústria/Inovação',
  'quinto': 'Tech/Indústria/Inovação',
  'quintoandar': 'Tech/Indústria/Inovação',
  'loft': 'Tech/Indústria/Inovação',
  'ebanx': 'Tech/Indústria/Inovação',
  'madeiramadeira': 'Tech/Indústria/Inovação',
  'olist': 'Tech/Indústria/Inovação',
  'nuvemshop': 'Tech/Indústria/Inovação',
  'rdstation': 'Tech/Indústria/Inovação',
  'resultados': 'Tech/Indústria/Inovação',
  'hotmart': 'Tech/Indústria/Inovação',
  'tractian': 'Tech/Indústria/Inovação',
  'cloudwalk': 'Tech/Indústria/Inovação',
  'sallve': 'Tech/Indústria/Inovação',
  'gympass': 'Tech/Indústria/Inovação',
  'wellhub': 'Tech/Indústria/Inovação',
  'nuuvem': 'Tech/Indústria/Inovação',
  'pipefy': 'Tech/Indústria/Inovação',
  'involves': 'Tech/Indústria/Inovação',
  'weg': 'Tech/Indústria/Inovação',
  'embraer': 'Tech/Indústria/Inovação',
  'gerdau': 'Tech/Indústria/Inovação',
  'csn': 'Tech/Indústria/Inovação',
  'usiminas': 'Tech/Indústria/Inovação',
  'tupy': 'Tech/Indústria/Inovação',
  'randon': 'Tech/Indústria/Inovação',
  'iochpe': 'Tech/Indústria/Inovação',
  'marcopolo': 'Tech/Indústria/Inovação',
  'tramontina': 'Tech/Indústria/Inovação',
  'schulz': 'Tech/Indústria/Inovação',
  'romi': 'Tech/Indústria/Inovação',
  'embraco': 'Tech/Indústria/Inovação',
};

const DOMAIN_SEGMENT_MAP: Record<string, Segment> = {
  // Financial keywords
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
  'fintech': 'Mercado Financeiro',
  'pag': 'Mercado Financeiro',
  'pay': 'Mercado Financeiro',
  'credit': 'Mercado Financeiro',
  'credito': 'Mercado Financeiro',
  'emprestimo': 'Mercado Financeiro',
  'financeira': 'Mercado Financeiro',
  'asset': 'Mercado Financeiro',
  'gestora': 'Mercado Financeiro',
  'fundo': 'Mercado Financeiro',
  'previdencia': 'Mercado Financeiro',
  'consorcio': 'Mercado Financeiro',
  'factoring': 'Mercado Financeiro',
  
  // Agro keywords
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
  'gado': 'Agro/relacionados',
  'bovino': 'Agro/relacionados',
  'suino': 'Agro/relacionados',
  'frango': 'Agro/relacionados',
  'avicola': 'Agro/relacionados',
  'fertil': 'Agro/relacionados',
  'sementes': 'Agro/relacionados',
  'graos': 'Agro/relacionados',
  'laticinio': 'Agro/relacionados',
  'laticinios': 'Agro/relacionados',
  'frigorifico': 'Agro/relacionados',
  'alimentos': 'Agro/relacionados',
  'safra': 'Agro/relacionados',
  'colheita': 'Agro/relacionados',
  'plantio': 'Agro/relacionados',
  'irrigacao': 'Agro/relacionados',
  'trator': 'Agro/relacionados',
  'maquinas': 'Agro/relacionados',
  
  // Varejo keywords
  'loja': 'Varejo',
  'lojas': 'Varejo',
  'store': 'Varejo',
  'shop': 'Varejo',
  'shopping': 'Varejo',
  'magazine': 'Varejo',
  'mercado': 'Varejo',
  'supermercado': 'Varejo',
  'atacado': 'Varejo',
  'varejo': 'Varejo',
  'retail': 'Varejo',
  'comercio': 'Varejo',
  'ecommerce': 'Varejo',
  'moda': 'Varejo',
  'vestuario': 'Varejo',
  'calcados': 'Varejo',
  'cosmeticos': 'Varejo',
  'perfumaria': 'Varejo',
  'joias': 'Varejo',
  'otica': 'Varejo',
  'moveis': 'Varejo',
  'eletro': 'Varejo',
  'eletronico': 'Varejo',
  
  // Tech keywords
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
  'app': 'Tech/Indústria/Inovação',
  'cyber': 'Tech/Indústria/Inovação',
  'ai': 'Tech/Indústria/Inovação',
  'machine': 'Tech/Indústria/Inovação',
  'automation': 'Tech/Indústria/Inovação',
  'automacao': 'Tech/Indústria/Inovação',
  'robotica': 'Tech/Indústria/Inovação',
  'iot': 'Tech/Indústria/Inovação',
  'saas': 'Tech/Indústria/Inovação',
  'plataforma': 'Tech/Indústria/Inovação',
  'solucoes': 'Tech/Indústria/Inovação',
  'metalurgica': 'Tech/Indústria/Inovação',
  'siderurgica': 'Tech/Indústria/Inovação',
  'fabrica': 'Tech/Indústria/Inovação',
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
  const domainName = domain.split('.')[0] || '';
  
  // First, check for known companies (exact or contains match)
  for (const [company, segment] of Object.entries(KNOWN_COMPANIES)) {
    if (domainName.includes(company) || domain.includes(company)) {
      return segment;
    }
  }
  
  // Then check for keyword patterns
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
  mensagensEnviadas: ['mensagens enviadas', 'mensagens_enviadas', 'enviadas', 'emails enviados', 'emails_enviados'],
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

  // All columns are optional - parse whatever is available

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
