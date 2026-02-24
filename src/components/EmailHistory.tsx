import { useState } from 'react';
import { NurturingEmail, Segment, EmailContact } from '@/types/email';
import { SegmentBadge } from './SegmentBadge';
import { History, Trash2, ChevronDown, ChevronUp, Mail, Calendar, Users, FileText, Search } from 'lucide-react';
import { Button } from './ui/button';

export interface HistoryEntry {
  id: string;
  date: string;
  type?: 'emails' | 'list' | 'presales';
  segment?: Segment;
  contactCount: number;
  emails?: NurturingEmail[];
  caseUsed?: string;
  listName?: string;
  contacts?: EmailContact[];
  preSalesData?: any[];
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
          Os emails gerados e listas salvas aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{entries.length} registro(s) salvo(s)</p>
        <Button variant="outline" size="sm" onClick={onClear} className="gap-2 text-destructive hover:text-destructive">
          <Trash2 className="w-4 h-4" />
          Limpar histórico
        </Button>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => {
          const isExpanded = expandedId === entry.id;
          const date = new Date(entry.date);
          const isList = entry.type === 'list';

          return (
            <div key={entry.id} className="rounded-xl border border-border bg-card overflow-hidden animate-scale-in">
              <button
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {isList ? (
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground text-sm">{entry.listName}</span>
                    </div>
                  ) : entry.type === 'presales' ? (
                    <div className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground text-sm">Pesquisa: Pré-vendas</span>
                    </div>
                  ) : (
                    entry.segment && <SegmentBadge segment={entry.segment} size="sm" />
                  )}

                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {date.toLocaleDateString('pt-BR')} {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {entry.contactCount} empresas
                    </span>
                    {entry.type === 'emails' && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        {entry.emails?.length || 0} emails
                      </span>
                    )}
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>

              {isExpanded && (
                <div className="border-t border-border p-4 space-y-3">
                  {isList ? (
                    <div className="space-y-4">
                      {(() => {
                        const counts = entry.contacts?.reduce((acc, contact) => {
                          const seg = contact.segmento || 'Não Segmentado';
                          acc[seg] = (acc[seg] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>);

                        return counts && Object.keys(counts).length > 0 ? (
                          <div className="flex flex-wrap gap-3 p-3 bg-muted/10 rounded-xl border border-border">
                            <div className="w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                              Resumo por Segmento
                            </div>
                            {Object.entries(counts)
                              .sort(([, a], [, b]) => b - a)
                              .map(([seg, count]) => (
                                <div key={seg} className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-full border border-border shadow-sm">
                                  {seg !== 'Não Segmentado' ? (
                                    <SegmentBadge segment={seg as Segment} size="sm" />
                                  ) : (
                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">Não Segmentado</span>
                                  )}
                                  <span className="text-xs font-bold">{count}</span>
                                </div>
                              ))}
                          </div>
                        ) : null;
                      })()}

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/50 border-b border-border">
                              <th className="text-left px-4 py-2 font-semibold">Nome</th>
                              <th className="text-left px-4 py-2 font-semibold">E-mail</th>
                              <th className="text-left px-4 py-2 font-semibold">Segmento</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entry.contacts?.slice(0, 50).map((c, i) => (
                              <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                                <td className="px-4 py-3">{c.nome}</td>
                                <td className="px-4 py-3 text-primary">{c.email}</td>
                                <td className="px-4 py-3">
                                  {c.segmento ? <SegmentBadge segment={c.segmento} size="sm" /> : '-'}
                                </td>
                              </tr>
                            ))}
                            {(entry.contacts?.length || 0) > 50 && (
                              <tr>
                                <td colSpan={3} className="px-4 py-3 text-center text-muted-foreground text-xs bg-muted/30">
                                  Mostrando 50 de {entry.contacts?.length} contatos
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : entry.type === 'presales' && entry.preSalesData ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="text-left px-4 py-2 font-semibold">Empresa</th>
                            {entry.preSalesData[0]?.segment && <th className="text-left px-4 py-2 font-semibold">Segmento</th>}
                            {entry.preSalesData[0]?.revenue && <th className="text-left px-4 py-2 font-semibold">Faturamento</th>}
                            {entry.preSalesData[0]?.employees && <th className="text-left px-4 py-2 font-semibold">Funcionários</th>}
                            {entry.preSalesData[0]?.data_company && <th className="text-left px-4 py-2 font-semibold">Data</th>}
                            {entry.preSalesData[0]?.cloud_company && <th className="text-left px-4 py-2 font-semibold">Cloud</th>}
                            {entry.preSalesData[0]?.news && <th className="text-left px-4 py-2 font-semibold">Notícias</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {entry.preSalesData.map((d, i) => (
                            <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                              <td className="px-4 py-3">{d.empresa}</td>
                              {d.segment && <td className="px-4 py-3">{d.segment}</td>}
                              {d.revenue && <td className="px-4 py-3">{d.revenue}</td>}
                              {d.employees && <td className="px-4 py-3">{d.employees}</td>}
                              {d.data_company && <td className="px-4 py-3">{d.data_company}</td>}
                              {d.cloud_company && <td className="px-4 py-3">{d.cloud_company}</td>}
                              {d.news && (
                                <td className="px-4 py-3">
                                  <a href={d.news} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    Ver Notícias
                                  </a>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    entry.emails?.map((email) => (
                      <div key={email.id} className="rounded-lg border border-border p-3 bg-muted/20">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-primary">Email {email.sequence}</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{email.subject}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
