import { Segment } from '@/types/email';

export interface RichMaterial {
  id: string;
  titulo: string;
  descricao: string;
  segmentosAlvo: Segment[];
  temas: string[];
  topicos: string[];
  keywords: string[];
}

export const RICH_MATERIALS: RichMaterial[] = [
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
    keywords: ['banco', 'fintech', 'pagamento', 'câmbio', 'transferência', 'remessa', 'pix', 'swift', 'internacional', 'moeda', 'corretora', 'exchange'],
  },
  {
    id: 'cultura-inovacao',
    titulo: 'Como Fomentar uma Cultura de Inovação',
    descricao: 'Guia prático para criar uma cultura de inovação nas organizações',
    segmentosAlvo: ['Tech/Inovação', 'Educação', 'Outros'],
    temas: ['inovação', 'cultura', 'transformação', 'liderança'],
    topicos: [
      'O que é inovação e como ela se manifesta nas empresas',
      'Principais fatores: cultura certa (87,2%), liderança forte (75,2%), tecnologia (75,2%)',
      'Digitalização de processos como ferramenta de transformação',
      'Como criar um ciclo virtuoso de inovação',
    ],
    keywords: ['startup', 'inovação', 'transformação digital', 'cultura', 'liderança', 'tecnologia', 'digital', 'processos', 'modernização'],
  },
  {
    id: 'multicloud-cloudnative',
    titulo: 'Economia Inteligente: Como Multicloud e Cloud-Native Reduzem Custos',
    descricao: 'Estratégias para otimização de custos com multicloud e cloud-native',
    segmentosAlvo: ['Tech/Inovação', 'Indústria', 'Mercado Financeiro'],
    temas: ['cloud', 'multicloud', 'kubernetes', 'FinOps', 'custos'],
    topicos: [
      'Conceitos de Cloud-Native e Multicloud',
      'Estratégia Multihybrid para otimização',
      'Repatriação da Cloud Pública (economia de 30-70%)',
      'FinOps e seus benefícios',
      'Cases de sucesso: Celcoin, Thema/Pólis, VLI',
    ],
    keywords: ['cloud', 'aws', 'azure', 'gcp', 'kubernetes', 'k8s', 'container', 'infraestrutura', 'devops', 'datacenter', 'custos', 'finops'],
  },
  {
    id: 'microsservicos',
    titulo: 'Microsserviços: O Caminho da Eficiência e Escalabilidade',
    descricao: 'Análise completa sobre arquitetura de microsserviços',
    segmentosAlvo: ['Tech/Inovação', 'Indústria'],
    temas: ['microsserviços', 'arquitetura', 'escalabilidade', 'DevOps'],
    topicos: [
      'Componentização via serviços',
      'Organização em torno de recursos de negócios',
      'Governança descentralizada',
      'Automação de infraestrutura',
      'Design evolutivo',
    ],
    keywords: ['software', 'desenvolvimento', 'arquitetura', 'api', 'backend', 'sistema', 'aplicação', 'microsserviços', 'deploy', 'escala'],
  },
  {
    id: 'data-analytics-ia',
    titulo: 'O Impacto da IA na Eficiência dos Negócios',
    descricao: 'Data & Analytics + AI: o que você precisa saber para avançar na era digital',
    segmentosAlvo: ['Mercado Financeiro', 'Agro/relacionados', 'Varejo', 'Atacado', 'Tech/Inovação', 'Indústria', 'Educação', 'Saúde', 'Outros'],
    temas: ['IA', 'dados', 'analytics', 'machine learning', 'transformação digital'],
    topicos: [
      'A Inteligência Artificial como parte relevante no negócio de companhias em segmentos diversos',
      'O uso produtivo da IA ancorado no manejo de dados (e os desafios envolvidos)',
      'Amadurecimento da tecnologia no Brasil',
      'Entendendo os fundamentos da IA',
      'Como a IA está mudando estratégias de Big Data',
      'IA na operação de dados: da estratégia à aplicação',
    ],
    keywords: ['dados', 'data', 'analytics', 'bi', 'inteligência artificial', 'ia', 'ai', 'machine learning', 'big data', 'análise', 'insights', 'predição'],
  },
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
    keywords: ['varejo', 'e-commerce', 'loja', 'venda', 'consumidor', 'marketing', 'campanha', 'promoção', 'black friday', 'desconto', 'checkout'],
  },
];

export function getMaterialsBySegment(segment: Segment): RichMaterial[] {
  return RICH_MATERIALS.filter(m => m.segmentosAlvo.includes(segment));
}

function calculateMatchScore(material: RichMaterial, context: string): number {
  const contextLower = context.toLowerCase();
  let score = 0;
  material.keywords.forEach(keyword => {
    if (contextLower.includes(keyword.toLowerCase())) score += 2;
  });
  material.temas.forEach(tema => {
    if (contextLower.includes(tema.toLowerCase())) score += 3;
  });
  return score;
}

export function selectBestMaterialForSegment(segment: Segment, companyContext?: string): RichMaterial {
  const availableMaterials = getMaterialsBySegment(segment);
  if (availableMaterials.length === 0) {
    return RICH_MATERIALS.find(m => m.id === 'data-analytics-ia')!;
  }
  if (availableMaterials.length === 1 || !companyContext) {
    return availableMaterials[0];
  }
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

export function getMaterialsRankedByRelevance(segment: Segment, companyContext: string): RichMaterial[] {
  const materials = getMaterialsBySegment(segment);
  return materials
    .map(m => ({ material: m, score: calculateMatchScore(m, companyContext) }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.material);
}
