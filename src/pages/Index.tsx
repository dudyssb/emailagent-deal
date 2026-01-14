import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar, TabType } from '@/components/Sidebar';
import { FileUploader } from '@/components/FileUploader';
import { SegmentStats } from '@/components/SegmentStats';
import { ErrorList } from '@/components/ErrorList';
import { ContactsTable } from '@/components/ContactsTable';
import { EmailPreview } from '@/components/EmailPreview';
import { MetricsDashboard } from '@/components/MetricsDashboard';
import { ExportPanel } from '@/components/ExportPanel';
import { parseCSV, parseMetricsCSV } from '@/utils/csvParser';
import { generateAllEmailsForSegment } from '@/utils/emailGenerator';
import { EmailContact, ValidationError, Segment, CampaignMetrics, NurturingEmail } from '@/types/email';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Upload } from 'lucide-react';

export default function Index() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('import');
  const [contacts, setContacts] = useState<EmailContact[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [segmentCounts, setSegmentCounts] = useState<Record<Segment, number>>({
    'Mercado Financeiro': 0,
    'Agro/relacionados': 0,
    'Varejo': 0,
    'Tech/Indústria/Inovação': 0,
    'Outros': 0,
  });
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [generatedEmails, setGeneratedEmails] = useState<NurturingEmail[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [metrics, setMetrics] = useState<CampaignMetrics[]>([]);
  const [metricsErrors, setMetricsErrors] = useState<ValidationError[]>([]);
  const [isProcessingMetrics, setIsProcessingMetrics] = useState(false);

  const handleFileLoad = useCallback((content: string) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const result = parseCSV(content);
      setContacts(result.contacts);
      setErrors(result.errors);
      setSegmentCounts(result.segmentCounts);
      setIsProcessing(false);
      
      if (result.contacts.length > 0 && result.errors.length === 0) {
        setActiveTab('contacts');
      }
    }, 500);
  }, []);

  const handleSegmentSelect = useCallback((segment: Segment) => {
    setSelectedSegment(segment === selectedSegment ? null : segment);
  }, [selectedSegment]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleGenerateEmails = useCallback(() => {
    if (!selectedSegment) return;
    
    const emails = generateAllEmailsForSegment(contacts, selectedSegment);
    setGeneratedEmails(emails);
    setActiveTab('emails');
  }, [contacts, selectedSegment]);

  const handleMetricsFileLoad = useCallback((content: string) => {
    setIsProcessingMetrics(true);
    
    setTimeout(() => {
      const result = parseMetricsCSV(content);
      setMetrics(result.metrics);
      setMetricsErrors(result.errors);
      setIsProcessingMetrics(false);
    }, 500);
  }, []);

  const hasData = contacts.length > 0;

  const renderContent = () => {
    switch (activeTab) {
      case 'import':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Importar Base de E-mails</h2>
              <p className="text-muted-foreground">
                Faça upload de um arquivo CSV com as colunas <code className="bg-muted px-1.5 py-0.5 rounded text-sm">nome</code> e{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm">email</code> para iniciar a análise.
              </p>
            </div>

            <FileUploader onFileLoad={handleFileLoad} isLoading={isProcessing} />

            {errors.length > 0 && <ErrorList errors={errors} />}

            {hasData && (
              <div className="grid lg:grid-cols-2 gap-6">
                <SegmentStats
                  segmentCounts={segmentCounts}
                  onSegmentSelect={handleSegmentSelect}
                  selectedSegment={selectedSegment}
                />

                {selectedSegment && (
                  <div className="flex flex-col justify-center items-center p-8 rounded-xl border border-primary/20 bg-primary/5">
                    <Sparkles className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Gerar E-mails para {selectedSegment.split('/')[0]}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {segmentCounts[selectedSegment]} contatos serão nutridos com 4 e-mails personalizados cada.
                    </p>
                    <Button onClick={handleGenerateEmails} size="lg">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gerar E-mails de Nutrição
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Contatos Segmentados</h2>
                <p className="text-muted-foreground">
                  Visualize e filtre os contatos por segmento de mercado.
                </p>
              </div>
              {selectedSegment && (
                <Button onClick={handleGenerateEmails}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar E-mails
                </Button>
              )}
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <SegmentStats
                  segmentCounts={segmentCounts}
                  onSegmentSelect={handleSegmentSelect}
                  selectedSegment={selectedSegment}
                />
              </div>
              <div className="lg:col-span-3">
                <ContactsTable contacts={contacts} selectedSegment={selectedSegment} />
              </div>
            </div>
          </div>
        );

      case 'emails':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">E-mails de Nutrição</h2>
              <p className="text-muted-foreground">
                Visualize e baixe os e-mails gerados para importação no E-goi.
              </p>
            </div>

            {generatedEmails.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum e-mail gerado</h3>
                <p className="text-muted-foreground mb-4">
                  Selecione um segmento na aba de contatos e clique em "Gerar E-mails".
                </p>
                <Button onClick={() => setActiveTab('contacts')}>
                  <Upload className="w-4 h-4 mr-2" />
                  Ir para Contatos
                </Button>
              </div>
            ) : (
              <EmailPreview emails={generatedEmails} />
            )}
          </div>
        );

      case 'metrics':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Métricas de Campanha</h2>
              <p className="text-muted-foreground">
                Importe um CSV com métricas ou visualize o dashboard de desempenho.
              </p>
            </div>
            <MetricsDashboard 
              metrics={metrics} 
              errors={metricsErrors}
              onFileLoad={handleMetricsFileLoad}
              isLoading={isProcessingMetrics}
            />
          </div>
        );

      case 'export':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Exportar Dados</h2>
              <p className="text-muted-foreground">
                Baixe planilhas CSV por segmento e e-mails HTML para importação.
              </p>
            </div>
            <ExportPanel
              contacts={contacts}
              emails={generatedEmails}
              segmentCounts={segmentCounts}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} hasData={hasData} onLogout={handleLogout} />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
