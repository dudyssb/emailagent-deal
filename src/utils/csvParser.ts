import { EmailContact, ValidationError, Segment, ProcessingResult } from '@/types/email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DOMAIN_SEGMENT_MAP: Record<string, Segment> = {
  // Financial
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
  
  // Agro
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
  
  // Varejo
  'loja': 'Varejo',
  'store': 'Varejo',
  'shop': 'Varejo',
  'magazine': 'Varejo',
  'mercado': 'Varejo',
  'supermercado': 'Varejo',
  'atacado': 'Varejo',
  'varejo': 'Varejo',
  'retail': 'Varejo',
  'comercio': 'Varejo',
  
  // Tech
  'tech': 'Tech/Indústria/Inovação',
  'tecnologia': 'Tech/Indústria/Inovação',
  'software': 'Tech/Indústria/Inovação',
  'sistemas': 'Tech/Indústria/Inovação',
  'digital': 'Tech/Indústria/Inovação',
  'cloud': 'Tech/Indústria/Inovação',
  'data': 'Tech/Indústria/Inovação',
  'labs': 'Tech/Indústria/Inovação',
  'dev': 'Tech/Indústria/Inovação',
  'io': 'Tech/Indústria/Inovação',
  'industria': 'Tech/Indústria/Inovação',
  'manufacturing': 'Tech/Indústria/Inovação',
  'inovacao': 'Tech/Indústria/Inovação',
  'startup': 'Tech/Indústria/Inovação',
};

export function categorizeByDomain(email: string): Segment {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  
  for (const [keyword, segment] of Object.entries(DOMAIN_SEGMENT_MAP)) {
    if (domain.includes(keyword)) {
      return segment;
    }
  }
  
  return 'Outros';
}

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function parseCSV(csvContent: string): ProcessingResult {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const contacts: EmailContact[] = [];
  const errors: ValidationError[] = [];
  const segmentCounts: Record<Segment, number> = {
    'Mercado Financeiro': 0,
    'Agro/relacionados': 0,
    'Varejo': 0,
    'Tech/Indústria/Inovação': 0,
    'Outros': 0,
  };

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
