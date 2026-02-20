import { useState } from 'react';
import { NurturingEmail, Segment } from '@/types/email';
import { SegmentBadge } from './SegmentBadge';
import { History, Trash2, ChevronDown, ChevronUp, Mail, Calendar, Users } from 'lucide-react';
import { Button } from './ui/button';

interface HistoryEntry {
  id: string;
  date: string;
  segment: Segment;
  contactCount: number;
  emails: NurturingEmail[];
  caseUsed?: string;
}

interface EmailHistoryProps {
  entries: HistoryEntry[];
  onClear: () => void;
}

export function EmailHistory({ entries, onClear }: EmailHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum histórico</h3>
        <p className="text-muted-foreground">
          Os emails gerados aparecerão aqui automaticamente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{entries.length} geração(ões) salvas</p>
        <Button variant="outline" size="sm" onClick={onClear} className="gap-2 text-destructive hover:text-destructive">
          <Trash2 className="w-4 h-4" />
          Limpar histórico
        </Button>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => {
          const isExpanded = expandedId === entry.id;
          const date = new Date(entry.date);

          return (
            <div key={entry.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <SegmentBadge segment={entry.segment} size="sm" />
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {date.toLocaleDateString('pt-BR')} {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {entry.contactCount} contatos
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {entry.emails.length} emails
                    </span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>

              {isExpanded && (
                <div className="border-t border-border p-4 space-y-3">
                  {entry.emails.map((email) => (
                    <div key={email.id} className="rounded-lg border border-border p-3 bg-muted/20">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-primary">Email {email.sequence}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{email.subject}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
