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
 * Parse the OCR text to extract E-goi metrics
 */
function parseEgoiText(text: string): ExtractedMetrics | null {
  // Normalize text: lowercase, remove extra spaces
  const normalized = text.toLowerCase().replace(/\s+/g, ' ');
  
  console.log('OCR Raw Text:', text);
  console.log('Normalized:', normalized);

  // Patterns to match E-goi report format
  // "ENVIADOS" section - just the main number
  const enviadosPatterns = [
    /enviados\s*[\n\r\s]*(\d+)/i,
    /enviados[^\d]*(\d+)/i,
    /(\d+)\s*enviados/i,
  ];

  // "X contactos" patterns for each metric
  const entreguesPatterns = [
    /entregues[^\d]*[\d,\.]+\s*%[^\d]*(\d+)\s*contactos/i,
    /entregues[^\d]*(\d+)\s*contactos/i,
    /taxa\s*de\s*entrega[^\d]*(\d+)\s*contactos/i,
  ];

  const aberturasPatterns = [
    /aberturas\s*[úu]nicas[^\d]*[\d,\.]+\s*%[^\d]*(\d+)\s*contactos/i,
    /aberturas\s*[úu]nicas[^\d]*(\d+)\s*contactos/i,
    /(\d+)\s*contactos[^\n]*aberturas/i,
  ];

  const cliquesPatterns = [
    /cliques\s*[úu]nicos[^\d]*[\d,\.]+\s*%[^\d]*(\d+)\s*contactos/i,
    /cliques\s*[úu]nicos[^\d]*(\d+)\s*contactos/i,
    /(\d+)\s*contactos[^\n]*cliques/i,
  ];

  const remocoesPatterns = [
    /remo[çc][õo]es[^\d]*[\d,\.]+\s*%[^\d]*(\d+)\s*contactos/i,
    /remo[çc][õo]es[^\d]*(\d+)\s*contactos/i,
    /(\d+)\s*contactos[^\n]*remo[çc]/i,
  ];

  const bouncesPatterns = [
    /bounces[^\d]*[\d,\.]+\s*%[^\d]*(\d+)\s*contactos/i,
    /bounces[^\d]*(\d+)\s*contactos/i,
    /(\d+)\s*contactos[^\n]*bounce/i,
  ];

  // Try to extract each metric
  let enviados: number | null = null;
  let entregues: number | null = null;
  let aberturasUnicas: number | null = null;
  let cliquesUnicos: number | null = null;
  let remocoes: number | null = null;
  let bounces: number | null = null;

  for (const pattern of enviadosPatterns) {
    enviados = extractContactsNumber(text, pattern);
    if (enviados !== null) break;
  }

  for (const pattern of entreguesPatterns) {
    entregues = extractContactsNumber(text, pattern);
    if (entregues !== null) break;
  }

  for (const pattern of aberturasPatterns) {
    aberturasUnicas = extractContactsNumber(text, pattern);
    if (aberturasUnicas !== null) break;
  }

  for (const pattern of cliquesPatterns) {
    cliquesUnicos = extractContactsNumber(text, pattern);
    if (cliquesUnicos !== null) break;
  }

  for (const pattern of remocoesPatterns) {
    remocoes = extractContactsNumber(text, pattern);
    if (remocoes !== null) break;
  }

  for (const pattern of bouncesPatterns) {
    bounces = extractContactsNumber(text, pattern);
    if (bounces !== null) break;
  }

  console.log('Extracted values:', { enviados, entregues, aberturasUnicas, cliquesUnicos, remocoes, bounces });

  // If we couldn't extract the minimum required metrics, return null
  if (enviados === null) {
    return null;
  }

  // Use defaults for missing values
  const finalMetrics = {
    enviados: enviados ?? 0,
    entregues: entregues ?? 0,
    aberturasUnicas: aberturasUnicas ?? 0,
    cliquesUnicos: cliquesUnicos ?? 0,
    remocoes: remocoes ?? 0,
    bounces: bounces ?? 0,
    // Calculate rates
    taxaEntrega: 0,
    taxaAbertura: 0,
    taxaCliques: 0,
    taxaSaida: 0,
    taxaBounce: 0,
  };

  // Calculate rates according to user's specifications
  if (finalMetrics.enviados > 0) {
    finalMetrics.taxaEntrega = (finalMetrics.entregues / finalMetrics.enviados) * 100;
  }
  if (finalMetrics.entregues > 0) {
    finalMetrics.taxaAbertura = (finalMetrics.aberturasUnicas / finalMetrics.entregues) * 100;
    finalMetrics.taxaSaida = (finalMetrics.remocoes / finalMetrics.entregues) * 100;
    finalMetrics.taxaBounce = (finalMetrics.bounces / finalMetrics.entregues) * 100;
  }
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
