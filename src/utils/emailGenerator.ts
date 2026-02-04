import { EmailContact, NurturingEmail, Segment } from '@/types/email';
import { 
  SUCCESS_CASES, 
  SuccessCase, 
  CaseResultType, 
  RESULT_TYPE_LABELS,
  getCasesBySegment,
  getBestCaseForSegment,
  getAvailableResultTypes 
} from '@/data/successCases';
import { 
  RichMaterial,
  getMaterialsBySegment,
  selectBestMaterialForSegment 
} from '@/data/richMaterials';

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

// Helper function to get short segment name
function getShortSegmentName(segmento: Segment): string {
  return SEGMENT_SHORT_NAMES[segmento] || 'negócios';
}

// Configuração de geração de emails
export interface EmailGenerationConfig {
  segment: Segment;
  selectedCaseResultType?: CaseResultType;
  companyContext?: string; // Para seleção automática de material
}

// Email 1: Parceria estratégica (usa nome curto do segmento)
const emailTemplate1 = {
  subject: (segmento: Segment) => {
    const shortName = getShortSegmentName(segmento);
    return `${EGOI_NAME_VAR}, uma parceria estratégica para ${shortName}`;
  },
  getContent: (segmento: Segment, painPoint: string, _config: EmailGenerationConfig) => {
    const shortName = getShortSegmentName(segmento);
    return `
      <p>Olá ${EGOI_NAME_VAR},</p>
      <p>Notei que sua empresa atua no segmento de <strong>${shortName}</strong> e sei que ${painPoint} é um desafio constante nesse setor.</p>
      <p>Na Deal, temos ajudado empresas como a sua a superar esses desafios através de soluções personalizadas de tecnologia e consultoria.</p>
      <p>Gostaria de agendar uma conversa rápida de 15 minutos para entender melhor o cenário atual da sua empresa?</p>
    `;
  },
};

// Email 2: Case de sucesso (usa case selecionado ou automático)
const emailTemplate2 = {
  subject: (segmento: Segment, config: EmailGenerationConfig) => {
    const successCase = getBestCaseForSegment(segmento, config.selectedCaseResultType);
    if (!successCase) return `Resultados reais em transformação digital`;
    return `Case ${successCase.empresa}: resultados reais em transformação digital`;
  },
  getContent: (segmento: Segment, _painPoint: string, config: EmailGenerationConfig) => {
    const successCase = getBestCaseForSegment(segmento, config.selectedCaseResultType);
    
    if (!successCase) {
      return `
        <p>Olá ${EGOI_NAME_VAR},</p>
        <p>Gostaria de compartilhar alguns resultados que alcançamos com nossos clientes em transformação digital.</p>
        <p>Acredito que podemos alcançar resultados similares para sua empresa. Posso compartilhar mais detalhes?</p>
      `;
    }

    const resultadosHTML = successCase.resultados
      .slice(0, 4) // Máximo 4 resultados
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

// Email 3: Material exclusivo (seleção automática baseada no contexto)
const emailTemplate3 = {
  subject: (segmento: Segment, config: EmailGenerationConfig) => {
    const material = selectBestMaterialForSegment(segmento, config.companyContext);
    return `${EGOI_NAME_VAR}, material exclusivo: ${material.titulo}`;
  },
  getContent: (segmento: Segment, _painPoint: string, config: EmailGenerationConfig) => {
    const material = selectBestMaterialForSegment(segmento, config.companyContext);
    
    const topicosHTML = material.topicos
      .slice(0, 5) // Máximo 5 tópicos
      .map(t => `<li>${t}</li>`)
      .join('\n          ');
    
    return `
      <p>Olá ${EGOI_NAME_VAR},</p>
      <p>Preparamos um material exclusivo: <strong>"${material.titulo}"</strong></p>
      <p>Neste conteúdo você vai encontrar:</p>
      <ul style="margin: 15px 0; padding-left: 20px;">
        ${topicosHTML}
      </ul>
      <p>Este material foi desenvolvido com base em nossa experiência com mais de 200 clientes e cases reais de sucesso.</p>
      <p>Gostaria de receber esse material? Posso enviá-lo diretamente para você.</p>
    `;
  },
};

// Email 4: Última tentativa
const emailTemplate4 = {
  subject: (_segmento: Segment, _config: EmailGenerationConfig) => 
    `Última tentativa: vamos conversar, ${EGOI_NAME_VAR}?`,
  getContent: (_segmento: Segment, painPoint: string, _config: EmailGenerationConfig) => `
    <p>Olá ${EGOI_NAME_VAR},</p>
    <p>Sei que sua agenda deve estar bastante cheia, mas acredito que uma conversa rápida sobre ${painPoint} pode trazer insights valiosos para sua empresa.</p>
    <p>Se não for o momento ideal, sem problemas! Posso entrar em contato em uma data mais conveniente.</p>
    <p>Quando seria um bom momento para conversarmos?</p>
  `,
};

interface EmailTemplate {
  subject: (segmento: Segment, config: EmailGenerationConfig) => string;
  getContent: (segmento: Segment, painPoint: string, config: EmailGenerationConfig) => string;
}

const EMAIL_TEMPLATES: EmailTemplate[] = [
  emailTemplate1 as EmailTemplate,
  emailTemplate2,
  emailTemplate3,
  emailTemplate4 as EmailTemplate,
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

// Gera 4 templates de email para um segmento com configuração
export function generateSegmentEmailTemplates(
  segment: Segment,
  config?: Partial<EmailGenerationConfig>
): NurturingEmail[] {
  const painPoints = SEGMENT_PAIN_POINTS[segment];
  const fullConfig: EmailGenerationConfig = {
    segment,
    ...config,
  };
  
  return EMAIL_TEMPLATES.map((template, index) => {
    const painPoint = painPoints[index % painPoints.length];
    const subject = template.subject(segment, fullConfig);
    const bodyContent = template.getContent(segment, painPoint, fullConfig);
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

// Mantém compatibilidade - agora gera templates por segmento
export function generateAllEmailsForSegment(
  _contacts: EmailContact[],
  segment: Segment,
  config?: Partial<EmailGenerationConfig>
): NurturingEmail[] {
  return generateSegmentEmailTemplates(segment, config);
}

// Exporta todos os segmentos disponíveis
export const ALL_SEGMENTS: Segment[] = [
  'Mercado Financeiro',
  'Agro/relacionados',
  'Varejo',
  'Tech/Indústria/Inovação',
  'Outros',
];

// ============ FUNÇÕES PARA UI DE SELEÇÃO ============

// Retorna os tipos de resultado de case disponíveis para um segmento
export function getCaseResultTypesForSegment(segment: Segment): {
  type: CaseResultType;
  label: string;
  casesCount: number;
}[] {
  const availableTypes = getAvailableResultTypes(segment);
  return availableTypes.map(type => ({
    type,
    label: RESULT_TYPE_LABELS[type],
    casesCount: getCasesBySegment(segment).filter(c => c.tipoResultado.includes(type)).length,
  }));
}

// Retorna os materiais disponíveis para um segmento
export function getMaterialsForSegment(segment: Segment): RichMaterial[] {
  return getMaterialsBySegment(segment);
}

// Retorna o case que será usado para um segmento e tipo
export function getPreviewCase(
  segment: Segment, 
  resultType?: CaseResultType
): SuccessCase | undefined {
  return getBestCaseForSegment(segment, resultType);
}

// Retorna o material que será usado para um segmento
export function getPreviewMaterial(
  segment: Segment,
  companyContext?: string
): RichMaterial {
  return selectBestMaterialForSegment(segment, companyContext);
}

// Re-exporta tipos e funções úteis
export type { CaseResultType, SuccessCase } from '@/data/successCases';
export type { RichMaterial } from '@/data/richMaterials';
export { RESULT_TYPE_LABELS } from '@/data/successCases';
