import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface FileUploaderProps {
  onFileLoad: (content: string, file?: File) => void;
  isLoading?: boolean;
  acceptedTypes?: string[];
  showReupload?: boolean;
  requiredColumns?: string;
}

export function FileUploader({ 
  onFileLoad, 
  isLoading, 
  acceptedTypes = ['.csv'],
  showReupload = false,
  requiredColumns 
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const acceptString = acceptedTypes.join(',');
  const acceptLabel = acceptedTypes.map(t => t.replace('.', '').toUpperCase()).join(' ou ');

  const handleFile = useCallback((file: File) => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!acceptedTypes.some(type => fileExtension === type.toLowerCase())) {
      setError(`Por favor, selecione um arquivo ${acceptLabel}.`);
      return;
    }

    setError(null);
    setFileName(file.name);

    // For image files, pass them directly without reading as text
    if (file.type.startsWith('image/')) {
      onFileLoad('', file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoad(content, file);
    };
    reader.onerror = () => {
      setError('Erro ao ler o arquivo.');
    };
    reader.readAsText(file, 'UTF-8');
  }, [onFileLoad, acceptedTypes, acceptLabel]);

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

  const handleReset = useCallback(() => {
    setFileName(null);
    setError(null);
  }, []);

  // If file is loaded and showReupload is true, show a compact reupload button
  if (fileName && !error && showReupload) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl border border-success/30 bg-success/5">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-success">Arquivo carregado</p>
            <p className="text-xs text-muted-foreground">{fileName}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Enviar outro arquivo
        </Button>
      </div>
    );
  }

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
          accept={acceptString}
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
                  Arraste seu arquivo {acceptLabel} aqui
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ou clique para selecionar
                </p>
              </>
            )}
          </div>

          {!fileName && !error && requiredColumns && (
            <p className="text-xs text-muted-foreground">
              {requiredColumns}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
