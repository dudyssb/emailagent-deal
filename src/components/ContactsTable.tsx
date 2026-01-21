import { EmailContact, Segment } from '@/types/email';
import { SegmentBadge } from './SegmentBadge';
import { Mail, ExternalLink, Search, Edit2, Check, X } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

interface ContactsTableProps {
  contacts: EmailContact[];
  selectedSegment?: Segment | null;
  onSelectSegment?: (segment: Segment | null) => void;
  onUpdateSegment?: (email: string, newSegment: Segment) => void;
}

const SEGMENTS: Segment[] = [
  'Mercado Financeiro',
  'Agro/relacionados',
  'Varejo',
  'Tech/Indústria/Inovação',
  'Outros',
];

export function ContactsTable({ contacts, selectedSegment, onSelectSegment, onUpdateSegment }: ContactsTableProps) {
  const [search, setSearch] = useState('');
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [pendingSegment, setPendingSegment] = useState<Segment | null>(null);

  const filteredContacts = useMemo(() => {
    let result = contacts;
    
    if (selectedSegment) {
      result = result.filter(c => c.segmento === selectedSegment);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        c =>
          c.nome.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower)
      );
    }
    
    return result;
  }, [contacts, selectedSegment, search]);

  const handleStartEdit = useCallback((email: string, currentSegment?: Segment) => {
    setEditingEmail(email);
    setPendingSegment(currentSegment || 'Outros');
  }, []);

  const handleConfirmEdit = useCallback(() => {
    if (editingEmail && pendingSegment && onUpdateSegment) {
      onUpdateSegment(editingEmail, pendingSegment);
    }
    setEditingEmail(null);
    setPendingSegment(null);
  }, [editingEmail, pendingSegment, onUpdateSegment]);

  const handleCancelEdit = useCallback(() => {
    setEditingEmail(null);
    setPendingSegment(null);
  }, []);

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {onSelectSegment && (
          <Select
            value={selectedSegment || 'all'}
            onValueChange={(value) => onSelectSegment(value === 'all' ? null : value as Segment)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por segmento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os segmentos</SelectItem>
              {SEGMENTS.map(seg => (
                <SelectItem key={seg} value={seg}>
                  {seg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          {filteredContacts.length} contatos
        </p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Nome</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">E-mail</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Segmento</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Site</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                    Nenhum contato encontrado
                  </td>
                </tr>
              ) : (
                filteredContacts.slice(0, 100).map((contact, index) => (
                  <tr
                    key={`${contact.email}-${index}`}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{contact.nome}</span>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${contact.email}`}
                        className="inline-flex items-center gap-1.5 text-primary hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {contact.email}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {editingEmail === contact.email ? (
                        <div className="flex items-center gap-2">
                          <Select
                            value={pendingSegment || undefined}
                            onValueChange={(value) => setPendingSegment(value as Segment)}
                          >
                            <SelectTrigger className="w-[180px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SEGMENTS.map(seg => (
                                <SelectItem key={seg} value={seg}>
                                  {seg}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-success hover:text-success"
                            onClick={handleConfirmEdit}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={handleCancelEdit}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {contact.segmento && (
                            <SegmentBadge segment={contact.segmento} size="sm" />
                          )}
                          {onUpdateSegment && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
                              onClick={() => handleStartEdit(contact.email, contact.segmento)}
                            >
                              <Edit2 className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {contact.site && (
                        <a
                          href={contact.site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          {contact.site.replace('https://', '')}
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredContacts.length > 100 && (
          <div className="px-4 py-3 bg-muted/30 border-t border-border text-sm text-muted-foreground text-center">
            Mostrando 100 de {filteredContacts.length} contatos
          </div>
        )}
      </div>
    </div>
  );
}
