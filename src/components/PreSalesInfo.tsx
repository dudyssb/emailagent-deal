import { useState } from 'react';
import { Button } from './ui/button';
import { Search, Upload, CheckCircle2, Building2 } from 'lucide-react';
import { parseCSV } from '@/utils/csvParser';
import { useToast } from '@/hooks/use-toast';

interface PreSalesInfoProps {
  onResultsGenerated: (results: any[]) => void;
}

const INFO_OPTIONS = [
  { id: 'segment', label: 'Segmento' },
  { id: 'revenue', label: 'Faturamento' },
  { id: 'employees', label: 'Quantidade de funcionários' },
  { id: 'data_company', label: 'Empresa utilizada pra Data' },
  { id: 'cloud_company', label: 'Empresa utilizada pra Cloud' },
  { id: 'news', label: 'Link das últimas notícias da empresa' },
];

export function PreSalesInfo({ onResultsGenerated }: PreSalesInfoProps) {
  const [file, setFile] = useState<File | null>(null);
  const [companies, setCompanies] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, envie um arquivo CSV.",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);

    try {
      const content = await selectedFile.text();
      // Simple local parsing for Pre-Sales (generic CSV)
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        toast({
          title: "Arquivo insuficiente",
          description: "O CSV deve conter cabeçalho e pelo menos uma linha de dados.",
          variant: "destructive"
        });
        setFile(null);
        return;
      }

      const header = lines[0].split(/[,;]/).map(h => h.trim().toLowerCase().replace(/"/g, ''));
      const companyIndex = header.findIndex(h => h.includes('empresa') || h.includes('company'));

      if (companyIndex === -1) {
        toast({
          title: "Coluna não encontrada",
          description: "O CSV deve conter uma coluna chamada 'empresa'.",
          variant: "destructive"
        });
        setFile(null);
        return;
      }

      const extractedCompanies: string[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(/[,;]/).map(v => v.trim().replace(/"/g, ''));
        if (values[companyIndex]) {
          extractedCompanies.push(values[companyIndex]);
        }
      }

      setCompanies(extractedCompanies);
      toast({
        title: "Arquivo processado",
        description: `${extractedCompanies.length} empresas encontradas.`,
      });

    } catch (error) {
      toast({
        title: "Erro ao ler arquivo",
        description: "Não foi possível processar o CSV.",
        variant: "destructive"
      });
      setFile(null);
    }
  };

  const toggleOption = (id: string) => {
    setSelectedOptions(prev =>
      prev.includes(id)
        ? prev.filter(opt => opt !== id)
        : [...prev, id]
    );
  };

  const handleSearch = () => {
    if (companies.length === 0 || selectedOptions.length === 0) return;

    setIsSearching(true);

    // Simulate API search
    setTimeout(() => {
      const simulatedResults = companies.map(company => {
        const result: any = { empresa: company };

        if (selectedOptions.includes('segment')) {
          const segments = ['Tecnologia', 'Varejo', 'Finanças', 'Saúde', 'Indústria'];
          result.segment = segments[Math.floor(Math.random() * segments.length)];
        }
        if (selectedOptions.includes('revenue')) {
          const revenues = ['R$ 1M - 5M', 'R$ 5M - 20M', 'R$ 20M - 50M', '+ R$ 50M'];
          result.revenue = revenues[Math.floor(Math.random() * revenues.length)];
        }
        if (selectedOptions.includes('employees')) {
          const employees = ['10-50', '51-200', '201-500', '500+'];
          result.employees = employees[Math.floor(Math.random() * employees.length)];
        }
        if (selectedOptions.includes('data_company')) {
          const dataCompanies = ['Snowflake', 'Databricks', 'BigQuery', 'Redshift', 'Não identificado'];
          result.data_company = dataCompanies[Math.floor(Math.random() * dataCompanies.length)];
        }
        if (selectedOptions.includes('cloud_company')) {
          const cloudCompanies = ['AWS', 'Azure', 'Google Cloud', 'Oracle', 'Não identificado'];
          result.cloud_company = cloudCompanies[Math.floor(Math.random() * cloudCompanies.length)];
        }
        if (selectedOptions.includes('news')) {
          result.news = `https://noticias.exemplo.com/busca?q=${encodeURIComponent(company)}`;
        }

        return result;
      });

      setResults(simulatedResults);
      onResultsGenerated(simulatedResults);
      setIsSearching(false);

      toast({
        title: "Busca concluída",
        description: "Informações pré-venda geradas com sucesso.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          1. Upload da Lista de Empresas
        </h3>

        <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors">
          <Building2 className="w-8 h-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-4">
            Faça upload de um CSV contendo uma coluna chamada "empresa"
          </p>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant={file ? "secondary" : "default"}>
              {file ? 'Trocar Arquivo' : 'Selecionar CSV'}
            </Button>
          </div>
          {file && (
            <div className="mt-4 flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              {file.name} ({companies.length} empresas identificadas)
            </div>
          )}
        </div>
      </div>

      <div className={`rounded-xl border border-border bg-card p-6 transition-opacity duration-300 ${!file ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          2. Selecione as Informações Desejadas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {INFO_OPTIONS.map(option => (
            <label
              key={option.id}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedOptions.includes(option.id)
                ? 'border-primary bg-primary/5'
                : 'border-border hover:bg-muted/50'
                }`}
            >
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => toggleOption(option.id)}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSearch}
            disabled={isSearching || companies.length === 0 || selectedOptions.length === 0}
            className="w-full md:w-auto"
          >
            {isSearching ? (
              <span className="flex items-center gap-2 animate-pulse">
                <Search className="w-4 h-4" /> Buscando Informações...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" /> Iniciar Busca Agente
              </span>
            )}
          </Button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-slide-up">
          <div className="p-4 bg-muted/30 border-b border-border">
            <h3 className="font-semibold text-foreground">Resultados da Busca</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Empresa</th>
                  {selectedOptions.includes('segment') && <th className="px-4 py-3 font-medium">Segmento</th>}
                  {selectedOptions.includes('revenue') && <th className="px-4 py-3 font-medium">Faturamento</th>}
                  {selectedOptions.includes('employees') && <th className="px-4 py-3 font-medium">Funcionários</th>}
                  {selectedOptions.includes('data_company') && <th className="px-4 py-3 font-medium">Data</th>}
                  {selectedOptions.includes('cloud_company') && <th className="px-4 py-3 font-medium">Cloud</th>}
                  {selectedOptions.includes('news') && <th className="px-4 py-3 font-medium">Notícias</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {results.map((result, idx) => (
                  <tr key={idx} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">{result.empresa}</td>
                    {selectedOptions.includes('segment') && <td className="px-4 py-3">{result.segment}</td>}
                    {selectedOptions.includes('revenue') && <td className="px-4 py-3">{result.revenue}</td>}
                    {selectedOptions.includes('employees') && <td className="px-4 py-3">{result.employees}</td>}
                    {selectedOptions.includes('data_company') && <td className="px-4 py-3">{result.data_company}</td>}
                    {selectedOptions.includes('cloud_company') && <td className="px-4 py-3">{result.cloud_company}</td>}
                    {selectedOptions.includes('news') && (
                      <td className="px-4 py-3">
                        <a href={result.news} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Buscar no Google
                        </a>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
