import { ValidationError } from '@/types/email';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

interface ErrorListProps {
  errors: ValidationError[];
}

export function ErrorList({ errors }: ErrorListProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (errors.length === 0) return null;

  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 overflow-hidden animate-slide-up">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-destructive/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div className="text-left">
            <p className="font-medium text-destructive">
              {errors.length} {errors.length === 1 ? 'erro encontrado' : 'erros encontrados'}
            </p>
            <p className="text-sm text-muted-foreground">
              Clique para {isExpanded ? 'ocultar' : 'ver'} detalhes
            </p>
          </div>
        </div>
        <X
          className={`w-5 h-5 text-muted-foreground transition-transform ${
            isExpanded ? 'rotate-0' : 'rotate-45'
          }`}
        />
      </button>

      {isExpanded && (
        <div className="border-t border-destructive/20 max-h-64 overflow-y-auto">
          {errors.map((error, index) => (
            <div
              key={index}
              className="px-4 py-3 flex items-start gap-3 border-b border-destructive/10 last:border-b-0"
            >
              <span className="text-xs font-mono bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                Linha {error.linha_afetada}
              </span>
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">{error.campo}:</span>{' '}
                <span className="text-sm text-muted-foreground">{error.mensagem_erro}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
