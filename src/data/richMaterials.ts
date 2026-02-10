import { Segment } from '@/types/email';

export interface RichMaterial {
  id: string;
  titulo: string;
  descricao: string;
  segmentosAlvo: Segment[];
  temas: string[];
  topicos: string[];
  keywords: string[]; // Palavras-chave para match automático
}

// Materiais ricos extraídos dos ebooks/papers
export const RICH_MATERIALS: RichMaterial[] = [
  // E-book Meios de Pagamentos (Financeiro)
  {
    id: 'meios-pagamentos',
    titulo: 'A Evolução dos Meios de Pagamentos Internacionais',
    descricao: 'Material sobre a tecnologia EFX e o novo marco cambial brasileiro',
    segmentosAlvo: ['Mercado Financeiro'],
    temas: ['pagamentos', 'câmbio', 'EFX', 'marco cambial', 'remessas internacionais'],
    topicos: [
      'Novo Marco Cambial e suas implicações',
      'EFX & Remessas Internacionais',
      'Case "PIX Internacional"',
      'Plataforma NEXUS para pagamentos globais',
    ],
    keywords: [
      'banco', 'fintech', 'pagamento', 'câmbio', 'transferência', 'remessa',
      'pix', 'swift', 'internacional', 'moeda', 'corretora', 'exchange',
    ],
  },

  // E-book Cultura de Inovação (Geral/Tech)
  {
    id: 'cultura-inovacao',
    titulo: 'Como Fomentar uma Cultura de Inovação',
    descricao: 'Guia prático para criar uma cultura de inovação nas organizações',
    segmentosAlvo: ['Tech/Indústria/Inovação', 'Educação', 'Outros'],
    temas: ['inovação', 'cultura', 'transformação', 'liderança'],
    topicos: [
      'O que é inovação e como ela se manifesta nas empresas',
      'Principais fatores: cultura certa (87,2%), liderança forte (75,2%), tecnologia (75,2%)',
      'Digitalização de processos como ferramenta de transformação',
      'Como criar um ciclo virtuoso de inovação',
    ],
    keywords: [
      'startup', 'inovação', 'transformação digital', 'cultura', 'liderança',
      'tecnologia', 'digital', 'processos', 'modernização',
    ],
  },

  // E-book Multicloud Cloud-Native (Tech/Indústria)
  {
    id: 'multicloud-cloudnative',
    titulo: 'Economia Inteligente: Como Multicloud e Cloud-Native Reduzem Custos',
    descricao: 'Estratégias para otimização de custos com multicloud e cloud-native',
    segmentosAlvo: ['Tech/Indústria/Inovação', 'Mercado Financeiro'],
    temas: ['cloud', 'multicloud', 'kubernetes', 'FinOps', 'custos'],
    topicos: [
      'Conceitos de Cloud-Native e Multicloud',
      'Estratégia Multihybrid para otimização',
      'Repatriação da Cloud Pública (economia de 30-70%)',
      'FinOps e seus benefícios',
      'Cases de sucesso: Celcoin, Thema/Pólis, VLI',
    ],
    keywords: [
      'cloud', 'aws', 'azure', 'gcp', 'kubernetes', 'k8s', 'container',
      'infraestrutura', 'devops', 'datacenter', 'custos', 'finops',
    ],
  },

  // E-book Microsserviços (Tech/Indústria)
  {
    id: 'microsservicos',
    titulo: 'Microsserviços: O Caminho da Eficiência e Escalabilidade',
    descricao: 'Análise completa sobre arquitetura de microsserviços',
    segmentosAlvo: ['Tech/Indústria/Inovação'],
    temas: ['microsserviços', 'arquitetura', 'escalabilidade', 'DevOps'],
    topicos: [
      'Componentização via serviços',
      'Organização em torno de recursos de negócios',
      'Governança descentralizada',
      'Automação de infraestrutura',
      'Design evolutivo',
    ],
    keywords: [
      'software', 'desenvolvimento', 'arquitetura', 'api', 'backend',
      'sistema', 'aplicação', 'microsserviços', 'deploy', 'escala',
    ],
  },

  // E-book Data & Analytics + AI (Todos os segmentos)
  {
    id: 'data-analytics-ia',
    titulo: 'O Impacto da IA na Eficiência dos Negócios',
    descricao: 'Data & Analytics + AI: o que você precisa saber para avançar na era digital',
    segmentosAlvo: ['Mercado Financeiro', 'Agro/relacionados', 'Varejo', 'Atacado', 'Tech/Indústria/Inovação', 'Educação', 'Outros'],
    temas: ['IA', 'dados', 'analytics', 'machine learning', 'transformação digital'],
    topicos: [
      'A Inteligência Artificial como parte relevante no negócio de companhias em segmentos diversos',
      'O uso produtivo da IA ancorado no manejo de dados (e os desafios envolvidos)',
      'Amadurecimento da tecnologia no Brasil',
      'Entendendo os fundamentos da IA',
      'Como a IA está mudando estratégias de Big Data',
      'IA na operação de dados: da estratégia à aplicação',
    ],
    keywords: [
      'dados', 'data', 'analytics', 'bi', 'inteligência artificial', 'ia', 'ai',
      'machine learning', 'big data', 'análise', 'insights', 'predição',
    ],
  },

  // Paper Black Friday (Varejo)
  {
    id: 'black-friday',
    titulo: 'Black Friday 2024: Como se Destacar e Maximizar Resultados no Digital',
    descricao: 'Guia estratégico para campanhas de Black Friday com foco em digital',
    segmentosAlvo: ['Varejo'],
    temas: ['e-commerce', 'Black Friday', 'marketing digital', 'vendas'],
    topicos: [
      'Expectativas para a Black Friday 2024',
      'Desafios: concorrência, orçamento, infraestrutura',
      'Estratégias: First-Party Data, hiperpersonalização',
      'Marketing contextual e comunicação omnichannel',
      'SEO e infraestrutura tecnológica',
      'Phygital e formas de pagamento',
      'IA como aliada nas vendas',
    ],
    keywords: [
      'varejo', 'e-commerce', 'loja', 'venda', 'consumidor', 'marketing',
      'campanha', 'promoção', 'black friday', 'desconto', 'checkout',
    ],
  },
];

// Busca materiais por segmento
export function getMaterialsBySegment(segment: Segment): RichMaterial[] {
  return RICH_MATERIALS.filter(m => m.segmentosAlvo.includes(segment));
}

// Função para calcular score de match entre material e contexto
function calculateMatchScore(material: RichMaterial, context: string): number {
  const contextLower = context.toLowerCase();
  let score = 0;
  
  // Pontos por keywords encontradas
  material.keywords.forEach(keyword => {
    if (contextLower.includes(keyword.toLowerCase())) {
      score += 2;
    }
  });
  
  // Pontos por temas encontrados
  material.temas.forEach(tema => {
    if (contextLower.includes(tema.toLowerCase())) {
      score += 3;
    }
  });
  
  return score;
}

// Seleciona automaticamente o melhor material para um segmento e contexto
export function selectBestMaterialForSegment(
  segment: Segment,
  companyContext?: string // Informações sobre a empresa (domínio, nome, etc.)
): RichMaterial {
  const availableMaterials = getMaterialsBySegment(segment);
  
  if (availableMaterials.length === 0) {
    // Fallback para material genérico de IA (serve para todos)
    return RICH_MATERIALS.find(m => m.id === 'data-analytics-ia')!;
  }
  
  if (availableMaterials.length === 1 || !companyContext) {
    return availableMaterials[0];
  }
  
  // Calcula score para cada material
  let bestMaterial = availableMaterials[0];
  let bestScore = 0;
  
  availableMaterials.forEach(material => {
    const score = calculateMatchScore(material, companyContext);
    if (score > bestScore) {
      bestScore = score;
      bestMaterial = material;
    }
  });
  
  return bestMaterial;
}

// Retorna materiais ordenados por relevância para um contexto
export function getMaterialsRankedByRelevance(
  segment: Segment,
  companyContext: string
): RichMaterial[] {
  const materials = getMaterialsBySegment(segment);
  
  return materials
    .map(m => ({
      material: m,
      score: calculateMatchScore(m, companyContext),
    }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.material);
}
