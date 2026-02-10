import { useState, useCallback } from 'react';
import { UserPlus, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { EmailContact, Segment } from '@/types/email';
import { categorizeByDomainEnhanced } from '@/utils/segmentationKeywords';
import { toast } from 'sonner';

interface ManualLeadEntryProps {
  onAddContact: (contact: EmailContact) => void;
}

const SEGMENTS: Segment[] = [
  'Mercado Financeiro',
  'Agro/relacionados',
  'Varejo',
  'Atacado',
  'Tech/Indústria/Inovação',
  'Educação',
  'Outros',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ManualLeadEntry({ onAddContact }: ManualLeadEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [segmento, setSegmento] = useState<Segment | 'auto'>('auto');

  const handleAdd = useCallback(() => {
    if (!nome.trim()) {
      toast.error('Informe o nome do lead.');
      return;
    }
    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      toast.error('Informe um e-mail válido.');
      return;
    }

    const finalSegment: Segment = segmento === 'auto' 
      ? categorizeByDomainEnhanced(email.trim())
      : segmento;

    const contact: EmailContact = {
      nome: nome.trim(),
      email: email.trim(),
      segmento: finalSegment,
      site: `https://${email.trim().split('@')[1]}`,
    };

    onAddContact(contact);
    setNome('');
    setEmail('');
    setSegmento('auto');
    toast.success(`Lead "${contact.nome}" adicionado ao segmento ${finalSegment}.`);
  }, [nome, email, segmento, onAddContact]);

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)} className="gap-2">
        <UserPlus className="w-4 h-4" />
        Adicionar lead manualmente
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          Adicionar Lead
        </h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lead-nome">Nome</Label>
          <Input
            id="lead-nome"
            placeholder="Nome do lead"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-email">E-mail</Label>
          <Input
            id="lead-email"
            type="email"
            placeholder="email@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-segmento">Segmento</Label>
          <Select value={segmento} onValueChange={(v) => setSegmento(v as Segment | 'auto')}>
            <SelectTrigger id="lead-segmento">
              <SelectValue placeholder="Segmento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Automático (detectar)</SelectItem>
              {SEGMENTS.map(seg => (
                <SelectItem key={seg} value={seg}>{seg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar
        </Button>
      </div>
    </div>
  );
}
