import { NurturingEmail } from '@/types/email';
import { Mail, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface EmailPreviewProps {
  emails: NurturingEmail[];
}

export function EmailPreview({ emails }: EmailPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  if (emails.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Nenhum e-mail gerado ainda</p>
      </div>
    );
  }

  const currentEmail = emails[currentIndex];
  const uniqueContacts = [...new Set(emails.map(e => e.targetContact.email))];

  const handleDownload = () => {
    const blob = new Blob([currentEmail.htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email_${currentEmail.sequence}_${currentEmail.targetContact.nome.replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    emails.forEach((email, index) => {
      setTimeout(() => {
        const blob = new Blob([email.htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `email_${email.sequence}_${email.targetContact.nome.replace(/\s+/g, '_')}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }, index * 100);
    });
  };

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">E-mails de Nutrição</h3>
          <p className="text-sm text-muted-foreground">
            {emails.length} e-mails para {uniqueContacts.length} contatos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Ocultar' : 'Visualizar'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadAll}>
            <Download className="w-4 h-4 mr-2" />
            Baixar Todos
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">
              {currentIndex + 1} / {emails.length}
            </span>
            <button
              onClick={() => setCurrentIndex(Math.min(emails.length - 1, currentIndex + 1))}
              disabled={currentIndex === emails.length - 1}
              className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Email Info */}
        <div className="px-4 py-3 border-b border-border space-y-2">
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground w-16">Para:</span>
            <span className="text-sm font-medium">
              {currentEmail.targetContact.nome} &lt;{currentEmail.targetContact.email}&gt;
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground w-16">Assunto:</span>
            <span className="text-sm font-medium">{currentEmail.subject}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground w-16">Sequência:</span>
            <span className="text-sm">E-mail {currentEmail.sequence} de 4</span>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="p-4 bg-white">
            <iframe
              srcDoc={currentEmail.htmlContent}
              className="w-full h-[500px] border-0"
              title="Email Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}
