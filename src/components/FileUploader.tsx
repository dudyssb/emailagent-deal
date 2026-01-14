import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileLoad: (content: string) => void;
  isLoading?: boolean;
}

export function FileUploader({ onFileLoad, isLoading }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Por favor, selecione um arquivo CSV.');
      return;
    }

    setError(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoad(content);
    };
    reader.onerror = () => {
      setError('Erro ao ler o arquivo.');
    };
    reader.readAsText(file, 'UTF-8');
  }, [onFileLoad]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 cursor-pointer',
          'hover:border-primary/50 hover:bg-accent/50',
          isDragging && 'border-primary bg-accent scale-[1.02]',
          error && 'border-destructive/50',
          fileName && !error && 'border-success/50 bg-success/5'
        )}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center gap-4 text-center pointer-events-none">
          {isLoading ? (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <FileText className="w-8 h-8 text-primary" />
            </div>
          ) : error ? (
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          ) : fileName ? (
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
          )}

          <div>
            {isLoading ? (
              <p className="text-lg font-medium text-foreground">Processando arquivo...</p>
            ) : error ? (
              <p className="text-lg font-medium text-destructive">{error}</p>
            ) : fileName ? (
              <>
                <p className="text-lg font-medium text-success">Arquivo carregado!</p>
                <p className="text-sm text-muted-foreground mt-1">{fileName}</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium text-foreground">
                  Arraste seu arquivo CSV aqui
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ou clique para selecionar
                </p>
              </>
            )}
          </div>

          {!fileName && !error && (
            <p className="text-xs text-muted-foreground">
              Colunas obrigatórias: <code className="bg-muted px-1 rounded">nome</code> e{' '}
              <code className="bg-muted px-1 rounded">email</code>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
