import { EmailContact, NurturingEmail, Segment } from '@/types/email';

// Variável E-goi para nome do lead
const EGOI_NAME_VAR = '!fname';

const SENDER_INFO = {
  name: 'Karine Casanova Soares',
  email: 'karine.soares@deal.com.br',
  phone: '(41) 99156-0342',
};

// Mapeamento de segmentos para versão curta usada no email 1
const SEGMENT_SHORT_NAMES: Record<Segment, string> = {
  'Mercado Financeiro': 'finance',
  'Agro/relacionados': 'agro',
  'Varejo': 'varejo',
  'Tech/Indústria/Inovação': 'inovação',
  'Outros': 'negócios',
};

const SEGMENT_PAIN_POINTS: Record<Segment, string[]> = {
  'Mercado Financeiro': [
    'conformidade regulatória e auditorias',
    'segurança de dados sensíveis',
    'modernização de sistemas legados',
    'experiência digital do cliente',
  ],
  'Agro/relacionados': [
    'gestão de cadeia de suprimentos',
    'rastreabilidade de produtos',
    'sazonalidade e planejamento',
    'conectividade em áreas rurais',
  ],
  'Varejo': [
    'omnicanalidade e integração de canais',
    'gestão de estoque em tempo real',
    'experiência do consumidor',
    'competitividade com e-commerce',
  ],
  'Tech/Indústria/Inovação': [
    'escalabilidade de soluções',
    'atração e retenção de talentos',
    'time-to-market de produtos',
    'integração de sistemas',
  ],
  'Outros': [
    'transformação digital',
    'eficiência operacional',
    'gestão de dados',
    'modernização de processos',
  ],
};

// Cases de sucesso reais mapeados por relevância de segmento
interface SuccessCase {
  empresa: string;
  resultados: string[];
  destaque: string;
}

const SEGMENT_SUCCESS_CASES: Record<Segment, SuccessCase> = {
  'Mercado Financeiro': {
    empresa: 'Digio',
    resultados: [
      '42% de redução de custos e tempo de desenvolvimento com a implementação do Design System',
      'Refatoração de features com redução de custos e aumento de performance e eficiência',
      'Implementação de ecossistema modular escalável',
      'Identidade e cultura de interfaces digitais unificadas para todos os canais, potencializando a estratégia omnichannel',
    ],
    destaque: 'redução de 42% nos custos de desenvolvimento e uma experiência digital unificada em todos os canais',
  },
  'Agro/relacionados': {
    empresa: 'Travelex',
    resultados: [
      'Construção do motor de cobrança e conversão de câmbio em tempo real em 60 dias, partindo do zero',
      'Melhoria de 80% em turnover e aumento de performance dos times',
      'Transformação ágil e digital com roadmaps implementados',
    ],
    destaque: 'entrega de um motor de câmbio em tempo real em apenas 60 dias e melhoria de 80% na retenção de talentos',
  },
  'Varejo': {
    empresa: 'Desty',
    resultados: [
      '164% da meta anual de aquisição de clientes em 15 dias',
      'Plano estratégico e roadmap tecnológico estruturado para todas as squads',
      'Esteira de desenvolvimento aderente a evolução do segmento',
    ],
    destaque: 'alcançar 164% da meta anual de aquisição de clientes em apenas 15 dias',
  },
  'Tech/Indústria/Inovação': {
    empresa: 'Digio',
    resultados: [
      '42% de redução de custos e tempo de desenvolvimento com a implementação do Design System',
      'Implementação de ecossistema modular escalável',
      'Refatoração de features com aumento de performance e eficiência',
    ],
    destaque: 'redução de 42% no tempo de desenvolvimento através de um ecossistema modular escalável',
  },
  'Outros': {
    empresa: 'Travelex',
    resultados: [
      'Construção do motor de cobrança e conversão de câmbio em tempo real em 60 dias',
      'Melhoria de 80% em turnover e aumento de performance dos times',
      'Transformação ágil e digital com roadmaps implementados',
    ],
    destaque: 'transformação digital completa com entrega em 60 dias e melhoria de 80% na performance dos times',
  },
};

// Conteúdo do material exclusivo para o email 3 - MIT-Deal: O impacto da IA na eficiência dos negócios
const EMAIL_3_MATERIAL = {
  titulo: 'O impacto da IA na eficiência dos negócios',
  topicos: [
    'A Inteligência Artificial como parte relevante no negócio de companhias em segmentos diversos',
    'O uso produtivo da IA ancorado no manejo de dados (e os desafios envolvidos)',
    'Amadurecimento da tecnologia no Brasil',
  ],
};

// Helper function to get short segment name
function getShortSegmentName(segmento: Segment): string {
  return SEGMENT_SHORT_NAMES[segmento] || 'negócios';
}

// Email 1: Parceria estratégica (usa nome curto do segmento)
const emailTemplate1 = {
  subject: (segmento: Segment) => {
    const shortName = getShortSegmentName(segmento);
    return `${EGOI_NAME_VAR}, uma parceria estratégica para ${shortName}`;
  },
  getContent: (segmento: Segment, painPoint: string) => {
    const shortName = getShortSegmentName(segmento);
    return `
      <p>Olá ${EGOI_NAME_VAR},</p>
      <p>Notei que sua empresa atua no segmento de <strong>${shortName}</strong> e sei que ${painPoint} é um desafio constante nesse setor.</p>
      <p>Na Deal, temos ajudado empresas como a sua a superar esses desafios através de soluções personalizadas de tecnologia e consultoria.</p>
      <p>Gostaria de agendar uma conversa rápida de 15 minutos para entender melhor o cenário atual da sua empresa?</p>
    `;
  },
};

// Email 2: Case de sucesso real
const emailTemplate2 = {
  subject: (segmento: Segment) => {
    const successCase = SEGMENT_SUCCESS_CASES[segmento];
    return `Case ${successCase.empresa}: resultados reais em transformação digital`;
  },
  getContent: (segmento: Segment, _painPoint: string) => {
    const successCase = SEGMENT_SUCCESS_CASES[segmento];
    const resultadosHTML = successCase.resultados
      .map(r => `<li>${r}</li>`)
      .join('\n          ');
    
    return `
      <p>Olá ${EGOI_NAME_VAR},</p>
      <p>Gostaria de compartilhar um case real de sucesso que alcançamos com a <strong>${successCase.empresa}</strong>:</p>
      <ul style="margin: 15px 0; padding-left: 20px;">
        ${resultadosHTML}
      </ul>
      <p>O resultado? <strong>${successCase.destaque}</strong>.</p>
      <p>Acredito que podemos alcançar resultados similares para sua empresa. Posso compartilhar mais detalhes sobre como chegamos nesses números?</p>
    `;
  },
};

// Email 3: Material exclusivo - O impacto da IA na eficiência dos negócios
const emailTemplate3 = {
  subject: (_segmento: Segment) => 
    `${EGOI_NAME_VAR}, material exclusivo: ${EMAIL_3_MATERIAL.titulo}`,
  getContent: (_segmento: Segment, _painPoint: string) => {
    const topicosHTML = EMAIL_3_MATERIAL.topicos
      .map(t => `<li>${t}</li>`)
      .join('\n          ');
    
    return `
      <p>Olá ${EGOI_NAME_VAR},</p>
      <p>Preparamos um material exclusivo: <strong>"${EMAIL_3_MATERIAL.titulo}"</strong></p>
      <p>Neste conteúdo você vai encontrar:</p>
      <ul style="margin: 15px 0; padding-left: 20px;">
        ${topicosHTML}
      </ul>
      <p>Este material foi desenvolvido com base em nossa experiência com mais de 200 clientes e cases reais de sucesso, trazendo insights valiosos sobre como a IA está transformando empresas no Brasil.</p>
      <p>Gostaria de receber esse material? Posso enviá-lo diretamente para você.</p>
    `;
  },
};

// Email 4: Última tentativa (mantido como original)
const emailTemplate4 = {
  subject: (_segmento: Segment) => 
    `Última tentativa: vamos conversar, ${EGOI_NAME_VAR}?`,
  getContent: (_segmento: Segment, painPoint: string) => `
    <p>Olá ${EGOI_NAME_VAR},</p>
    <p>Sei que sua agenda deve estar bastante cheia, mas acredito que uma conversa rápida sobre ${painPoint} pode trazer insights valiosos para sua empresa.</p>
    <p>Se não for o momento ideal, sem problemas! Posso entrar em contato em uma data mais conveniente.</p>
    <p>Quando seria um bom momento para conversarmos?</p>
  `,
};

const EMAIL_TEMPLATES = [
  emailTemplate1,
  emailTemplate2,
  emailTemplate3,
  emailTemplate4,
];

function generateEmailHTML(
  subject: string,
  bodyContent: string
): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      color: #333333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      border-bottom: 2px solid #0066CC;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .logo {
      color: #0066CC;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 20px 0;
    }
    .content p {
      margin: 0 0 15px 0;
    }
    .content ul {
      margin: 15px 0;
      padding-left: 20px;
    }
    .content li {
      margin-bottom: 8px;
    }
    .signature {
      border-top: 1px solid #eeeeee;
      padding-top: 20px;
      margin-top: 30px;
    }
    .signature-name {
      font-weight: bold;
      color: #0066CC;
      font-size: 16px;
    }
    .signature-title {
      color: #666666;
      font-size: 14px;
    }
    .signature-contact {
      margin-top: 10px;
      font-size: 13px;
      color: #666666;
    }
    .signature-contact a {
      color: #0066CC;
      text-decoration: none;
    }
    .cta-button {
      display: inline-block;
      background-color: #0066CC;
      color: white !important;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Deal</div>
  </div>
  
  <div class="content">
    ${bodyContent}
    
    <a href="mailto:${SENDER_INFO.email}?subject=Re: ${encodeURIComponent(subject)}" class="cta-button">
      Agendar Conversa
    </a>
  </div>
  
  <div class="signature">
    <div class="signature-name">${SENDER_INFO.name}</div>
    <div class="signature-title">Executiva de Novos Negócios | Deal</div>
    <div class="signature-contact">
      📧 <a href="mailto:${SENDER_INFO.email}">${SENDER_INFO.email}</a><br>
      📱 <a href="https://wa.me/5541991560342">${SENDER_INFO.phone}</a><br>
      🌐 <a href="https://www.deal.com.br">www.deal.com.br</a>
    </div>
  </div>
</body>
</html>`;
}

// Gera 4 templates de email para um segmento (usando !fname como variável E-goi)
export function generateSegmentEmailTemplates(segment: Segment): NurturingEmail[] {
  const painPoints = SEGMENT_PAIN_POINTS[segment];
  
  return EMAIL_TEMPLATES.map((template, index) => {
    const painPoint = painPoints[index % painPoints.length];
    const subject = template.subject(segment);
    const bodyContent = template.getContent(segment, painPoint);
    const htmlContent = generateEmailHTML(subject, bodyContent);

    return {
      id: `${segment}-email-${index + 1}`,
      subject,
      htmlContent,
      targetContact: { nome: EGOI_NAME_VAR, email: '', segmento: segment },
      sequence: index + 1,
    };
  });
}

// Mantém compatibilidade - agora gera templates por segmento ao invés de por lead
export function generateAllEmailsForSegment(
  _contacts: EmailContact[],
  segment: Segment
): NurturingEmail[] {
  return generateSegmentEmailTemplates(segment);
}

// Exporta todos os segmentos disponíveis
export const ALL_SEGMENTS: Segment[] = [
  'Mercado Financeiro',
  'Agro/relacionados',
  'Varejo',
  'Tech/Indústria/Inovação',
  'Outros',
];
