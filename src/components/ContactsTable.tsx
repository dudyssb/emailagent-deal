import { EmailContact, Segment } from '@/types/email';
import { SegmentBadge } from './SegmentBadge';
import { Mail, ExternalLink, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Input } from './ui/input';

interface ContactsTableProps {
  contacts: EmailContact[];
  selectedSegment?: Segment | null;
}

export function ContactsTable({ contacts, selectedSegment }: ContactsTableProps) {
  const [search, setSearch] = useState('');

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

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
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
                      {contact.segmento && (
                        <SegmentBadge segment={contact.segmento} size="sm" />
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
