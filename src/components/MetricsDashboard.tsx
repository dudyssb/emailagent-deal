import { CampaignMetrics, Segment, ValidationError } from '@/types/email';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Mail, MousePointer, AlertTriangle, Send, Upload, FileSpreadsheet } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { ErrorList } from './ErrorList';

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
  if (metrics.length === 0) {
    return (
      <div className="space-y-6">
        {onFileLoad && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileSpreadsheet className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Importar Métricas de Campanha</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Faça upload de um CSV com as colunas: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">segmento</code>,{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">taxa_entrega</code>,{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">taxa_abertura</code>,{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">taxa_cliques</code>,{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">bounces</code>
              </p>
              <FileUploader onFileLoad={onFileLoad} isLoading={isLoading} />
            </div>
            
            {errors.length > 0 && <ErrorList errors={errors} />}
          </div>
        )}
        
        {!onFileLoad && (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma métrica de campanha disponível</p>
            <p className="text-sm text-muted-foreground mt-2">
              Importe um CSV com métricas para visualizar o dashboard
            </p>
          </div>
        )}
      </div>
    );
  }

  const totalEntrega = metrics.reduce((sum, m) => sum + m.taxa_entrega, 0) / metrics.length;
  const totalAbertura = metrics.reduce((sum, m) => sum + m.taxa_abertura, 0) / metrics.length;
  const totalCliques = metrics.reduce((sum, m) => sum + m.taxa_cliques, 0) / metrics.length;
  const totalBounces = metrics.reduce((sum, m) => sum + m.bounces, 0);

  const chartData = metrics.map(m => ({
    name: m.segmento.split('/')[0],
    entrega: m.taxa_entrega,
    abertura: m.taxa_abertura,
    cliques: m.taxa_cliques,
    color: SEGMENT_COLORS[m.segmento],
  }));

  return (
    <div className="space-y-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Dashboard de Métricas
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Taxa de Entrega</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalEntrega.toFixed(1)}%</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Taxa de Abertura</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalAbertura.toFixed(1)}%</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-info" />
            </div>
            <span className="text-sm text-muted-foreground">Taxa de Cliques</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalCliques.toFixed(1)}%</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-sm text-muted-foreground">Bounces</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalBounces}</p>
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
                <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
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
          <h4 className="font-semibold text-foreground mb-4">Taxa de Cliques por Segmento</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="cliques" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Segmento</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-foreground">Entrega</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-foreground">Abertura</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-foreground">Cliques</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-foreground">Bounces</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {metrics.map((metric) => (
                <tr key={metric.segmento} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{metric.segmento}</td>
                  <td className="px-4 py-3 text-right text-success">{metric.taxa_entrega.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right text-primary">{metric.taxa_abertura.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right text-info">{metric.taxa_cliques.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right text-destructive">{metric.bounces}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
