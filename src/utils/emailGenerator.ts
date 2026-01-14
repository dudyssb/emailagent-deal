import { EmailContact, NurturingEmail, Segment } from '@/types/email';

const SENDER_INFO = {
  name: 'Karine Casanova Soares',
  email: 'karine.soares@deal.com.br',
  phone: '(41) 99156-0342',
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

const EMAIL_TEMPLATES = [
  {
    subject: (contact: EmailContact) => 
      `${contact.nome}, uma parceria estratégica para ${contact.segmento}`,
    getContent: (contact: EmailContact, painPoint: string) => `
      <p>Olá ${contact.nome},</p>
      <p>Notei que sua empresa atua no segmento de <strong>${contact.segmento}</strong> e sei que ${painPoint} é um desafio constante nesse setor.</p>
      <p>Na Deal, temos ajudado empresas como a sua a superar esses desafios através de soluções personalizadas de tecnologia e consultoria.</p>
      <p>Gostaria de agendar uma conversa rápida de 15 minutos para entender melhor o cenário atual da sua empresa?</p>
    `,
  },
  {
    subject: (contact: EmailContact) => 
      `Case de sucesso: como empresas de ${contact.segmento} estão se transformando`,
    getContent: (contact: EmailContact, painPoint: string) => `
      <p>Olá ${contact.nome},</p>
      <p>Recentemente, ajudamos uma empresa do segmento de ${contact.segmento} a resolver desafios relacionados a ${painPoint}.</p>
      <p>O resultado? Redução de 40% nos custos operacionais e aumento de 25% na eficiência dos processos.</p>
      <p>Posso compartilhar mais detalhes sobre como alcançamos esses resultados?</p>
    `,
  },
  {
    subject: (contact: EmailContact) => 
      `${contact.nome}, insights exclusivos para ${contact.segmento}`,
    getContent: (contact: EmailContact, painPoint: string) => `
      <p>Olá ${contact.nome},</p>
      <p>Preparamos um material exclusivo com tendências e insights para o segmento de ${contact.segmento}, especialmente focado em ${painPoint}.</p>
      <p>Este conteúdo foi desenvolvido com base em nossa experiência com mais de 200 clientes do seu setor.</p>
      <p>Gostaria de receber esse material? Posso enviá-lo diretamente para você.</p>
    `,
  },
  {
    subject: (contact: EmailContact) => 
      `Última tentativa: vamos conversar, ${contact.nome}?`,
    getContent: (contact: EmailContact, painPoint: string) => `
      <p>Olá ${contact.nome},</p>
      <p>Sei que sua agenda deve estar bastante cheia, mas acredito que uma conversa rápida sobre ${painPoint} pode trazer insights valiosos para sua empresa.</p>
      <p>Se não for o momento ideal, sem problemas! Posso entrar em contato em uma data mais conveniente.</p>
      <p>Quando seria um bom momento para conversarmos?</p>
    `,
  },
];

function generateEmailHTML(
  subject: string,
  bodyContent: string,
  contact: EmailContact
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

export function generateNurturingEmails(contact: EmailContact): NurturingEmail[] {
  const painPoints = SEGMENT_PAIN_POINTS[contact.segmento || 'Outros'];
  
  return EMAIL_TEMPLATES.map((template, index) => {
    const painPoint = painPoints[index % painPoints.length];
    const subject = template.subject(contact);
    const bodyContent = template.getContent(contact, painPoint);
    const htmlContent = generateEmailHTML(subject, bodyContent, contact);

    return {
      id: `${contact.email}-${index + 1}`,
      subject,
      htmlContent,
      targetContact: contact,
      sequence: index + 1,
    };
  });
}

export function generateAllEmailsForSegment(
  contacts: EmailContact[],
  segment: Segment
): NurturingEmail[] {
  const segmentContacts = contacts.filter(c => c.segmento === segment);
  return segmentContacts.flatMap(contact => generateNurturingEmails(contact));
}
