import { useState, useCallback } from 'react';
import { UserPlus, Plus, X, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { EmailContact, Segment, ALL_SEGMENTS } from '@/types/email';
import { categorizeByDomainEnhanced } from '@/utils/segmentationKeywords';
import { toast } from 'sonner';

interface ManualLeadEntryProps {
  onAddContact: (contact: EmailContact) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LeadRow {
  id: number;
  nome: string;
  email: string;
  segmento: Segment | 'auto';
}

let rowIdCounter = 0;

const createEmptyRow = (): LeadRow => ({
  id: ++rowIdCounter,
  nome: '',
  email: '',
  segmento: 'auto',
});

export function ManualLeadEntry({ onAddContact }: ManualLeadEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState<LeadRow[]>(() => [createEmptyRow()]);

  const handleUpdateRow = useCallback((id: number, field: keyof LeadRow, value: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }, []);

  const handleAddRow = useCallback(() => {
    setRows(prev => [...prev, createEmptyRow()]);
  }, []);

  const handleRemoveRow = useCallback((id: number) => {
    setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);
  }, []);

  const handleAddAll = useCallback(() => {
    let added = 0;
    const errors: string[] = [];

    rows.forEach((row, index) => {
      if (!row.nome.trim() && !row.email.trim()) return;
      
      if (!row.nome.trim()) {
        errors.push(`Linha ${index + 1}: nome vazio`);
        return;
      }
      if (!row.email.trim() || !EMAIL_REGEX.test(row.email.trim())) {
        errors.push(`Linha ${index + 1}: e-mail inválido`);
        return;
      }

      const finalSegment: Segment = row.segmento === 'auto'
        ? categorizeByDomainEnhanced(row.email.trim())
        : row.segmento;

      onAddContact({
        nome: row.nome.trim(),
        email: row.email.trim(),
        segmento: finalSegment,
        site: `https://${row.email.trim().split('@')[1]}`,
      });
      added++;
    });

    if (errors.length > 0) {
      toast.error(`${errors.length} erro(s): ${errors[0]}`);
    }
    if (added > 0) {
      toast.success(`${added} lead(s) adicionado(s).`);
      setRows([createEmptyRow()]);
    }
  }, [rows, onAddContact]);

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)} className="gap-2">
        <UserPlus className="w-4 h-4" />
        Adicionar leads manualmente
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          Adicionar Leads
        </h3>
        <Button variant="ghost" size="icon" onClick={() => { setIsOpen(false); setRows([createEmptyRow()]); }}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-[1fr_1fr_1fr_40px] gap-3 items-end">
        <Label className="text-xs text-muted-foreground">Nome</Label>
        <Label className="text-xs text-muted-foreground">E-mail</Label>
        <Label className="text-xs text-muted-foreground">Segmento</Label>
        <div />
      </div>

      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-[1fr_1fr_1fr_40px] gap-3 items-center">
            <Input
              placeholder="Nome do lead"
              value={row.nome}
              onChange={(e) => handleUpdateRow(row.id, 'nome', e.target.value)}
            />
            <Input
              type="email"
              placeholder="email@empresa.com"
              value={row.email}
              onChange={(e) => handleUpdateRow(row.id, 'email', e.target.value)}
            />
            <Select
              value={row.segmento}
              onValueChange={(v) => handleUpdateRow(row.id, 'segmento', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Automático</SelectItem>
                {ALL_SEGMENTS.map(seg => (
                  <SelectItem key={seg} value={seg}>{seg}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-destructive"
              onClick={() => handleRemoveRow(row.id)}
              disabled={rows.length === 1}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handleAddRow} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova linha
        </Button>
        <Button onClick={handleAddAll} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Adicionar {rows.length > 1 ? `${rows.length} leads` : 'lead'}
        </Button>
      </div>
    </div>
  );
}
