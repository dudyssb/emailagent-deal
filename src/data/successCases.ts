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

  // TRAVELEX - Câmbio
  {
    id: 'travelex',
    empresa: 'Travelex',
    setor: ['Mercado Financeiro'],
    isPublic: true,
    tipoResultado: ['time_to_market', 'eficiencia', 'inovacao'],
    descricao: 'Primeiro banco aprovado para operar exclusivamente em câmbio – 5 bilhões transacionados/ano, 120 lojas, 5 milhões de clientes',
    desafio: 'Aumentar capacidade de atender demandas do mercado de forma oportuna e competitiva, compondo equipe com perfis aderentes aos desafios do negócio',
    solucao: 'Implementação de todo o processo de transformação digital e ágil, incluindo roadmap tecnológico e esteira ágil Dual Tracking',
    resultados: [
      'Motor de câmbio em tempo real entregue em 60 dias, do zero',
      'Melhoria de 80% no turnover e aumento da performance da equipe',
      'Transformação ágil e digital com roadmaps implementados',
    ],
    destaque: 'motor de câmbio em tempo real em apenas 60 dias',
    metricas: [
      { label: 'Tempo entrega', valor: '60 dias' },
      { label: 'Melhoria turnover', valor: '80%' },
      { label: 'Transações/ano', valor: 'R$5 BI' },
    ],
  },

  // DESTY - Banco Digital (spin-off BANESE)
  {
    id: 'desty',
    empresa: 'Desty',
    setor: ['Mercado Financeiro'],
    isPublic: true,
    tipoResultado: ['time_to_market', 'escala', 'inovacao'],
    descricao: 'Primeiro banco digital do Nordeste – spin-off digital do BANESE',
    desafio: 'Orquestrar a entrega do banco digital cujo planejamento estava comprometido por falta de visibilidade e planejamento ineficaz',
    solucao: 'Squads nas fases de onboarding, emissão e core bancário Technisys, cultura orientada a produtos e stack Azure moderno',
    resultados: [
      '164% da meta anual de aquisição de clientes em 15 dias',
      'Plano estratégico e roadmap tecnológico estruturado para todas as squads',
      'Esteira de desenvolvimento alinhada com a evolução do segmento financeiro',
    ],
    destaque: '164% da meta anual de aquisição em apenas 15 dias',
    metricas: [
      { label: 'Meta aquisição', valor: '164%' },
      { label: 'Tempo', valor: '15 dias' },
    ],
  },

  // DIGIO - Fintech
  {
    id: 'digio',
    empresa: 'Digio',
    setor: ['Mercado Financeiro', 'Tech/Indústria/Inovação'],
    isPublic: true,
    tipoResultado: ['custo', 'eficiencia', 'inovacao'],
    descricao: 'Banco digital do Bradesco com 2,8 milhões de clientes',
    desafio: 'Unificar identidade e cultura das interfaces digitais, tornando o ecossistema mais omnichannel, reduzir silos e custos duplicados',
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
      { label: 'Clientes', valor: '2,8 MI' },
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

  // MONTADORA ALEMÃ
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
    descricao: 'Soluções logísticas integrando portos, ferrovias e terminais – SIOP',
    desafio: 'Garantir suporte e alta disponibilidade do SIOP em contêineres e ambiente on-premise',
    solucao: 'Adoção de Kubernetes para aplicações complexas com múltiplos containers',
    resultados: [
      'Melhora no desempenho do SIOP',
      'Velocidade para escalar aplicações conteinerizadas',
      'Resposta rápida a crises com suporte e time to market mais eficiente',
      'Otimização de recursos e melhoria contínua',
    ],
    destaque: 'alta disponibilidade do sistema crítico de operações logísticas',
    metricas: [],
  },

  // TRAY - E-commerce / TikTok
  {
    id: 'tray',
    empresa: 'Tray',
    setor: ['Varejo', 'Tech/Indústria/Inovação'],
    isPublic: true,
    tipoResultado: ['time_to_market', 'inovacao'],
    descricao: 'Pioneira na América Latina a integrar com TikTok',
    desafio: 'Prazo curto para integração com TikTok, com instabilidade e mudanças constantes nos serviços durante a implementação',
    solucao: 'Avaliação de ambiente, análise de infraestrutura, Radar de 15 Fatores, roadmap de evolução com MVP, V2 e V3',
    resultados: [
      'Entrega do MVP Beta para clientes selecionados dentro do prazo',
      'MVP em produção para todos os clientes Tray',
      'Reconhecimento como pioneira na integração com TikTok na América Latina',
    ],
    destaque: 'primeira integração com TikTok na América Latina, entregue no prazo',
    metricas: [
      { label: 'Status', valor: 'Pioneira LATAM' },
    ],
  },

  // CNA - Educação
  {
    id: 'cna',
    empresa: 'CNA Inglês Definitivo',
    setor: ['Educação'],
    isPublic: true,
    tipoResultado: ['eficiencia', 'inovacao', 'escala'],
    descricao: 'Rede de ensino de idiomas com modernização de dados e analytics',
    desafio: 'Modernizar infraestrutura de dados e analytics para arquitetura mais ágil e escalável, com integração de IA',
    solucao: 'Data Lake robusto na AWS com tecnologias serverless, pipeline de transformação de dados e suporte à modernização de BI',
    resultados: [
      '100% dos relatórios exigidos pelo negócio entregues via Data Lake',
      'Pipeline CI/CD implementado para fácil gerenciamento',
      'Dashboards e relatórios disponibilizados mais rapidamente',
      'Maior flexibilidade e agilidade para futuras demandas',
    ],
    destaque: '100% dos relatórios entregues via Data Lake com CI/CD automatizado',
    metricas: [
      { label: 'Relatórios Data Lake', valor: '100%' },
    ],
  },

  // B3 - Bolsa de Valores
  {
    id: 'b3',
    empresa: 'B3',
    setor: ['Mercado Financeiro'],
    isPublic: true,
    tipoResultado: ['time_to_market', 'inovacao'],
    descricao: 'Bolsa de Valores brasileira – mais de 5 milhões de investidores em renda variável',
    desafio: 'Construir e lançar produto inovador (crowdfunding Educa+) no mercado em 5 meses, engajando stakeholders',
    solucao: 'Co-criação do crowdfunding integrado com dados de investidores e sistemas legados do Tesouro Direto, ciclo Lean Startup',
    resultados: [
      'Lançamento de produto inovador no Brasil em 5 meses',
      'Fomento da cultura de produto upstream de forma escalável',
      'Cultura de colaboração e inovação contínua via Lean Startup',
    ],
    destaque: 'produto inovador lançado no mercado em apenas 5 meses',
    metricas: [
      { label: 'Time to market', valor: '5 meses' },
      { label: 'Investidores RV', valor: '+5 MI' },
    ],
  },

  // FISERV - Tecnologia Financeira
  {
    id: 'fiserv',
    empresa: 'Fiserv',
    setor: ['Mercado Financeiro', 'Tech/Indústria/Inovação'],
    isPublic: true,
    tipoResultado: ['eficiencia', 'performance', 'inovacao'],
    descricao: 'Líder global em tecnologia financeira e pagamentos – 7 bilhões em transações, 200 milhões de portadores',
    desafio: 'Segurança negligenciada pelas equipes DevOps, equipes de segurança em silos separados com ferramentas isoladas',
    solucao: 'Criação de métodos, processos, ferramentas, métricas e cultura DevSecOps elevando o nível de maturidade',
    resultados: [
      'Cadeia de valor DevSecOps implementada',
      'Implementação da cultura e cargas de trabalho DevSecOps',
      'Redução de custos e aumento da produtividade',
      'Padronização de processos nas operações',
    ],
    destaque: 'cultura DevSecOps implementada com redução de custos',
    metricas: [
      { label: 'Transações', valor: '7 BI' },
      { label: 'Portadores', valor: '200 MI' },
    ],
  },

  // KM DE VANTAGENS (IPIRANGA) - Programa de Fidelidade / Varejo
  // (nota: case distinto do Ipiranga acima que é sobre PDVs)

  // VELOE - FinOps
  {
    id: 'veloe',
    empresa: 'Veloe',
    setor: ['Mercado Financeiro', 'Outros'],
    isPublic: true,
    tipoResultado: ['custo', 'eficiencia'],
    descricao: 'Empresa de pagamentos de pedágios e estacionamentos do grupo Alelo',
    desafio: 'Otimizar custos, ter bom controle e aumentar eficiência no ambiente de nuvem',
    solucao: 'Solução FinOps para eliminar gastos excessivos, otimizar recursos e investir melhor em áreas estratégicas',
    resultados: [
      'Redução significativa de custos e realocação assertiva de recursos na nuvem',
      'Dashboard operacional alinhado à estratégia de negócios',
      'Melhora na governança e visibilidade do ambiente de nuvem',
      'Melhora nas revisões de produtos',
    ],
    destaque: 'redução significativa de custos com FinOps e governança de nuvem',
    metricas: [
      { label: 'FinOps', valor: 'Implementado' },
    ],
  },

  // GETNET - Pagamentos
  {
    id: 'getnet',
    empresa: 'Getnet',
    setor: ['Mercado Financeiro', 'Varejo'],
    isPublic: true,
    tipoResultado: ['performance', 'eficiencia', 'custo'],
    descricao: 'Gigante em pagamentos eletrônicos – 15% de participação de mercado',
    desafio: 'Jornadas não fluidas, taxa de rejeição acima de 64%, dados inconsistentes, dificuldade na marcação de vendas e mídia',
    solucao: 'Growth Hacking, DesignOps e Front-End com análise heurística, prototipagem, analytics e integração de mais de 40 fontes de dados',
    resultados: [
      '75% de evolução na experiência em dispositivos móveis',
      'Aumento considerável na retenção e conversão de clientes',
      'Aumento de 1,2 milhão de visitas mensais na jornada',
      'Redução de CAC omnichannel em 32%',
    ],
    destaque: '75% de evolução mobile e 32% de redução no CAC omnichannel',
    metricas: [
      { label: 'Evolução mobile', valor: '75%' },
      { label: 'Redução CAC', valor: '32%' },
      { label: 'Visitas/mês', valor: '+1,2 MI' },
    ],
  },

  // VERTEM FAMILHÃO - Plataforma de Recompensas
  {
    id: 'vertem',
    empresa: 'Vertem Familhão',
    setor: ['Varejo', 'Tech/Indústria/Inovação'],
    isPublic: true,
    tipoResultado: ['escala', 'performance', 'inovacao'],
    descricao: 'Maior plataforma de recompensas do Brasil',
    desafio: 'Construir plataforma escalável com arquitetura sólida para grande volume de usuários simultâneos',
    solucao: 'Estrutura robusta com microsserviços e BFFs, micro front-end white label',
    resultados: [
      'Framework micro front-end white label com alta escalabilidade e replicabilidade',
      'Arquitetura de microsserviços integrando diversos produtos e parceiros',
      'Priorização do WhatsApp garantindo acessibilidade',
      'Aumento significativo no número de novas assinaturas',
    ],
    destaque: 'framework micro front-end white label escalável e replicável',
    metricas: [],
  },

  // ASSAÍ - Atacado/Varejo
  {
    id: 'assai',
    empresa: 'Assaí Atacadista',
    setor: ['Atacado', 'Varejo'],
    isPublic: true,
    tipoResultado: ['inovacao', 'escala', 'time_to_market'],
    descricao: 'Aplicativo de compras com presença em Apple Store, Google Play e web',
    desafio: 'Definir estratégia de produto, arquitetura escalável com microsserviços, e garantir disponibilidade multiplataforma',
    solucao: 'Lean Inception para ideação e protótipos, arquitetura de microsserviços e contêineres',
    resultados: [
      'Produto digital bem estruturado com estratégia sólida da ideação à execução',
      'Arquitetura escalável e flexível pronta para crescimento',
      'Disponibilidade em múltiplas plataformas (Apple Store, Google Play, web)',
    ],
    destaque: 'aplicativo multiplataforma com arquitetura escalável',
    metricas: [],
  },

  // CANAL DA PEÇA - Marketplace Autopeças
  {
    id: 'canal-da-peca',
    empresa: 'Canal da Peça',
    setor: ['Varejo', 'Tech/Indústria/Inovação'],
    isPublic: true,
    tipoResultado: ['inovacao', 'escala', 'eficiencia'],
    descricao: 'Maior marketplace de autopeças do Brasil',
    desafio: 'Mudança de mindset e cultura, redefinição de modelo de negócio e plataforma, governança ágil',
    solucao: 'Treinamentos ágeis, redefinição de plataforma digital, modelo de governança ágil e DevOps',
    resultados: [
      'Transformação digital com redefinição do modelo de negócio',
      'Transformação ágil completa com Governança Ágil',
      'Aumento da maturidade das squads',
      'Crescimento de mais de 100% na receita recorrente',
    ],
    destaque: 'mais de 100% de crescimento na receita recorrente',
    metricas: [
      { label: 'Crescimento receita', valor: '+100%' },
    ],
  },

  // VIA VAREJO - Varejo
  {
    id: 'via-varejo',
    empresa: 'Via Varejo',
    setor: ['Varejo'],
    isPublic: true,
    tipoResultado: ['escala', 'performance'],
    descricao: 'Líder no varejo – Casas Bahia, Pontofrio e Bartira',
    desafio: 'Gerenciar altos volumes de dados, complexidade de integração, manter resiliência e disponibilidade',
    solucao: 'Data Streaming com Apache Kafka, Zookeeper, APIs de sincronização, caching e balanceamento de carga',
    resultados: [
      'Mais de 120 milhões de mensagens processadas na Black Friday',
      'Escalabilidade e resiliência garantidas',
      'Sincronização de catálogo, estoque, preço e disponibilidade',
      'Crescimento de 60% nos acessos e 20% na receita',
    ],
    destaque: '120 milhões de mensagens na Black Friday com 60% mais acessos',
    metricas: [
      { label: 'Msgs Black Friday', valor: '120 MI' },
      { label: 'Crescimento acessos', valor: '60%' },
      { label: 'Crescimento receita', valor: '20%' },
    ],
  },

  // INFRA COMMERCE - Full Service (case atualizado com mais detalhes)
  {
    id: 'infracommerce-monitoring',
    empresa: 'Infra Commerce',
    setor: ['Varejo', 'Tech/Indústria/Inovação'],
    isPublic: true,
    tipoResultado: ['performance', 'eficiencia'],
    descricao: 'Líder em Full Service na América Latina – referência em Customer Experience as a Service',
    desafio: 'Identificar e agir rapidamente em eventos que possam interferir na operação de e-commerce dos clientes, especialmente antes da Black Friday',
    solucao: 'Dashboard em tempo real para monitorar e-commerces com equipe O2B dedicada 24/7',
    resultados: [
      'Alertas de sistema para respostas rápidas com suporte 24/7',
      'Mais controle e agilidade para as operações',
      '70% das solicitações aos distribuidores monitoradas',
      'Assertividade e segurança para os negócios dos clientes',
    ],
    destaque: '70% das solicitações monitoradas com suporte 24/7 para Black Friday',
    metricas: [
      { label: 'Solicitações monitoradas', valor: '70%' },
    ],
  },

  // ODONTOPREV - Saúde
  {
    id: 'odontoprev',
    empresa: 'Odontoprev',
    setor: ['Outros'],
    isPublic: true,
    tipoResultado: ['eficiencia', 'inovacao'],
    descricao: 'Maior empresa de benefícios odontológicos do Brasil – maior pagadora de dividendos na B3',
    desafio: 'Unificar DW, atender áreas de Operações, Vendas e Risco, integrar sistemas heterogêneos em plataforma única',
    solucao: 'Consultoria Sysvision + implementação de DW, Microstrategy Analytics, IBM DataStage e Oracle PL/SQL',
    resultados: [
      'Data Warehouse unificado para todas as áreas',
      'Integração de sistemas heterogêneos em plataforma única',
      'Analytics avançado com Microstrategy',
    ],
    destaque: 'DW unificado integrando Operações, Vendas e Risco',
    metricas: [],
  },

  // LTM - Programas de Fidelidade
  {
    id: 'ltm',
    empresa: 'LTM',
    setor: ['Varejo', 'Tech/Indústria/Inovação'],
    isPublic: true,
    tipoResultado: ['inovacao', 'eficiencia', 'escala'],
    descricao: 'Líder de mercado com 15+ anos em programas de fidelidade',
    desafio: 'Adaptação cultural ágil, integrar dados limpos no datalake para IA e análises preditivas, garantir escalabilidade dos modelos',
    solucao: 'PowerBI com machine learning, centralização com Datalake, ambiente multicloud',
    resultados: [
      'Squads ágeis treinadas com Agile Scrum',
      'Ambiente multicloud construído',
      'Integração completa com Datalake',
      'Relatórios PowerBI e análise What-If',
      'Previsão de produção com machine learning',
    ],
    destaque: 'IA preditiva com machine learning e ambiente multicloud',
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
