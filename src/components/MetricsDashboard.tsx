import { useState, useCallback } from 'react';
import { CampaignMetrics, Segment, ValidationError } from '@/types/email';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, Mail, MousePointer, AlertTriangle, Send, FileSpreadsheet, Calendar, Users, RefreshCw, Image, Loader2, LogOut, Check, Edit2 } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { ErrorList } from './ErrorList';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { extractMetricsFromImage, calculateRates, ExtractedMetrics } from '@/utils/imageMetricsParser';

interface MetricsDashboardProps {
  metrics: CampaignMetrics[];
  errors?: ValidationError[];
  onFileLoad?: (content: string) => void;
  isLoading?: boolean;
}

const SEGMENT_COLORS: Record<Segment, string> = {
  'Mercado Financeiro': 'hsl(217, 91%, 45%)',
  'Agro/relacionados': 'hsl(142, 76%, 36%)',
  'Varejo': 'hsl(280, 65%, 55%)',
  'Tech/Indústria/Inovação': 'hsl(199, 89%, 48%)',
  'Outros': 'hsl(220, 10%, 50%)',
};

interface ManualMetrics {
  enviados: number;
  entregues: number;
  aberturasUnicas: number;
  cliquesUnicos: number;
  remocoes: number;
  bounces: number;
}

export function MetricsDashboard({ metrics, errors = [], onFileLoad, isLoading }: MetricsDashboardProps) {
  const [showUploader, setShowUploader] = useState(metrics.length === 0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [extractedMetrics, setExtractedMetrics] = useState<ExtractedMetrics | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [manualValues, setManualValues] = useState<ManualMetrics>({
    enviados: 0,
    entregues: 0,
    aberturasUnicas: 0,
    cliquesUnicos: 0,
    remocoes: 0,
    bounces: 0,
  });

  const handleImageUpload = useCallback(async (file: File) => {
    setImageFile(file);
    setOcrError(null);
    setExtractedMetrics(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    
    // Process with OCR
    setIsProcessingImage(true);
    try {
      const result = await extractMetricsFromImage(file);
      if (result.error) {
        setOcrError(result.error);
      } else if (result.metrics) {
        setExtractedMetrics(result.metrics);
        setManualValues({
          enviados: result.metrics.enviados,
          entregues: result.metrics.entregues,
          aberturasUnicas: result.metrics.aberturasUnicas,
          cliquesUnicos: result.metrics.cliquesUnicos,
          remocoes: result.metrics.remocoes,
          bounces: result.metrics.bounces,
        });
      }
    } catch (err) {
      setOcrError('Erro ao processar imagem. Tente novamente.');
    } finally {
      setIsProcessingImage(false);
    }
  }, []);

  const handleFileUpload = useCallback((content: string, file?: File) => {
    // Check if it's an image file
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
      return;
    }
    // Otherwise, pass to CSV parser
    if (onFileLoad) {
      onFileLoad(content);
      setShowUploader(false);
    }
  }, [onFileLoad, handleImageUpload]);

  const handleManualValueChange = useCallback((field: keyof ManualMetrics, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setManualValues(prev => ({ ...prev, [field]: numValue }));
  }, []);

  const handleConfirmValues = useCallback(() => {
    const calculated = calculateRates(manualValues);
    setExtractedMetrics(calculated);
    setIsEditing(false);
  }, [manualValues]);

  const handleReset = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    setExtractedMetrics(null);
    setOcrError(null);
    setIsEditing(false);
    setManualValues({
      enviados: 0,
      entregues: 0,
      aberturasUnicas: 0,
      cliquesUnicos: 0,
      remocoes: 0,
      bounces: 0,
    });
  }, []);

  // Render image metrics view
  if (extractedMetrics || imagePreview) {
    return (
      <div className="space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Métricas Extraídas da Imagem
          </h3>
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Nova Importação
          </Button>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Image className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Imagem Processada</span>
              {imageFile && (
                <span className="text-xs text-muted-foreground">({imageFile.name})</span>
              )}
            </div>
            <img 
              src={imagePreview} 
              alt="Relatório E-goi" 
              className="max-w-full h-auto max-h-64 rounded-lg border border-border mx-auto"
            />
          </div>
        )}

        {/* Processing State */}
        {isProcessingImage && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <Loader2 className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-foreground font-medium">Processando imagem com OCR...</p>
            <p className="text-sm text-muted-foreground mt-1">Isso pode levar alguns segundos</p>
          </div>
        )}

        {/* OCR Error */}
        {ocrError && !isProcessingImage && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Não foi possível extrair automaticamente</p>
                <p className="text-sm text-muted-foreground mt-1">{ocrError}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Você pode inserir os valores manualmente abaixo:
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Manual Input or Results */}
        {!isProcessingImage && (ocrError || extractedMetrics) && (
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-foreground">Valores das Métricas</h4>
              {extractedMetrics && !isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit2 className="w-4 h-4" />
                  Editar Valores
                </Button>
              )}
              {isEditing && (
                <Button size="sm" onClick={handleConfirmValues} className="gap-2">
                  <Check className="w-4 h-4" />
                  Confirmar
                </Button>
              )}
            </div>

            {(isEditing || ocrError) && !extractedMetrics ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enviados">Enviados</Label>
                  <Input
                    id="enviados"
                    type="number"
                    value={manualValues.enviados}
                    onChange={(e) => handleManualValueChange('enviados', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entregues">Entregues</Label>
                  <Input
                    id="entregues"
                    type="number"
                    value={manualValues.entregues}
                    onChange={(e) => handleManualValueChange('entregues', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aberturasUnicas">Aberturas Únicas</Label>
                  <Input
                    id="aberturasUnicas"
                    type="number"
                    value={manualValues.aberturasUnicas}
                    onChange={(e) => handleManualValueChange('aberturasUnicas', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cliquesUnicos">Cliques Únicos</Label>
                  <Input
                    id="cliquesUnicos"
                    type="number"
                    value={manualValues.cliquesUnicos}
                    onChange={(e) => handleManualValueChange('cliquesUnicos', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remocoes">Remoções</Label>
                  <Input
                    id="remocoes"
                    type="number"
                    value={manualValues.remocoes}
                    onChange={(e) => handleManualValueChange('remocoes', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bounces">Bounces</Label>
                  <Input
                    id="bounces"
                    type="number"
                    value={manualValues.bounces}
                    onChange={(e) => handleManualValueChange('bounces', e.target.value)}
                  />
                </div>
                <div className="col-span-full mt-4">
                  <Button onClick={handleConfirmValues} className="w-full gap-2">
                    <Check className="w-4 h-4" />
                    Calcular Taxas
                  </Button>
                </div>
              </div>
            ) : isEditing ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enviados">Enviados</Label>
                  <Input
                    id="enviados"
                    type="number"
                    value={manualValues.enviados}
                    onChange={(e) => handleManualValueChange('enviados', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entregues">Entregues</Label>
                  <Input
                    id="entregues"
                    type="number"
                    value={manualValues.entregues}
                    onChange={(e) => handleManualValueChange('entregues', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aberturasUnicas">Aberturas Únicas</Label>
                  <Input
                    id="aberturasUnicas"
                    type="number"
                    value={manualValues.aberturasUnicas}
                    onChange={(e) => handleManualValueChange('aberturasUnicas', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cliquesUnicos">Cliques Únicos</Label>
                  <Input
                    id="cliquesUnicos"
                    type="number"
                    value={manualValues.cliquesUnicos}
                    onChange={(e) => handleManualValueChange('cliquesUnicos', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remocoes">Remoções</Label>
                  <Input
                    id="remocoes"
                    type="number"
                    value={manualValues.remocoes}
                    onChange={(e) => handleManualValueChange('remocoes', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bounces">Bounces</Label>
                  <Input
                    id="bounces"
                    type="number"
                    value={manualValues.bounces}
                    onChange={(e) => handleManualValueChange('bounces', e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Enviados</p>
                  <p className="text-xl font-bold">{extractedMetrics?.enviados.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Entregues</p>
                  <p className="text-xl font-bold">{extractedMetrics?.entregues.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Aberturas Únicas</p>
                  <p className="text-xl font-bold">{extractedMetrics?.aberturasUnicas.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Cliques Únicos</p>
                  <p className="text-xl font-bold">{extractedMetrics?.cliquesUnicos.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Remoções</p>
                  <p className="text-xl font-bold">{extractedMetrics?.remocoes.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Bounces</p>
                  <p className="text-xl font-bold">{extractedMetrics?.bounces.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculated Rates */}
        {extractedMetrics && !isEditing && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="metric-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Send className="w-5 h-5 text-success" />
                  </div>
                  <span className="text-sm text-muted-foreground">Taxa Entrega</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{extractedMetrics.taxaEntrega.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {extractedMetrics.entregues} / {extractedMetrics.enviados}
                </p>
              </div>

              <div className="metric-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Taxa Abertura</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{extractedMetrics.taxaAbertura.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {extractedMetrics.aberturasUnicas} / {extractedMetrics.entregues}
                </p>
              </div>

              <div className="metric-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                    <MousePointer className="w-5 h-5 text-info" />
                  </div>
                  <span className="text-sm text-muted-foreground">Taxa Cliques</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{extractedMetrics.taxaCliques.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {extractedMetrics.cliquesUnicos} / {extractedMetrics.aberturasUnicas}
                </p>
              </div>

              <div className="metric-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-warning" />
                  </div>
                  <span className="text-sm text-muted-foreground">Taxa Saída</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{extractedMetrics.taxaSaida.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {extractedMetrics.remocoes} / {extractedMetrics.entregues}
                </p>
              </div>

              <div className="metric-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <span className="text-sm text-muted-foreground">Taxa Bounce</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{extractedMetrics.taxaBounce.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {extractedMetrics.bounces} / {extractedMetrics.entregues}
                </p>
              </div>
            </div>

            {/* Formulas Reference */}
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Fórmulas Utilizadas</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs text-muted-foreground">
                <p>Taxa Entrega = Entregues / Enviados</p>
                <p>Taxa Abertura = Aberturas Únicas / Entregues</p>
                <p>Taxa Cliques = Cliques Únicos / Aberturas Únicas</p>
                <p>Taxa Saída = Remoções / Entregues</p>
                <p>Taxa Bounce = Bounces / Entregues</p>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Show uploader state when metrics are loaded but user wants to reupload
  if (showUploader && metrics.length > 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Importar Novas Métricas
          </h3>
          <Button variant="outline" size="sm" onClick={() => setShowUploader(false)}>
            Cancelar
          </Button>
        </div>
        {onFileLoad && (
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Faça upload de um <strong>CSV</strong> da E-goi ou uma <strong>imagem/screenshot</strong> do relatório.
              Para imagens, usamos OCR para extrair os valores automaticamente.
            </p>
            <FileUploader 
              onFileLoad={(content, file) => handleFileUpload(content, file)} 
              isLoading={isLoading}
              acceptedTypes={['.csv', '.png', '.jpg', '.jpeg']}
            />
          </div>
        )}
        {errors.length > 0 && <ErrorList errors={errors} />}
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className="space-y-6">
        {onFileLoad && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileSpreadsheet className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Importar Métricas E-goi</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Faça upload de um <strong>CSV</strong> exportado da E-goi ou uma <strong>imagem/screenshot</strong> do relatório de campanha.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4 text-xs">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="font-medium text-foreground mb-1">📄 CSV</p>
                  <p className="text-muted-foreground">Importação automática de todas as campanhas</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="font-medium text-foreground mb-1">🖼️ Imagem</p>
                  <p className="text-muted-foreground">OCR extrai métricas de screenshots do E-goi</p>
                </div>
              </div>
              <FileUploader 
                onFileLoad={(content, file) => handleFileUpload(content, file)} 
                isLoading={isLoading}
                acceptedTypes={['.csv', '.png', '.jpg', '.jpeg']}
              />
            </div>
            
            {errors.length > 0 && <ErrorList errors={errors} />}
          </div>
        )}
        
        {!onFileLoad && (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma métrica de campanha disponível</p>
            <p className="text-sm text-muted-foreground mt-2">
              Importe um CSV ou screenshot da E-goi para visualizar o dashboard
            </p>
          </div>
        )}
      </div>
    );
  }

  // Aggregate totals - using new field names
  const totalEnviados = metrics.reduce((sum, m) => sum + (m.enviados || m.mensagensEnviadas), 0);
  const totalEntregues = metrics.reduce((sum, m) => sum + (m.entregues || (m.mensagensEnviadas - m.totalBounces)), 0);
  const totalAberturas = metrics.reduce((sum, m) => sum + m.aberturasUnicas, 0);
  const totalCliques = metrics.reduce((sum, m) => sum + m.cliquesUnicos, 0);
  const totalRemocoes = metrics.reduce((sum, m) => sum + (m.remocoes || 0), 0);
  const totalBounces = metrics.reduce((sum, m) => sum + (m.bounces || m.totalBounces), 0);
  
  // Calculate rates according to user's specifications
  const taxaEntregaGeral = totalEnviados > 0 ? (totalEntregues / totalEnviados) * 100 : 0;
  const taxaAberturaGeral = totalEntregues > 0 ? (totalAberturas / totalEntregues) * 100 : 0;
  const taxaCliquesGeral = totalAberturas > 0 ? (totalCliques / totalAberturas) * 100 : 0;
  const taxaSaidaGeral = totalEntregues > 0 ? (totalRemocoes / totalEntregues) * 100 : 0;
  const taxaBounceGeral = totalEntregues > 0 ? (totalBounces / totalEntregues) * 100 : 0;

  // Group by segment for charts
  const segmentAggregates = metrics.reduce((acc, m) => {
    if (!acc[m.segmento]) {
      acc[m.segmento] = {
        enviados: 0,
        entregues: 0,
        aberturas: 0,
        cliques: 0,
        remocoes: 0,
        bounces: 0,
        campanhas: 0,
      };
    }
    acc[m.segmento].enviados += m.enviados || m.mensagensEnviadas;
    acc[m.segmento].entregues += m.entregues || (m.mensagensEnviadas - m.totalBounces);
    acc[m.segmento].aberturas += m.aberturasUnicas;
    acc[m.segmento].cliques += m.cliquesUnicos;
    acc[m.segmento].remocoes += m.remocoes || 0;
    acc[m.segmento].bounces += m.bounces || m.totalBounces;
    acc[m.segmento].campanhas += 1;
    return acc;
  }, {} as Record<Segment, { enviados: number; entregues: number; aberturas: number; cliques: number; remocoes: number; bounces: number; campanhas: number }>);

  const chartData = Object.entries(segmentAggregates).map(([segmento, data]) => {
    return {
      name: segmento.split('/')[0],
      fullName: segmento,
      abertura: data.entregues > 0 ? (data.aberturas / data.entregues) * 100 : 0,
      cliques: data.aberturas > 0 ? (data.cliques / data.aberturas) * 100 : 0,
      campanhas: data.campanhas,
      enviados: data.enviados,
      color: SEGMENT_COLORS[segmento as Segment],
    };
  });

  const pieData = chartData.map(d => ({
    name: d.name,
    value: d.campanhas,
    color: d.color,
  }));

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Dashboard de Métricas E-goi
        </h3>
        <div className="flex items-center gap-4">
          {onFileLoad && (
            <Button variant="outline" size="sm" onClick={() => setShowUploader(true)} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Importar outro arquivo
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            {metrics.length} campanha{metrics.length !== 1 ? 's' : ''} importada{metrics.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Summary Cards - 5 cards with all rates */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Taxa Entrega</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{taxaEntregaGeral.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">{totalEntregues.toLocaleString()} / {totalEnviados.toLocaleString()}</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Taxa Abertura</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{taxaAberturaGeral.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">{totalAberturas.toLocaleString()} / {totalEntregues.toLocaleString()}</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-info" />
            </div>
            <span className="text-sm text-muted-foreground">Taxa Cliques</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{taxaCliquesGeral.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">{totalCliques.toLocaleString()} / {totalAberturas.toLocaleString()}</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">Taxa Saída</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{taxaSaidaGeral.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">{totalRemocoes.toLocaleString()} remoções</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-sm text-muted-foreground">Taxa Bounce</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{taxaBounceGeral.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">{totalBounces.toLocaleString()} bounces</p>
        </div>
      </div>

      {/* Formulas Reference */}
      <div className="rounded-xl border border-border bg-card/50 p-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Fórmulas Utilizadas</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs text-muted-foreground">
          <p>Taxa Entrega = Entregues / Enviados</p>
          <p>Taxa Abertura = Aberturas Únicas / Entregues</p>
          <p>Taxa Cliques = Cliques Únicos / Aberturas Únicas</p>
          <p>Taxa Saída = Remoções / Entregues</p>
          <p>Taxa Bounce = Bounces / Entregues</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h4 className="font-semibold text-foreground mb-4">Taxa de Abertura por Segmento</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Abertura']}
                  labelFormatter={(label) => chartData.find(d => d.name === label)?.fullName || label}
                />
                <Bar dataKey="abertura" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h4 className="font-semibold text-foreground mb-4">Campanhas por Segmento</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Detalhes por Campanha
          </h4>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome Interno</TableHead>
                <TableHead>Segmento</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Enviados</TableHead>
                <TableHead className="text-right">Entregues</TableHead>
                <TableHead className="text-right">Aberturas</TableHead>
                <TableHead className="text-right">Cliques</TableHead>
                <TableHead className="text-right">% Entrega</TableHead>
                <TableHead className="text-right">% Abertura</TableHead>
                <TableHead className="text-right">% Cliques</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric, index) => (
                <TableRow key={metric.id || index}>
                  <TableCell className="font-medium max-w-[200px] truncate" title={metric.nomeInterno}>
                    {metric.nomeInterno}
                  </TableCell>
                  <TableCell>
                    <span 
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${SEGMENT_COLORS[metric.segmento]}20`,
                        color: SEGMENT_COLORS[metric.segmento]
                      }}
                    >
                      {metric.segmento}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{metric.data}</TableCell>
                  <TableCell className="text-right">{(metric.enviados || metric.mensagensEnviadas).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{(metric.entregues || (metric.mensagensEnviadas - metric.totalBounces)).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{metric.aberturasUnicas.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{metric.cliquesUnicos.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-success">{metric.taxaEntrega.toFixed(1)}%</TableCell>
                  <TableCell className="text-right text-primary">{metric.taxaAbertura.toFixed(1)}%</TableCell>
                  <TableCell className="text-right text-info">{metric.taxaCliques.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Segment Summary Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4" />
            Resumo por Segmento
          </h4>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segmento</TableHead>
                <TableHead className="text-right">Campanhas</TableHead>
                <TableHead className="text-right">Total Enviados</TableHead>
                <TableHead className="text-right">% Abertura</TableHead>
                <TableHead className="text-right">% Cliques</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((data) => (
                <TableRow key={data.fullName}>
                  <TableCell className="font-medium">{data.fullName}</TableCell>
                  <TableCell className="text-right">{data.campanhas}</TableCell>
                  <TableCell className="text-right">{data.enviados.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-primary">{data.abertura.toFixed(1)}%</TableCell>
                  <TableCell className="text-right text-info">{data.cliques.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
