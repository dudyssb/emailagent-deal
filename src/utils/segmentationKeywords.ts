import { Segment } from '@/types/email';

/**
 * Keywords de segmentação aprimoradas
 * Organizadas por categoria para facilitar manutenção
 */

// 🛍️ VAREJO - Palavras-chave
export const VAREJO_KEYWORDS: string[] = [
  'loja', 'lojas', 'e-commerce', 'ecommerce', 'varejo', 'retail',
  'consumidor final', 'ponto de venda', 'pdv', 'mix de produtos',
  'estoque', 'vitrine', 'promoção', 'ofertas', 'catálogo',
  'carrinho', 'checkout', 'frete', 'entrega',
  'experiência de compra', 'jornada do cliente', 'omnichannel',
  'marketplace', 'sell-out', 'trade marketing', 'giro de estoque',
  'store', 'shop', 'shopping', 'magazine', 'mercado', 'supermercado',
  'atacado', 'comercio', 'moda', 'vestuario', 'calcados', 'cosmeticos',
  'perfumaria', 'joias', 'otica', 'moveis', 'eletro', 'eletronico',
  'loja online', 'compre agora', 'comprar online',
];

// 💰 MERCADO FINANCEIRO - Palavras-chave
export const FINANCEIRO_KEYWORDS: string[] = [
  'investimentos', 'ativos financeiros', 'renda fixa', 'renda variável',
  'fundos', 'fundos de investimento', 'carteira', 'portfólio',
  'gestão de recursos', 'wealth management', 'asset management',
  'corretora', 'banco', 'banco digital', 'crédito', 'empréstimo',
  'financiamento', 'câmbio',
  'liquidez', 'rentabilidade', 'risco', 'perfil de risco',
  'derivativos', 'ações', 'bolsa', 'b3', 'compliance financeiro',
  'regulação', 'bacen', 'cvm',
  'finance', 'invest', 'capital', 'seguro', 'fintech', 'pag', 'pay',
  'credit', 'credito', 'emprestimo', 'financeira', 'asset', 'gestora',
  'fundo', 'previdencia', 'consorcio', 'factoring',
  'plataforma de investimentos', 'conta digital', 'open banking',
  'open finance', 'pix', 'ted', 'doc', 'boleto',
];

// 🌾 AGRO - Palavras-chave
export const AGRO_KEYWORDS: string[] = [
  'agronegócio', 'agronegocio', 'produtor rural', 'fazenda', 'safra',
  'plantio', 'colheita', 'lavoura', 'pecuária', 'pecuaria',
  'gado', 'bovino', 'suíno', 'suino', 'aves', 'agricultura de precisão',
  'fertilizantes', 'defensivos agrícolas', 'defensivos agricolas',
  'sementes', 'nutrição animal', 'nutricao animal',
  'maquinário agrícola', 'maquinario agricola', 'implementos',
  'irrigação', 'irrigacao', 'silagem', 'armazenagem de grãos',
  'armazenagem de graos',
  'agro', 'rural', 'agricola', 'soja', 'milho', 'cafe', 'coop',
  'granja', 'frango', 'avicola', 'fertil', 'graos', 'laticinio',
  'laticinios', 'frigorifico', 'alimentos', 'trator', 'maquinas',
  'soluções para o produtor rural', 'gestão rural', 'crédito rural',
];

// 💻 TECH / INOVAÇÃO - Palavras-chave
export const TECH_INOVACAO_KEYWORDS: string[] = [
  'software', 'plataforma', 'saas', 'sistema', 'sistemas',
  'tecnologia proprietária', 'tecnologia proprietaria',
  'inteligência artificial', 'inteligencia artificial', 'dados', 'data',
  'nuvem', 'cloud', 'api', 'integração', 'integracao',
  'cibersegurança', 'ciberseguranca', 'transformação digital',
  'transformacao digital', 'inovação tecnológica', 'inovacao tecnologica',
  'tech', 'tecnologia', 'digital', 'labs', 'dev', 'io',
  'inovacao', 'startup', 'app', 'cyber', 'ai', 'machine',
  'solucoes',
];

// 🏭 INDÚSTRIA - Palavras-chave
export const INDUSTRIA_KEYWORDS: string[] = [
  'manufatura', 'produção industrial', 'producao industrial',
  'linha de produção', 'linha de producao', 'automação industrial',
  'automacao industrial', 'engenharia', 'equipamentos industriais',
  'manutenção industrial', 'manutencao industrial',
  'eficiência operacional', 'eficiencia operacional',
  'controle de qualidade', 'cadeia de suprimentos', 'supply chain',
  'industria', 'manufacturing', 'automation', 'automacao', 'robotica',
  'iot', 'metalurgica', 'siderurgica', 'fabrica',
  'indústria 4.0', 'industria 4.0', 'smart factory',
];

// 📦 OUTROS - Palavras-chave
export const OUTROS_KEYWORDS: string[] = [
  'consultoria', 'serviços especializados', 'servicos especializados',
  'soluções personalizadas', 'solucoes personalizadas', 'assessoria',
  'ong', 'instituto', 'fundação', 'fundacao',
  'eventos', 'produção de eventos', 'producao de eventos',
  'marketing', 'publicidade', 'comunicação', 'comunicacao',
  'design', 'estúdio criativo', 'estudio criativo',
  'turismo', 'hotelaria',
];

// 📦 ATACADO - Palavras-chave
export const ATACADO_KEYWORDS: string[] = [
  'atacado', 'atacadista', 'distribuidor', 'distribuidora', 'distribuição',
  'wholesale', 'cash and carry', 'cash & carry',
  'atacarejo', 'centro de distribuição', 'cd',
  'logística', 'armazém', 'armazenagem', 'depósito',
  'fornecedor', 'abastecimento', 'revenda', 'revendedor',
  'grande volume', 'compra em quantidade', 'frete', 'transporte',
  'makro', 'assai', 'atacadao', 'maxxi',
];

// 🎓 EDUCAÇÃO - Palavras-chave
export const EDUCACAO_KEYWORDS: string[] = [
  'educação', 'educacao', 'ensino', 'escola', 'universidade',
  'faculdade', 'curso', 'cursos', 'treinamento', 'treinamentos',
  'edtech', 'ead', 'e-learning', 'aprendizado', 'aprendizagem',
  'professor', 'aluno', 'estudante', 'acadêmico', 'academico',
  'pedagógico', 'pedagogico', 'didático', 'didatico',
  'graduação', 'graduacao', 'pós-graduação', 'pos-graduacao',
  'mba', 'mestrado', 'doutorado', 'pesquisa',
  'plataforma educacional', 'lms', 'gestão escolar',
  'vestibular', 'enem', 'certificação', 'capacitação',
];

// 🏥 SAÚDE - Palavras-chave
export const SAUDE_KEYWORDS: string[] = [
  'saúde', 'saude', 'hospital', 'hospitalar', 'clínica', 'clinica',
  'médico', 'medico', 'medicina', 'farmácia', 'farmacia', 'pharma',
  'healthtech', 'health tech', 'odontologia', 'odonto', 'dental',
  'laboratório', 'laboratorio', 'diagnóstico', 'diagnostico',
  'plano de saúde', 'plano de saude', 'convênio', 'convenio',
  'unimed', 'hapvida', 'dasa', 'fleury', 'hermes pardini',
  'biomedicina', 'enfermagem', 'fisioterapia', 'nutrição clínica',
  'equipamentos médicos', 'dispositivos médicos', 'telemedicina',
  'prontuário eletrônico', 'gestão hospitalar', 'SUS',
];

// Empresas conhecidas por segmento
export const KNOWN_COMPANIES: Record<string, Segment> = {
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
  'itau': 'Mercado Financeiro',
  'bradesco': 'Mercado Financeiro',
  'santander': 'Mercado Financeiro',
  'caixa': 'Mercado Financeiro',
  'btg': 'Mercado Financeiro',
  'nubank': 'Mercado Financeiro',
  'inter': 'Mercado Financeiro',
  'xp': 'Mercado Financeiro',
  'digio': 'Mercado Financeiro',
  'celcoin': 'Mercado Financeiro',
  'travelex': 'Mercado Financeiro',
  
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
  
  // Varejo
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
  'desty': 'Varejo',
  'infracommerce': 'Varejo',
  
  // Tech companies
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

  // Saúde
  'unimed': 'Saúde',
  'hapvida': 'Saúde',
  'dasa': 'Saúde',
  'fleury': 'Saúde',
  'hermespardini': 'Saúde',
  'einstein': 'Saúde',
  'sirioslibanes': 'Saúde',
  'amil': 'Saúde',
  'notredame': 'Saúde',
  'odontoprev': 'Saúde',
};

// Mapa de keywords para segmentos
export const SEGMENT_KEYWORDS_MAP: Record<Segment, string[]> = {
  'Mercado Financeiro': FINANCEIRO_KEYWORDS,
  'Agro/relacionados': AGRO_KEYWORDS,
  'Varejo': VAREJO_KEYWORDS,
  'Atacado': ATACADO_KEYWORDS,
  'Tech/Inovação': TECH_INOVACAO_KEYWORDS,
  'Indústria': INDUSTRIA_KEYWORDS,
  'Educação': EDUCACAO_KEYWORDS,
  'Saúde': SAUDE_KEYWORDS,
  'Outros': OUTROS_KEYWORDS,
};

/**
 * Categoriza um email pelo domínio usando keywords aprimoradas
 */
export function categorizeByDomainEnhanced(email: string): Segment {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  const domainName = domain.split('.')[0] || '';
  
  // 1. Primeiro verifica empresas conhecidas
  for (const [company, segment] of Object.entries(KNOWN_COMPANIES)) {
    if (domainName.includes(company) || domain.includes(company)) {
      return segment;
    }
  }
  
  // 2. Calcula score por segmento baseado em keywords
  const scores: Record<Segment, number> = {
    'Mercado Financeiro': 0,
    'Agro/relacionados': 0,
    'Varejo': 0,
    'Atacado': 0,
    'Tech/Inovação': 0,
    'Indústria': 0,
    'Educação': 0,
    'Saúde': 0,
    'Outros': 0,
  };
  
  for (const [segment, keywords] of Object.entries(SEGMENT_KEYWORDS_MAP)) {
    for (const keyword of keywords) {
      const normalizedKeyword = keyword
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '');
      
      const normalizedDomain = domain
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      
      if (normalizedDomain.includes(normalizedKeyword)) {
        scores[segment as Segment] += keyword.includes(' ') ? 3 : 1;
      }
    }
  }
  
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore > 0) {
    const bestSegment = Object.entries(scores).find(([_, score]) => score === maxScore);
    if (bestSegment) {
      return bestSegment[0] as Segment;
    }
  }
  
  return 'Outros';
}

/**
 * Categoriza pelo nome interno (usado em métricas E-goi)
 */
export function categorizeByNomeInternoEnhanced(nomeInterno: string): Segment {
  const normalized = nomeInterno
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  const scores: Record<Segment, number> = {
    'Mercado Financeiro': 0,
    'Agro/relacionados': 0,
    'Varejo': 0,
    'Atacado': 0,
    'Tech/Inovação': 0,
    'Indústria': 0,
    'Educação': 0,
    'Saúde': 0,
    'Outros': 0,
  };
  
  for (const [segment, keywords] of Object.entries(SEGMENT_KEYWORDS_MAP)) {
    for (const keyword of keywords) {
      const normalizedKeyword = keyword
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      
      if (normalized.includes(normalizedKeyword)) {
        scores[segment as Segment] += keyword.includes(' ') ? 3 : 1;
      }
    }
  }
  
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore > 0) {
    const bestSegment = Object.entries(scores).find(([_, score]) => score === maxScore);
    if (bestSegment) {
      return bestSegment[0] as Segment;
    }
  }
  
  return 'Outros';
}

/**
 * Categoriza com base em múltiplos inputs
 */
export function categorizeWithContext(
  email: string,
  companyName?: string,
  additionalContext?: string
): Segment {
  const scores: Record<Segment, number> = {
    'Mercado Financeiro': 0,
    'Agro/relacionados': 0,
    'Varejo': 0,
    'Atacado': 0,
    'Tech/Inovação': 0,
    'Indústria': 0,
    'Educação': 0,
    'Saúde': 0,
    'Outros': 0,
  };
  
  const domainSegment = categorizeByDomainEnhanced(email);
  if (domainSegment !== 'Outros') {
    scores[domainSegment] += 5;
  }
  
  if (companyName) {
    const normalized = companyName.toLowerCase();
    for (const [company, segment] of Object.entries(KNOWN_COMPANIES)) {
      if (normalized.includes(company)) {
        scores[segment] += 10;
      }
    }
    
    for (const [segment, keywords] of Object.entries(SEGMENT_KEYWORDS_MAP)) {
      for (const keyword of keywords) {
        if (normalized.includes(keyword.toLowerCase())) {
          scores[segment as Segment] += 2;
        }
      }
    }
  }
  
  if (additionalContext) {
    const normalized = additionalContext.toLowerCase();
    for (const [segment, keywords] of Object.entries(SEGMENT_KEYWORDS_MAP)) {
      for (const keyword of keywords) {
        if (normalized.includes(keyword.toLowerCase())) {
          scores[segment as Segment] += 1;
        }
      }
    }
  }
  
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore > 0) {
    const bestSegment = Object.entries(scores).find(([_, score]) => score === maxScore);
    if (bestSegment) {
      return bestSegment[0] as Segment;
    }
  }
  
  return 'Outros';
}
