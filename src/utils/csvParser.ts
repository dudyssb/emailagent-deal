import { EmailContact, ValidationError, Segment, ProcessingResult, CampaignMetrics, createEmptySegmentCounts } from '@/types/email';
import { 
  categorizeByDomainEnhanced, 
  categorizeByNomeInternoEnhanced 
} from './segmentationKeywords';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_SEGMENTS: Segment[] = [
  'Mercado Financeiro',
  'Agro/relacionados',
  'Varejo',
  'Atacado',
  'Tech/Inovação',
  'Indústria',
  'Educação',
  'Saúde',
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
  'totvs': 'Tech/Inovação',
  'locaweb': 'Tech/Inovação',
  'vtex': 'Tech/Inovação',
  'linx': 'Tech/Inovação',
  'ciandt': 'Tech/Inovação',
  'stefanini': 'Tech/Inovação',
  'positivo': 'Tech/Inovação',
  'movile': 'Tech/Inovação',
  'ifood': 'Tech/Inovação',
  'rappi': 'Tech/Inovação',
  '99': 'Tech/Inovação',
  'loggi': 'Tech/Inovação',
  'quinto': 'Tech/Inovação',
  'quintoandar': 'Tech/Inovação',
  'loft': 'Tech/Inovação',
  'ebanx': 'Tech/Inovação',
  'madeiramadeira': 'Tech/Inovação',
  'olist': 'Tech/Inovação',
  'nuvemshop': 'Tech/Inovação',
  'rdstation': 'Tech/Inovação',
  'resultados': 'Tech/Inovação',
  'hotmart': 'Tech/Inovação',
  'tractian': 'Tech/Inovação',
  'cloudwalk': 'Tech/Inovação',
  'sallve': 'Tech/Inovação',
  'gympass': 'Tech/Inovação',
  'wellhub': 'Tech/Inovação',
  'nuuvem': 'Tech/Inovação',
  'pipefy': 'Tech/Inovação',
  'involves': 'Tech/Inovação',
  
  // Indústria
  'weg': 'Indústria',
  'embraer': 'Indústria',
  'gerdau': 'Indústria',
  'csn': 'Indústria',
  'usiminas': 'Indústria',
  'tupy': 'Indústria',
  'randon': 'Indústria',
  'iochpe': 'Indústria',
  'marcopolo': 'Indústria',
  'tramontina': 'Indústria',
  'schulz': 'Indústria',
  'romi': 'Indústria',
  'embraco': 'Indústria',
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
  
  // Atacado keywords
  'atacado': 'Atacado',
  'atacadista': 'Atacado',
  'distribuidor': 'Atacado',
  'distribuidora': 'Atacado',
  'wholesale': 'Atacado',
  'atacarejo': 'Atacado',
  
  // Tech keywords
  'tech': 'Tech/Inovação',
  'tecnologia': 'Tech/Inovação',
  'software': 'Tech/Inovação',
  'sistemas': 'Tech/Inovação',
  'digital': 'Tech/Inovação',
  'cloud': 'Tech/Inovação',
  'data': 'Tech/Inovação',
  'labs': 'Tech/Inovação',
  'dev': 'Tech/Inovação',
  'io': 'Tech/Inovação',
  'inovacao': 'Tech/Inovação',
  'startup': 'Tech/Inovação',
  'app': 'Tech/Inovação',
  'cyber': 'Tech/Inovação',
  'ai': 'Tech/Inovação',
  'machine': 'Tech/Inovação',
  'saas': 'Tech/Inovação',
  'plataforma': 'Tech/Inovação',
  'solucoes': 'Tech/Inovação',
  
  // Indústria keywords
  'industria': 'Indústria',
  'manufacturing': 'Indústria',
  'automation': 'Indústria',
  'automacao': 'Indústria',
  'robotica': 'Indústria',
  'iot': 'Indústria',
  'metalurgica': 'Indústria',
  'siderurgica': 'Indústria',
  'fabrica': 'Indústria',

  // Saúde keywords
  'saude': 'Saúde',
  'hospital': 'Saúde',
  'clinica': 'Saúde',
  'medico': 'Saúde',
  'medicina': 'Saúde',
  'farmacia': 'Saúde',
  'pharma': 'Saúde',
  'healthtech': 'Saúde',
  'odonto': 'Saúde',
  'dental': 'Saúde',
  'laboratorio': 'Saúde',
  'diagnostico': 'Saúde',
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
  'supermercado': 'Varejo',
  'supermercados': 'Varejo',
  'magazine': 'Varejo',
  
  // Atacado
  'atacado': 'Atacado',
  'atacadista': 'Atacado',
  'distribuidor': 'Atacado',
  'distribuidora': 'Atacado',
  'wholesale': 'Atacado',
  'atacarejo': 'Atacado',
  
  // Educação
  'educação': 'Educação',
  'educacao': 'Educação',
  'ensino': 'Educação',
  'escola': 'Educação',
  'universidade': 'Educação',
  'faculdade': 'Educação',
  'edtech': 'Educação',
  'curso': 'Educação',
  'cursos': 'Educação',
  'treinamento': 'Educação',
  'treinamentos': 'Educação',
  
  // Tech
  'tech': 'Tech/Inovação',
  'tecnologia': 'Tech/Inovação',
  'software': 'Tech/Inovação',
  'saas': 'Tech/Inovação',
  'inovacao': 'Tech/Inovação',
  'inovação': 'Tech/Inovação',
  'startup': 'Tech/Inovação',
  'startups': 'Tech/Inovação',
  'ti': 'Tech/Inovação',
  'digital': 'Tech/Inovação',
  
  // Indústria
  'industria': 'Indústria',
  'indústria': 'Indústria',
  'industrial': 'Indústria',
  'manufacturing': 'Indústria',
  'manufatura': 'Indústria',

  // Saúde
  'saúde': 'Saúde',
  'saude': 'Saúde',
  'hospital': 'Saúde',
  'clinica': 'Saúde',
  'clínica': 'Saúde',
  'médico': 'Saúde',
  'medico': 'Saúde',
  'farmácia': 'Saúde',
  'farmacia': 'Saúde',
  'odonto': 'Saúde',
  'odontologia': 'Saúde',
  'healthtech': 'Saúde',
  'laboratorio': 'Saúde',
  'laboratório': 'Saúde',
};

// Usa a nova função aprimorada de segmentação
export function categorizeByDomain(email: string): Segment {
  return categorizeByDomainEnhanced(email);
}

// Usa a nova função aprimorada de segmentação por nome interno
export function categorizeByNomeInterno(nomeInterno: string): Segment {
  return categorizeByNomeInternoEnhanced(nomeInterno);
}

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function parseCSV(csvContent: string): ProcessingResult {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const contacts: EmailContact[] = [];
  const errors: ValidationError[] = [];
  const segmentCounts: Record<Segment, number> = createEmptySegmentCounts();

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

    // Calculate rates according to user's specifications:
    // Taxa de Entrega = Entregues / Enviados
    // Taxa de Abertura = Aberturas Únicas / Entregues
    // Taxa de Cliques = Cliques Únicos / Aberturas Únicas
    const totalBounces = hardBounces + softBounces;
    const enviados = mensagensEnviadas;
    const entregues = mensagensEnviadas - totalBounces;
    const remocoes = 0; // Not available in CSV export typically
    
    const taxaEntrega = enviados > 0 ? (entregues / enviados) * 100 : 0;
    const taxaAbertura = entregues > 0 ? (aberturasUnicas / entregues) * 100 : 0;
    const taxaCliques = aberturasUnicas > 0 ? (cliquesUnicos / aberturasUnicas) * 100 : 0;
    const taxaSaida = entregues > 0 ? (remocoes / entregues) * 100 : 0;
    const taxaBounce = entregues > 0 ? (totalBounces / entregues) * 100 : 0;

    // Categorize segment from nome interno
    const segmento = categorizeByNomeInterno(nomeInterno);

    metrics.push({
      id,
      lista,
      assunto,
      nomeInterno,
      data,
      segmento,
      // Raw counts
      enviados,
      entregues,
      aberturasUnicas,
      cliquesUnicos,
      remocoes,
      bounces: totalBounces,
      // Legacy fields
      mensagensEnviadas,
      aberturas,
      hardBounces,
      softBounces,
      cliques,
      // Calculated rates
      taxaEntrega,
      taxaAbertura,
      taxaCliques,
      taxaSaida,
      taxaBounce,
      totalBounces,
    });
  }

  return { metrics, errors };
}
