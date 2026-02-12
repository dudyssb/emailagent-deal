import { Segment } from '@/types/email';

// Tipos de resultado de case de sucesso
export type CaseResultType = 
  | 'custo' // Redução de custos
  | 'eficiencia' // Eficiência operacional
  | 'performance' // Performance/disponibilidade
  | 'time_to_market' // Velocidade de entrega
  | 'escala' // Escalabilidade
  | 'inovacao'; // Inovação/transformação digital

export interface SuccessCase {
  id: string;
  empresa: string;
  setor: Segment[];
  isPublic: boolean;
  tipoResultado: CaseResultType[];
  descricao: string;
  desafio: string;
  solucao: string;
  resultados: string[];
  destaque: string;
  metricas: {
    label: string;
    valor: string;
  }[];
}

// Cases de sucesso extraídos dos documentos
export const SUCCESS_CASES: SuccessCase[] = [
  // VOITER - Banco de Negócios (Não Público)
  {
    id: 'voiter',
    empresa: 'Voiter (Banco de Negócios)',
    setor: ['Mercado Financeiro'],
    isPublic: false,
    tipoResultado: ['eficiencia', 'time_to_market'],
    descricao: 'Um dos maiores bancos de negócios do país com atuação em Agro, Tech e Corporate',
    desafio: 'Implementar novas versões de aplicações com segurança e padronização através de pipelines, garantindo consistência com containers e Kubernetes',
    solucao: 'Testar releases com SonarQube, gerenciar containers em Kubernetes com HELM Charts, provisionar Data Lake na Azure Cloud com Terraform',
    resultados: [
      'Novos deploys e releases baseadas em Containers e Kubernetes totalmente automatizadas',
      'Redução em 70% do tempo de deploy de novas releases de software',
      'Redução da taxas de erros em 50% e maior agilidade em rollbacks e correções',
    ],
    destaque: 'redução de 70% no tempo de deploy e 50% menos erros em produção',
    metricas: [
      { label: 'Redução tempo deploy', valor: '70%' },
      { label: 'Redução erros', valor: '50%' },
    ],
  },

  // CELCOIN - Fintech (Público)
  {
    id: 'celcoin',
    empresa: 'Celcoin',
    setor: ['Mercado Financeiro', 'Tech/Indústria/Inovação'],
    isPublic: true,
    tipoResultado: ['custo', 'escala', 'inovacao'],
    descricao: 'Pioneira em infraestrutura de tecnologia financeira e bancária, movimentando R$17 BI mensalmente',
    desafio: 'Aperfeiçoar ambiente Kubernetes em cloud pública para suportar melhorias contínuas e aumentar capacidade de inovação',
    solucao: 'Implementação e gerenciamento de tecnologia open source pela O2B para acelerar migração e aprimoramento do ambiente',
    resultados: [
      'Estrutura mais robusta e eficiente',
      'Oferta simplificada de serviços financeiros aos clientes',
      'Redução de custos operacionais',
      'Maior agilidade na implementação de novas funcionalidades',
    ],
    destaque: 'estrutura mais robusta com redução de custos operacionais',
    metricas: [
      { label: 'Movimentação mensal', valor: 'R$17 BI' },
      { label: 'Clientes', valor: '+6 mil' },
    ],
  },

  // GENIAL INVESTIMENTOS - Corretora (Case público)
  {
    id: 'genial',
    empresa: 'Genial Investimentos',
    setor: ['Mercado Financeiro'],
    isPublic: true,
    tipoResultado: ['eficiencia', 'performance', 'custo'],
    descricao: 'Líder no segmento de corretagem com mais de R$210 BI em ativos',
    desafio: 'Implementar cultura de observabilidade, instrumentação das aplicações e unificação de notificações',
    solucao: 'Implementação e gestão do roadmap da plataforma Dynatrace incluindo Grail (logs) para extrair o máximo de IA',
    resultados: [
      'Insights precisos e baseados em IA sobre a jornada dos clientes',
      'Redução de 30% dos incidentes críticos nos últimos 12 meses',
      'Redução do MTTR em 50%',
      'Visibilidade de indicadores para toda a empresa',
      'Redução de custos através da consolidação de ferramentas',
    ],
    destaque: 'redução de 30% em incidentes críticos e 50% no tempo de resposta',
    metricas: [
      { label: 'Ativos sob gestão', valor: 'R$210 BI' },
      { label: 'Clientes', valor: '1,5 MI' },
      { label: 'Redução incidentes', valor: '30%' },
      { label: 'Redução MTTR', valor: '50%' },
    ],
  },

  // DOTZ - Programa de fidelidade (Não público - mas nome aparece)
  {
    id: 'dotz',
    empresa: 'Dotz',
    setor: ['Mercado Financeiro', 'Varejo'],
    isPublic: false,
    tipoResultado: ['eficiencia', 'custo', 'performance'],
    descricao: 'Conta Digital e pioneira em programas de fidelidade com parcerias em supermercados, farmácias, postos e bancos',
    desafio: 'Sistema legado não acompanhava crescimento e complexidade das operações, causando atrasos na resolução de problemas',
    solucao: 'Migração para arquitetura de microsserviços, otimização contínua e implementação de ELK, Grafana e Prometheus',
    resultados: [
      'Melhor qualidade do monitoramento',
      'Identificação e escalonamento de problemas 60% mais rápidos',
      'Resposta a crises melhorou em 50%',
      'Redução de custos em 30%',
    ],
    destaque: 'redução de 30% em custos e 60% mais rapidez na resolução de problemas',
    metricas: [
      { label: 'Rapidez resolução', valor: '60%' },
      { label: 'Resposta crises', valor: '50%' },
      { label: 'Redução custos', valor: '30%' },
    ],
  },

  // BRASILPREV - Previdência (Não público)
  {
    id: 'brasilprev',
    empresa: 'BrasilPrev',
    setor: ['Mercado Financeiro'],
    isPublic: false,
    tipoResultado: ['performance', 'eficiencia'],
    descricao: 'Líder no setor de previdência privada com mais de R$398,4 bilhões em ativos',
    desafio: 'Aumentar disponibilidade dos produtos e serviços para 100%',
    solucao: 'Squad exclusiva com especialistas em Cloud e DevOps utilizando práticas ágeis e automação',
    resultados: [
      'Aumento de 95% na disponibilidade dos produtos e serviços',
      'Redução de 70% no tempo de resposta a crises',
      'Melhoria na eficiência da resolução de problemas',
      'Fortalecimento da infraestrutura de TI',
    ],
    destaque: '95% de disponibilidade e 70% mais rápido na resposta a crises',
    metricas: [
      { label: 'Ativos sob gestão', valor: 'R$398,4 BI' },
      { label: 'Disponibilidade', valor: '95%' },
      { label: 'Resposta crises', valor: '70% mais rápida' },
    ],
  },

  // INFRACOMMERCE/NEGOCIOS - E-commerce (Público)
  {
    id: 'infracommerce',
    empresa: 'Infracommerce',
    setor: ['Varejo', 'Tech/Indústria/Inovação'],
    isPublic: true,
    tipoResultado: ['custo', 'escala', 'performance'],
    descricao: 'Maior plataforma de full commerce do Brasil com 18MM de pedidos anuais',
    desafio: 'Redução de custos de datacenter e cloud pública, escalabilidade multicloud',
    solucao: 'Implementação de clusters K8s no ambiente Cirion com deploy automatizado das aplicações',
    resultados: [
      'Redução em 70% do tempo de deploy de novas releases',
      'Monitoração integrada de todos os recursos',
      'Redução da taxa de erros em 50%',
      'Maior agilidade em rollbacks e correções',
    ],
    destaque: 'redução de 70% no tempo de deploy e suporte a 18 milhões de pedidos anuais',
    metricas: [
      { label: 'Pedidos anuais', valor: '18 MM' },
      { label: 'Itens/hora', valor: '2.800' },
      { label: 'Redução deploy', valor: '70%' },
      { label: 'Redução erros', valor: '50%' },
    ],
  },

  // MOBILIZE FINANCIAL SERVICES - Banco automotivo
  {
    id: 'mobilize',
    empresa: 'Mobilize Financial Services',
    setor: ['Mercado Financeiro'],
    isPublic: true,
    tipoResultado: ['performance', 'eficiencia'],
    descricao: 'Banco líder no setor automotivo com mais de 300 mil clientes no Brasil e 4 milhões no mundo',
    desafio: 'Garantir estabilidade e eficiência na infraestrutura com monitoramento de alta qualidade',
    solucao: 'Implementação de Command Center com Supervisor, Analistas de Observabilidade e SREs, automação de processos',
    resultados: [
      'Garantia de estabilidade do produto',
      'Antecipação e gerenciamento ágil de incidentes',
      'Geração de insights e dashboards para time de negócios',
    ],
    destaque: 'estabilidade operacional garantida com monitoramento 24/7',
    metricas: [
      { label: 'Clientes Brasil', valor: '300 mil' },
      { label: 'Clientes mundo', valor: '4 milhões' },
    ],
  },

  // IPIRANGA - Petroquímico (Não público)
  {
    id: 'ipiranga',
    empresa: 'Ipiranga',
    setor: ['Varejo', 'Outros'],
    isPublic: false,
    tipoResultado: ['performance', 'eficiencia'],
    descricao: 'Plataforma de inovação com 6,5 mil postos pelo Brasil',
    desafio: 'Melhorar disponibilidade dos PDVs para assegurar continuidade das vendas',
    solucao: 'Time dedicado 24x7 com Supervisor e Analistas de Observabilidade, automação de processos',
    resultados: [
      'Aumento do SLA de 95% para 99%',
      'Gerenciamento de salas de crise para análise de incidentes',
      'Resposta 90% mais rápida e eficiente a crises',
      'Acionamento automático de ações corretivas',
    ],
    destaque: 'SLA aumentado de 95% para 99% com resposta 90% mais rápida',
    metricas: [
      { label: 'Postos', valor: '6,5 mil' },
      { label: 'SLA atual', valor: '99%' },
      { label: 'Resposta crises', valor: '90% mais rápida' },
    ],
  },

  // CONQUER - Educacional
  {
    id: 'conquer',
    empresa: 'Conquer',
    setor: ['Educação', 'Tech/Indústria/Inovação'],
    isPublic: true,
    tipoResultado: ['custo', 'eficiencia', 'inovacao'],
    descricao: 'Instituição que prepara líderes corporativos para os desafios do mercado',
    desafio: 'Redução de custos de Cloud e implementação das melhores práticas DevOps',
    solucao: 'Análise do ambiente AWS para otimização, segurança, conformidade e FinOps',
    resultados: [
      'Otimização de custos na AWS com melhor utilização',
      'Ambiente 67% mais seguro seguindo Well-Architected Framework',
      'Melhoria na eficiência operacional',
      'Maior agilidade no lançamento de novas funcionalidades',
    ],
    destaque: 'ambiente 67% mais seguro com otimização significativa de custos',
    metricas: [
      { label: 'Segurança', valor: '67% mais seguro' },
    ],
  },

  // CRUZEIRO DO SUL - Educacional
  {
    id: 'cruzeiro-do-sul',
    empresa: 'Cruzeiro do Sul',
    setor: ['Educação'],
    isPublic: true,
    tipoResultado: ['performance', 'eficiencia'],
    descricao: 'Entre as três melhores faculdades privadas de São Paulo',
    desafio: 'Garantir monitoramento contínuo e tornar aplicações mais flexíveis, robustas e prontas para responder às necessidades dinâmicas do mercado',
    solucao: 'Implementação e suporte a clusters Kubernetes com ferramentas de automação (Zenduty) integrada com Datadog para escalonamento inteligente',
    resultados: [
      'Melhor qualidade do monitoramento e velocidade para escalar problemas',
      'Resposta rápida e eficiente a crises com suporte especializado',
      'Acionamento automático de ações corretivas',
    ],
    destaque: 'monitoramento inteligente com escalonamento automático via Datadog',
    metricas: [
      { label: 'Escalonamento', valor: 'Automatizado' },
    ],
  },

  // WEBMOTORS - Automotivo/Tech
  {
    id: 'webmotors',
    empresa: 'Webmotors',
    setor: ['Tech/Indústria/Inovação', 'Outros'],
    isPublic: true,
    tipoResultado: ['performance', 'eficiencia'],
    descricao: 'Líder no setor de compra e venda de automóveis com mais de 21 milhões de visitas',
    desafio: 'Estruturar a área de NOC (Centro de Operações) e implementar ferramentas e processos que garantissem a estabilidade da plataforma',
    solucao: 'Implantação de operação dedicada da O2B para gerenciamento do ambiente em nuvem (AWS)',
    resultados: [
      '100% das aplicações críticas supervisionadas',
      'Monitoramento de alta qualidade com visibilidade total',
      'Antecipação e gerenciamento ágil de incidentes',
      'Redução no tempo de indisponibilidade',
    ],
    destaque: '100% das aplicações críticas supervisionadas com visibilidade total',
    metricas: [
      { label: 'Visitas mensais', valor: '+21 milhões' },
      { label: 'Apps supervisionadas', valor: '100%' },
    ],
  },

  // TRAVELEX - Câmbio (case já existente)
  {
    id: 'travelex',
    empresa: 'Travelex',
    setor: ['Mercado Financeiro', 'Agro/relacionados', 'Outros'],
    isPublic: true,
    tipoResultado: ['time_to_market', 'eficiencia', 'inovacao'],
    descricao: 'Líder global em câmbio e pagamentos internacionais',
    desafio: 'Construir motor de cobrança e conversão de câmbio em tempo real do zero',
    solucao: 'Desenvolvimento ágil com squads integradas e roadmaps claros',
    resultados: [
      'Motor de câmbio em tempo real entregue em 60 dias',
      'Melhoria de 80% em turnover e performance dos times',
      'Transformação ágil e digital com roadmaps implementados',
    ],
    destaque: 'motor de câmbio em tempo real em apenas 60 dias',
    metricas: [
      { label: 'Tempo entrega', valor: '60 dias' },
      { label: 'Melhoria turnover', valor: '80%' },
    ],
  },

  // DESTY - Varejo (case já existente)
  {
    id: 'desty',
    empresa: 'Desty',
    setor: ['Varejo', 'Tech/Indústria/Inovação'],
    isPublic: true,
    tipoResultado: ['time_to_market', 'escala', 'inovacao'],
    descricao: 'Plataforma de e-commerce e marketplace',
    desafio: 'Acelerar aquisição de clientes e estruturar roadmap tecnológico',
    solucao: 'Plano estratégico e roadmap tecnológico estruturado para todas as squads',
    resultados: [
      '164% da meta anual de aquisição de clientes em 15 dias',
      'Roadmap tecnológico estruturado para todas as squads',
      'Esteira de desenvolvimento aderente à evolução do segmento',
    ],
    destaque: '164% da meta anual de aquisição em apenas 15 dias',
    metricas: [
      { label: 'Meta aquisição', valor: '164%' },
      { label: 'Tempo', valor: '15 dias' },
    ],
  },

  // DIGIO - Fintech (case já existente)
  {
    id: 'digio',
    empresa: 'Digio',
    setor: ['Mercado Financeiro', 'Tech/Indústria/Inovação'],
    isPublic: true,
    tipoResultado: ['custo', 'eficiencia', 'inovacao'],
    descricao: 'Banco digital com foco em experiência do usuário',
    desafio: 'Unificar identidade digital e reduzir custos de desenvolvimento',
    solucao: 'Implementação de Design System com ecossistema modular escalável',
    resultados: [
      '42% de redução de custos e tempo de desenvolvimento',
      'Refatoração de features com aumento de performance',
      'Implementação de ecossistema modular escalável',
      'Identidade e cultura de interfaces digitais unificadas',
    ],
    destaque: 'redução de 42% em custos de desenvolvimento',
    metricas: [
      { label: 'Redução custos', valor: '42%' },
      { label: 'Redução tempo dev', valor: '42%' },
    ],
  },

  // THEMA/POLIS - Gestão Pública
  {
    id: 'thema-polis',
    empresa: 'Grupo Thema/Pólis',
    setor: ['Tech/Indústria/Inovação', 'Outros'],
    isPublic: true,
    tipoResultado: ['escala', 'performance', 'inovacao'],
    descricao: 'Desenvolvimento de software para Gestão Pública',
    desafio: 'Implantar solução com isolamento entre sistemas para atender compliance e segurança de órgãos públicos',
    solucao: 'Implementação de orquestração Kubernetes com gestão unificada de ambientes Cloud e On-premises',
    resultados: [
      'Maior resiliência, segurança e escalabilidade',
      'Dezenas de clusters K8s integrados',
      'Melhoria na gestão e simplificação dos ambientes',
    ],
    destaque: 'dezenas de clusters K8s integrados com gestão unificada',
    metricas: [
      { label: 'Clusters K8s', valor: 'Dezenas' },
    ],
  },

  // MONTADORA ALEMÃ - Indústria automotiva
  {
    id: 'montadora-alemanha',
    empresa: 'Montadora Internacional (Alemanha)',
    setor: ['Tech/Indústria/Inovação'],
    isPublic: false,
    tipoResultado: ['escala', 'time_to_market', 'performance'],
    descricao: 'Líder na fabricação e comercialização de veículos automotores',
    desafio: 'Implementar clusters Kubernetes on-premises em data centers na Alemanha para aplicações críticas',
    solucao: 'Clusters Kubernetes com Rancher, ElasticSearch, Kibana e HAProxy',
    resultados: [
      'Visibilidade e controle do ambiente',
      'Alinhamento com novas tecnologias',
      'Rapidez na entrega de novas soluções',
      'Escalabilidade de aplicações sob demanda',
      'Suporte 24/7 com foco em melhoria contínua',
    ],
    destaque: 'escalabilidade sob demanda com suporte 24/7',
    metricas: [],
  },

  // VLI - Logística
  {
    id: 'vli',
    empresa: 'VLI',
    setor: ['Tech/Indústria/Inovação', 'Agro/relacionados'],
    isPublic: true,
    tipoResultado: ['performance', 'custo', 'escala'],
    descricao: 'Líder no segmento logístico - portos e terminais',
    desafio: 'Garantir sustentação e alta disponibilidade do SIOP (Sistema Integrado de Operações)',
    solucao: 'Adoção de Kubernetes para aplicações complexas com múltiplos containers',
    resultados: [
      'Estrutura mais robusta e eficiente',
      'Redução de custos operacionais',
      'Maior agilidade na implementação de novas funcionalidades',
    ],
    destaque: 'alta disponibilidade do sistema crítico de operações logísticas',
    metricas: [],
  },
];

// Labels amigáveis para tipos de resultado
export const RESULT_TYPE_LABELS: Record<CaseResultType, string> = {
  custo: 'Redução de Custos',
  eficiencia: 'Eficiência Operacional',
  performance: 'Performance/Disponibilidade',
  time_to_market: 'Velocidade de Entrega',
  escala: 'Escalabilidade',
  inovacao: 'Inovação/Transformação Digital',
};

// Busca cases por segmento
export function getCasesBySegment(segment: Segment): SuccessCase[] {
  return SUCCESS_CASES.filter(c => c.setor.includes(segment));
}

// Busca cases por segmento e tipo de resultado
export function getCasesBySegmentAndType(
  segment: Segment, 
  resultType: CaseResultType
): SuccessCase[] {
  return SUCCESS_CASES.filter(
    c => c.setor.includes(segment) && c.tipoResultado.includes(resultType)
  );
}

// Retorna tipos de resultado disponíveis para um segmento
export function getAvailableResultTypes(segment: Segment): CaseResultType[] {
  const cases = getCasesBySegment(segment);
  const types = new Set<CaseResultType>();
  cases.forEach(c => c.tipoResultado.forEach(t => types.add(t)));
  return Array.from(types);
}

// Busca o melhor case para um segmento (prioriza públicos)
export function getBestCaseForSegment(
  segment: Segment, 
  resultType?: CaseResultType
): SuccessCase | undefined {
  let cases = getCasesBySegment(segment);
  
  if (resultType) {
    cases = cases.filter(c => c.tipoResultado.includes(resultType));
  }
  
  // Prioriza cases públicos
  const publicCases = cases.filter(c => c.isPublic);
  return publicCases[0] || cases[0];
}
