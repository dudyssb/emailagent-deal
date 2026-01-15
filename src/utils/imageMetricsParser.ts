import Tesseract from 'tesseract.js';

export interface ExtractedMetrics {
  enviados: number;
  entregues: number;
  aberturasUnicas: number;
  cliquesUnicos: number;
  remocoes: number;
  bounces: number;
  // Calculated rates
  taxaEntrega: number;
  taxaAbertura: number;
  taxaCliques: number;
  taxaSaida: number;
  taxaBounce: number;
}

export interface ExtractionResult {
  metrics: ExtractedMetrics | null;
  rawText: string;
  confidence: number;
  error?: string;
}

/**
 * Extracts the numeric value after a label pattern
 * E-goi format: "LABEL" followed by percentage, then "X contactos" below
 */
function extractContactsNumber(text: string, pattern: RegExp): number | null {
  const match = text.match(pattern);
  if (match) {
    const numStr = match[1].replace(/\./g, '').replace(',', '.');
    const num = parseInt(numStr, 10);
    return isNaN(num) ? null : num;
  }
  return null;
}

/**
 * Parse the OCR text to extract E-goi metrics using POSITION-BASED strategy
 * E-goi format: metrics appear in order: Enviados, Entregues, Aberturas Únicas, Cliques Únicos
 * Then in "qualidade" section: Remoções, Bounces
 */
function parseEgoiText(text: string): ExtractedMetrics | null {
  console.log('OCR Raw Text:', text);

  // 1. Normalize common OCR errors
  let normalized = text
    .replace(/ocontactos/gi, '0 contactos')  // OCR confuses "0" with "o"
    .replace(/Ocontactos/gi, '0 contactos')
    .replace(/O contactos/gi, '0 contactos')
    .replace(/o contactos/gi, '0 contactos')
    .replace(/\|/g, ' ')                      // Remove visual separators
    .replace(/[—–]/g, '-')                    // Normalize dashes
    .replace(/\s+/g, ' ');                    // Normalize spaces

  console.log('Normalized:', normalized);

  // 2. Extract "Enviados" - look for the main count (usually the first big number)
  let enviados: number | null = null;
  
  // Try various patterns for "Enviados"
  const enviadosPatterns = [
    /(\d+)\s*enviados/i,
    /enviados\s*(\d+)/i,
    /^(\d+)\s/,  // First number at start
  ];
  
  for (const pattern of enviadosPatterns) {
    const match = normalized.match(pattern);
    if (match) {
      enviados = parseInt(match[1].replace(/\./g, ''), 10);
      if (!isNaN(enviados) && enviados > 0) break;
    }
  }

  // 3. Extract ALL "X contactos" in the ORDER they appear
  const contactosRegex = /(\d+)\s*contactos/gi;
  const contactosMatches = [...normalized.matchAll(contactosRegex)];
  
  console.log('Found contactos matches:', contactosMatches.map(m => m[1]));

  // Map by POSITION (E-goi order: Entregues, Aberturas, Cliques)
  const entregues = contactosMatches[0] ? parseInt(contactosMatches[0][1].replace(/\./g, ''), 10) : 0;
  const aberturasUnicas = contactosMatches[1] ? parseInt(contactosMatches[1][1].replace(/\./g, ''), 10) : 0;
  const cliquesUnicos = contactosMatches[2] ? parseInt(contactosMatches[2][1].replace(/\./g, ''), 10) : 0;

  // 4. Extract "Métricas de qualidade" section (Remoções and Bounces)
  let remocoes = 0;
  let bounces = 0;

  // Try to find the "qualidade" section
  const qualidadeIndex = normalized.toLowerCase().indexOf('qualidade');
  
  if (qualidadeIndex > -1) {
    // Get text after "qualidade"
    const qualidadeSection = normalized.slice(qualidadeIndex);
    const qualidadeContatos = [...qualidadeSection.matchAll(contactosRegex)];
    
    console.log('Qualidade section contactos:', qualidadeContatos.map(m => m[1]));
    
    remocoes = qualidadeContatos[0] ? parseInt(qualidadeContatos[0][1].replace(/\./g, ''), 10) : 0;
    bounces = qualidadeContatos[1] ? parseInt(qualidadeContatos[1][1].replace(/\./g, ''), 10) : 0;
  } else if (contactosMatches.length >= 5) {
    // Fallback: if no "qualidade" section found, try 4th and 5th "contactos"
    remocoes = parseInt(contactosMatches[3]?.[1]?.replace(/\./g, '') || '0', 10);
    bounces = parseInt(contactosMatches[4]?.[1]?.replace(/\./g, '') || '0', 10);
  }

  // 5. Validate minimum data - we need at least "enviados"
  if (enviados === null || enviados === 0) {
    // Last resort: try first number in the text
    const firstNumberMatch = text.match(/(\d+)/);
    if (firstNumberMatch) {
      enviados = parseInt(firstNumberMatch[1], 10);
    }
    if (!enviados || enviados === 0) {
      return null;
    }
  }

  console.log('Extracted values:', { enviados, entregues, aberturasUnicas, cliquesUnicos, remocoes, bounces });

  // 6. Calculate rates according to specifications
  const finalMetrics: ExtractedMetrics = {
    enviados: enviados || 0,
    entregues: entregues || 0,
    aberturasUnicas: aberturasUnicas || 0,
    cliquesUnicos: cliquesUnicos || 0,
    remocoes: remocoes || 0,
    bounces: bounces || 0,
    // Calculate rates
    taxaEntrega: 0,
    taxaAbertura: 0,
    taxaCliques: 0,
    taxaSaida: 0,
    taxaBounce: 0,
  };

  // Taxa de Entrega = Entregues / Enviados
  if (finalMetrics.enviados > 0) {
    finalMetrics.taxaEntrega = (finalMetrics.entregues / finalMetrics.enviados) * 100;
  }
  // Taxa de Abertura = Aberturas Únicas / Entregues
  // Taxa de Saída = Remoções / Entregues
  // Taxa de Bounce = Bounces / Entregues
  if (finalMetrics.entregues > 0) {
    finalMetrics.taxaAbertura = (finalMetrics.aberturasUnicas / finalMetrics.entregues) * 100;
    finalMetrics.taxaSaida = (finalMetrics.remocoes / finalMetrics.entregues) * 100;
    finalMetrics.taxaBounce = (finalMetrics.bounces / finalMetrics.entregues) * 100;
  }
  // Taxa de Cliques = Cliques Únicos / Aberturas Únicas
  if (finalMetrics.aberturasUnicas > 0) {
    finalMetrics.taxaCliques = (finalMetrics.cliquesUnicos / finalMetrics.aberturasUnicas) * 100;
  }

  return finalMetrics;
}

/**
 * Process an image file and extract E-goi metrics using OCR
 */
export async function extractMetricsFromImage(imageFile: File): Promise<ExtractionResult> {
  try {
    // Convert File to base64 URL
    const imageUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });

    // Run OCR with Tesseract
    const result = await Tesseract.recognize(imageUrl, 'por', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    const rawText = result.data.text;
    const confidence = result.data.confidence;

    // Parse the extracted text
    const metrics = parseEgoiText(rawText);

    if (!metrics) {
      return {
        metrics: null,
        rawText,
        confidence,
        error: 'Não foi possível identificar as métricas na imagem. Verifique se a imagem contém um relatório E-goi válido.',
      };
    }

    return {
      metrics,
      rawText,
      confidence,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      metrics: null,
      rawText: '',
      confidence: 0,
      error: `Erro ao processar imagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
    };
  }
}

/**
 * Calculate rates from manually entered values
 */
export function calculateRates(values: {
  enviados: number;
  entregues: number;
  aberturasUnicas: number;
  cliquesUnicos: number;
  remocoes: number;
  bounces: number;
}): ExtractedMetrics {
  const metrics: ExtractedMetrics = {
    ...values,
    taxaEntrega: 0,
    taxaAbertura: 0,
    taxaCliques: 0,
    taxaSaida: 0,
    taxaBounce: 0,
  };

  // Taxa de Entrega = Entregues / Enviados
  if (metrics.enviados > 0) {
    metrics.taxaEntrega = (metrics.entregues / metrics.enviados) * 100;
  }

  // Taxa de Abertura = Aberturas Únicas / Entregues
  if (metrics.entregues > 0) {
    metrics.taxaAbertura = (metrics.aberturasUnicas / metrics.entregues) * 100;
    metrics.taxaSaida = (metrics.remocoes / metrics.entregues) * 100;
    metrics.taxaBounce = (metrics.bounces / metrics.entregues) * 100;
  }

  // Taxa de Cliques = Cliques Únicos / Aberturas Únicas
  if (metrics.aberturasUnicas > 0) {
    metrics.taxaCliques = (metrics.cliquesUnicos / metrics.aberturasUnicas) * 100;
  }

  return metrics;
}
