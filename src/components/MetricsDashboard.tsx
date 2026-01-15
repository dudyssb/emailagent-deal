import { CampaignMetrics, Segment, ValidationError } from '@/types/email';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, Mail, MousePointer, AlertTriangle, Send, FileSpreadsheet, Calendar, Users, RefreshCw } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { ErrorList } from './ErrorList';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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

export function MetricsDashboard({ metrics, errors = [], onFileLoad, isLoading }: MetricsDashboardProps) {
  const [showUploader, setShowUploader] = useState(metrics.length === 0);

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
              Faça upload do CSV exportado da E-goi. O arquivo pode conter quaisquer colunas, mas identificamos automaticamente:{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs">mensagens enviadas</code> ou{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs">emails enviados</code> para calcular taxas.
            </p>
            <FileUploader 
              onFileLoad={(content) => {
                onFileLoad(content);
                setShowUploader(false);
              }} 
              isLoading={isLoading}
              acceptedTypes={['.csv', '.pdf']}
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
                Faça upload do CSV ou PDF exportado da E-goi. O arquivo pode conter quaisquer colunas - 
                identificamos automaticamente os dados disponíveis. Para calcular taxas, buscamos por:{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">mensagens enviadas</code> ou{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">emails enviados</code>.
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                O segmento será identificado automaticamente a partir do campo "nome interno" da campanha.
              </p>
              <FileUploader 
                onFileLoad={onFileLoad} 
                isLoading={isLoading}
                acceptedTypes={['.csv', '.pdf']}
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
              Importe um CSV da E-goi para visualizar o dashboard
            </p>
          </div>
        )}
      </div>
    );
  }

  // Aggregate totals
  const totalMensagens = metrics.reduce((sum, m) => sum + m.mensagensEnviadas, 0);
  const totalAberturas = metrics.reduce((sum, m) => sum + m.aberturasUnicas, 0);
  const totalCliques = metrics.reduce((sum, m) => sum + m.cliquesUnicos, 0);
  const totalBounces = metrics.reduce((sum, m) => sum + m.totalBounces, 0);
  const entregues = totalMensagens - totalBounces;
  
  const taxaEntregaGeral = totalMensagens > 0 ? (entregues / totalMensagens) * 100 : 0;
  const taxaAberturaGeral = entregues > 0 ? (totalAberturas / entregues) * 100 : 0;
  const taxaCliquesGeral = entregues > 0 ? (totalCliques / entregues) * 100 : 0;

  // Group by segment for charts
  const segmentAggregates = metrics.reduce((acc, m) => {
    if (!acc[m.segmento]) {
      acc[m.segmento] = {
        mensagens: 0,
        aberturas: 0,
        cliques: 0,
        bounces: 0,
        campanhas: 0,
      };
    }
    acc[m.segmento].mensagens += m.mensagensEnviadas;
    acc[m.segmento].aberturas += m.aberturasUnicas;
    acc[m.segmento].cliques += m.cliquesUnicos;
    acc[m.segmento].bounces += m.totalBounces;
    acc[m.segmento].campanhas += 1;
    return acc;
  }, {} as Record<Segment, { mensagens: number; aberturas: number; cliques: number; bounces: number; campanhas: number }>);

  const chartData = Object.entries(segmentAggregates).map(([segmento, data]) => {
    const entregues = data.mensagens - data.bounces;
    return {
      name: segmento.split('/')[0],
      fullName: segmento,
      abertura: entregues > 0 ? (data.aberturas / entregues) * 100 : 0,
      cliques: entregues > 0 ? (data.cliques / entregues) * 100 : 0,
      campanhas: data.campanhas,
      mensagens: data.mensagens,
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

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Taxa de Entrega</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{taxaEntregaGeral.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">{entregues.toLocaleString()} de {totalMensagens.toLocaleString()}</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Taxa de Abertura</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{taxaAberturaGeral.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">{totalAberturas.toLocaleString()} aberturas únicas</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-info" />
            </div>
            <span className="text-sm text-muted-foreground">Taxa de Cliques</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{taxaCliquesGeral.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">{totalCliques.toLocaleString()} cliques únicos</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-sm text-muted-foreground">Total Bounces</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalBounces.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Hard + Soft bounces</p>
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
                <TableHead className="text-right">Aberturas</TableHead>
                <TableHead className="text-right">Cliques</TableHead>
                <TableHead className="text-right">Bounces</TableHead>
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
                  <TableCell className="text-right">{metric.mensagensEnviadas.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{metric.aberturasUnicas.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{metric.cliquesUnicos.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-destructive">
                    {metric.totalBounces.toLocaleString()}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({metric.hardBounces}h / {metric.softBounces}s)
                    </span>
                  </TableCell>
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
                <TableHead className="text-right">% Abertura Média</TableHead>
                <TableHead className="text-right">% Cliques Média</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((data) => (
                <TableRow key={data.fullName}>
                  <TableCell className="font-medium">{data.fullName}</TableCell>
                  <TableCell className="text-right">{data.campanhas}</TableCell>
                  <TableCell className="text-right">{data.mensagens.toLocaleString()}</TableCell>
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
