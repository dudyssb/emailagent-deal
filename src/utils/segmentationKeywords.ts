import { Segment } from '@/types/email';

/**
 * Keywords de segmentação aprimoradas
 * Organizadas por categoria para facilitar manutenção
 */

// 🛍️ VAREJO - Palavras-chave
export const VAREJO_KEYWORDS: string[] = [
  // Diretas
  'loja', 'lojas', 'e-commerce', 'ecommerce', 'varejo', 'retail',
  'consumidor final', 'ponto de venda', 'pdv', 'mix de produtos',
  'estoque', 'vitrine', 'promoção', 'ofertas', 'catálogo',
  'carrinho', 'checkout', 'frete', 'entrega',
  // Corporativas
  'experiência de compra', 'jornada do cliente', 'omnichannel',
  'marketplace', 'sell-out', 'trade marketing', 'giro de estoque',
  // Adicionais do mapa existente
  'store', 'shop', 'shopping', 'magazine', 'mercado', 'supermercado',
  'atacado', 'comercio', 'moda', 'vestuario', 'calcados', 'cosmeticos',
  'perfumaria', 'joias', 'otica', 'moveis', 'eletro', 'eletronico',
  // Combinações
  'loja online', 'compre agora', 'comprar online',
];

// 💰 MERCADO FINANCEIRO - Palavras-chave
export const FINANCEIRO_KEYWORDS: string[] = [
  // Institucional/produtos
  'investimentos', 'ativos financeiros', 'renda fixa', 'renda variável',
  'fundos', 'fundos de investimento', 'carteira', 'portfólio',
  'gestão de recursos', 'wealth management', 'asset management',
  'corretora', 'banco', 'banco digital', 'crédito', 'empréstimo',
  'financiamento', 'câmbio',
  // Técnicos
  'liquidez', 'rentabilidade', 'risco', 'perfil de risco',
  'derivativos', 'ações', 'bolsa', 'b3', 'compliance financeiro',
  'regulação', 'bacen', 'cvm',
  // Adicionais do mapa existente
  'finance', 'invest', 'capital', 'seguro', 'fintech', 'pag', 'pay',
  'credit', 'credito', 'emprestimo', 'financeira', 'asset', 'gestora',
  'fundo', 'previdencia', 'consorcio', 'factoring',
  // Combinações
  'plataforma de investimentos', 'conta digital', 'open banking',
  'open finance', 'pix', 'ted', 'doc', 'boleto',
];

// 🌾 AGRO - Palavras-chave
export const AGRO_KEYWORDS: string[] = [
  // Produção e campo
  'agronegócio', 'agronegocio', 'produtor rural', 'fazenda', 'safra',
  'plantio', 'colheita', 'lavoura', 'pecuária', 'pecuaria',
  'gado', 'bovino', 'suíno', 'suino', 'aves', 'agricultura de precisão',
  // Insumos e tecnologia
  'fertilizantes', 'defensivos agrícolas', 'defensivos agricolas',
  'sementes', 'nutrição animal', 'nutricao animal',
  'maquinário agrícola', 'maquinario agricola', 'implementos',
  'irrigação', 'irrigacao', 'silagem', 'armazenagem de grãos',
  'armazenagem de graos',
  // Adicionais do mapa existente
  'agro', 'rural', 'agricola', 'soja', 'milho', 'cafe', 'coop',
  'granja', 'frango', 'avicola', 'fertil', 'graos', 'laticinio',
  'laticinios', 'frigorifico', 'alimentos', 'trator', 'maquinas',
  // Combinações
  'soluções para o produtor rural', 'gestão rural', 'crédito rural',
];

// 🏭💻 TECH / INDÚSTRIA - Palavras-chave
export const TECH_INDUSTRIA_KEYWORDS: string[] = [
  // Indústria
  'manufatura', 'produção industrial', 'producao industrial',
  'linha de produção', 'linha de producao', 'automação industrial',
  'automacao industrial', 'engenharia', 'equipamentos industriais',
  'manutenção industrial', 'manutencao industrial',
  'eficiência operacional', 'eficiencia operacional',
  'controle de qualidade', 'cadeia de suprimentos', 'supply chain',
  // Tech
  'software', 'plataforma', 'saas', 'sistema', 'sistemas',
  'tecnologia proprietária', 'tecnologia proprietaria',
  'inteligência artificial', 'inteligencia artificial', 'dados', 'data',
  'nuvem', 'cloud', 'api', 'integração', 'integracao',
  'cibersegurança', 'ciberseguranca', 'transformação digital',
  'transformacao digital', 'inovação tecnológica', 'inovacao tecnologica',
  // Adicionais do mapa existente
  'tech', 'tecnologia', 'digital', 'labs', 'dev', 'io',
  'industria', 'manufacturing', 'inovacao', 'startup', 'app',
  'cyber', 'ai', 'machine', 'automation', 'automacao', 'robotica',
  'iot', 'solucoes', 'metalurgica', 'siderurgica', 'fabrica',
  // Combinações
  'software para gestão industrial', 'gestão industrial',
  'indústria 4.0', 'industria 4.0', 'smart factory',
];

// 📦 OUTROS - Palavras-chave (genérico / difícil de classificar)
export const OUTROS_KEYWORDS: string[] = [
  'consultoria', 'serviços especializados', 'servicos especializados',
  'soluções personalizadas', 'solucoes personalizadas', 'assessoria',
  'educação', 'educacao', 'cursos', 'treinamentos',
  'ong', 'instituto', 'fundação', 'fundacao',
  'eventos', 'produção de eventos', 'producao de eventos',
  'marketing', 'publicidade', 'comunicação', 'comunicacao',
  'design', 'estúdio criativo', 'estudio criativo',
  'saúde', 'saude', 'turismo', 'hotelaria',
];

// Empresas conhecidas por segmento (para match exato)
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

// Mapa de keywords para segmentos (para busca rápida)
export const SEGMENT_KEYWORDS_MAP: Record<Segment, string[]> = {
  'Mercado Financeiro': FINANCEIRO_KEYWORDS,
  'Agro/relacionados': AGRO_KEYWORDS,
  'Varejo': VAREJO_KEYWORDS,
  'Tech/Indústria/Inovação': TECH_INDUSTRIA_KEYWORDS,
  'Outros': OUTROS_KEYWORDS,
};

/**
 * Categoriza um email pelo domínio usando keywords aprimoradas
 */
export function categorizeByDomainEnhanced(email: string): Segment {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  const domainName = domain.split('.')[0] || '';
  
  // 1. Primeiro verifica empresas conhecidas (match exato ou contém)
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
    'Tech/Indústria/Inovação': 0,
    'Outros': 0,
  };
  
  for (const [segment, keywords] of Object.entries(SEGMENT_KEYWORDS_MAP)) {
    for (const keyword of keywords) {
      // Normaliza keyword removendo acentos e espaços
      const normalizedKeyword = keyword
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '');
      
      const normalizedDomain = domain
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      
      if (normalizedDomain.includes(normalizedKeyword)) {
        scores[segment as Segment] += keyword.includes(' ') ? 3 : 1; // Combinações valem mais
      }
    }
  }
  
  // 3. Retorna segmento com maior score (se > 0)
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
    'Tech/Indústria/Inovação': 0,
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
 * Categoriza com base em múltiplos inputs (email, nome da empresa, contexto adicional)
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
    'Tech/Indústria/Inovação': 0,
    'Outros': 0,
  };
  
  // Score do domínio
  const domainSegment = categorizeByDomainEnhanced(email);
  if (domainSegment !== 'Outros') {
    scores[domainSegment] += 5;
  }
  
  // Score do nome da empresa
  if (companyName) {
    const normalized = companyName.toLowerCase();
    for (const [company, segment] of Object.entries(KNOWN_COMPANIES)) {
      if (normalized.includes(company)) {
        scores[segment] += 10; // Match de empresa conhecida tem peso alto
      }
    }
    
    // Também verifica keywords
    for (const [segment, keywords] of Object.entries(SEGMENT_KEYWORDS_MAP)) {
      for (const keyword of keywords) {
        if (normalized.includes(keyword.toLowerCase())) {
          scores[segment as Segment] += 2;
        }
      }
    }
  }
  
  // Score do contexto adicional
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
  
  // Retorna o melhor
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore > 0) {
    const bestSegment = Object.entries(scores).find(([_, score]) => score === maxScore);
    if (bestSegment) {
      return bestSegment[0] as Segment;
    }
  }
  
  return 'Outros';
}
