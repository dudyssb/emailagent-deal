import { EmailContact, Segment, NurturingEmail, ALL_SEGMENTS } from '@/types/email';
import { Download, FileText, Archive, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { exportToCSV } from '@/utils/csvParser';
import { SegmentBadge } from './SegmentBadge';
import { useState } from 'react';

interface ExportPanelProps {
  contacts: EmailContact[];
  emails: NurturingEmail[];
  segmentCounts: Record<Segment, number>;
}

export function ExportPanel({ contacts, emails, segmentCounts }: ExportPanelProps) {
  const [exportedFiles, setExportedFiles] = useState<string[]>([]);

  const downloadCSV = (content: string, filename: string) => {
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setExportedFiles(prev => [...prev, filename]);
  };

  const handleExportAll = () => {
    const csv = exportToCSV(contacts);
    downloadCSV(csv, 'base_segmentada_completa.csv');
  };

  const handleExportSegment = (segment: Segment) => {
    const segmentContacts = contacts.filter(c => c.segmento === segment);
    const csv = exportToCSV(segmentContacts);
    const filename = `segmento_${segment.replace(/[\/\s]/g, '_')}.csv`;
    downloadCSV(csv, filename);
  };

  const handleExportEmails = (segment: Segment) => {
    const segmentEmails = emails.filter(e => e.targetContact.segmento === segment);
    if (segmentEmails.length === 0) return;

    segmentEmails.forEach((email, index) => {
      setTimeout(() => {
        const blob = new Blob([email.htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `email_${email.sequence}_${email.targetContact.nome.replace(/\s+/g, '_')}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }, index * 50);
    });

    setExportedFiles(prev => [...prev, `emails_nutricao_${segment.replace(/[\/\s]/g, '_')}.zip`]);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Exportar Dados</h3>
        <p className="text-sm text-muted-foreground">
          Exporte planilhas segmentadas e e-mails de nutrição em formatos prontos para uso.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Base Completa</h4>
              <p className="text-sm text-muted-foreground">
                Exportar todos os {contacts.length} contatos segmentados
              </p>
            </div>
          </div>
          <Button onClick={handleExportAll}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Por Segmento</h4>
        
        {ALL_SEGMENTS.map((segment) => {
          const count = segmentCounts[segment] || 0;
          const segmentEmails = emails.filter(e => e.targetContact.segmento === segment);

          if (count === 0) return null;

          return (
            <div
              key={segment}
              className="rounded-xl border border-border bg-card p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <SegmentBadge segment={segment} size="md" />
                <span className="text-sm text-muted-foreground">
                  {count} contatos • {segmentEmails.length} e-mails
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExportSegment(segment)}>
                  <FileText className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                {segmentEmails.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => handleExportEmails(segment)}>
                    <Archive className="w-4 h-4 mr-2" />
                    E-mails
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {exportedFiles.length > 0 && (
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="font-medium text-success">Arquivos Exportados</span>
          </div>
          <div className="space-y-1">
            {exportedFiles.map((file, index) => (
              <p key={index} className="text-sm text-muted-foreground font-mono">
                ✓ {file}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
