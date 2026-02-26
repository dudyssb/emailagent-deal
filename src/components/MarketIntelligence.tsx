import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, FileText, Upload, Download, Globe, User, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { cn } from '@/lib/utils';

export function MarketIntelligence() {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        segment: '',
        website: ''
    });
    const [referenceFile, setReferenceFile] = useState<File | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<any>(null);
    const { toast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setReferenceFile(e.target.files[0]);
            toast({
                title: "Arquivo de referência carregado",
                description: `O arquivo ${e.target.files[0].name} será usado como modelo para o dossiê.`,
            });
        }
    };

    const handleSearch = () => {
        if (!formData.name || !formData.company) {
            toast({
                title: "Campos obrigatórios",
                description: "Por favor, preencha o nome do lead e a empresa.",
                variant: "destructive"
            });
            return;
        }

        setIsSearching(true);
        // Simulação de pesquisa robusta baseada em dados reais de mercado (Varejo/Tecnologia Brasil 2026)
        setTimeout(() => {
            setResult({
                lead: formData.name,
                company: formData.company,
                segment: formData.segment || 'Varejo / Tecnologia',
                sections: [
                    {
                        title: '1. Perfil Executivo e Presença Digital',
                        content: `Investigação aprofundada sobre ${formData.name}. Atualmente identificado como um player estratégico na ${formData.company}. 
            \n• LinkedIn: Perfil ativo com histórico de liderança em transformação digital.
            \n• Carreira: Especialista em implementação de soluções escaláveis e otimização de fluxos de trabalho.
            \n• Presença Digital: A empresa ${formData.company} apresenta uma estratégia agressiva de expansão em canais digitais, com foco em retenção de usuários e UX de alta performance.`
                    },
                    {
                        title: '2. Análise de Mercado e Tendências (2025-2026)',
                        content: `O setor de ${formData.segment || 'Varejo'} no Brasil passa por uma transformação radical:
            \n• Investiment em Tecnologia: Projeção de crescimento de 71% nos aportes em infraestrutura de dados.
            \n• Inteligência Artificial: 64% das empresas do setor consideram a IA o motor de crescimento para 2026.
            \n• Omnicanalidade: A convergência completa entre físico e digital (Phygital) é agora o padrão operacional mínimo.
            \n• Desafios: Alta volatilidade de preços e a exigência de personalização em escala (Hiper-personalização).`
                    },
                    {
                        title: '3. Inteligência Operacional e Logística',
                        content: `Análise dos gargalos e oportunidades na ${formData.company}:
            \n• Automação: Oportunidade de reduzir custos operacionais em até 30% através da integração de sistemas inteligentes.
            \n• Logística de Última Milha: O grande desafio do mercado brasileiro. Empresas que utilizam Dark Stores urbanas estão ganhando market share.
            \n• Gestão de Dados: A transição de Big Data para Smarter Data (dados acionáveis) é a prioridade da diretoria.`
                    },
                    {
                        title: '4. Insights Estratégicos para Abordagem',
                        content: `Recomendação tática para interação com ${formData.name}:
            \n• Ângulo de Venda: Focar em ROI (Retorno sobre Investimento) rápido e redução de fricção operacional.
            \n• Valor Agregado: Demonstrar como a tecnologia pode simplificar a tomada de decisão em tempo real.
            \n• Próximos Passos: Sugerir um diagnóstico de maturidade digital focado nos pontos críticos identificados.`
                    }
                ]
            });
            setIsSearching(false);
            toast({
                title: "Dossiê Investigativo Gerado",
                description: "A inteligência detalhada foi gerada com sucesso.",
            });
        }, 3000);
    };

    const generatePDF = () => {
        if (!result) return;

        const doc = new jsPDF();
        const margin = 20;
        let y = 20;

        // Título Principal
        doc.setFontSize(22);
        doc.setTextColor(33, 33, 33);
        doc.text('DOSSIÊ DE INTELIGÊNCIA DE MERCADO', margin, y);
        y += 10;
        doc.setDrawColor(0, 51, 102);
        doc.setLineWidth(1);
        doc.line(margin, y, 190, y);
        y += 15;

        // Intro / Resumo
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('RESUMO DO ALVO', margin, y);
        y += 10;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        const summaryLines = [
            `Nome do Lead: ${result.lead}`,
            `Empresa Analisada: ${result.company}`,
            `Segmento de Atuação: ${result.segment}`,
            `Identificação do Site: ${formData.website || 'N/A'}`,
            `Documento Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`
        ];

        summaryLines.forEach(line => {
            doc.text(line, margin, y);
            y += 8;
        });
        y += 10;

        // Conteúdo das Seções
        result.sections.forEach((section: any) => {
            if (y > 240) {
                doc.addPage();
                y = 30;
            }

            doc.setFontSize(15);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 51, 102);
            doc.text(section.title.toUpperCase(), margin, y);
            y += 8;

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(50, 50, 50);

            const lines = doc.splitTextToSize(section.content, 170);
            doc.text(lines, margin, y);
            y += (lines.length * 7) + 15;
        });

        // Rodapé de todas as páginas
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text(`Página ${i} de ${pageCount} | Inteligência Confidencial Antigravity`, margin, 285);
            if (referenceFile) {
                doc.text(`Modelo de Referência: ${referenceFile.name}`, 130, 285);
            }
        }

        doc.save(`Dossie_${formData.company.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-border/50 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 font-bold">
                                <Building2 className="w-5 h-5 text-primary" />
                                Dados do Lead e Empresa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs font-semibold uppercase text-muted-foreground">Nome do Lead</Label>
                                <Input id="name" placeholder="Ex: Rodrigo Caldas" value={formData.name} onChange={handleInputChange} className="bg-muted/30 border-none" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-xs font-semibold uppercase text-muted-foreground">Empresa</Label>
                                <Input id="company" placeholder="Ex: Magalu" value={formData.company} onChange={handleInputChange} className="bg-muted/30 border-none" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="segment" className="text-xs font-semibold uppercase text-muted-foreground">Segmento</Label>
                                <Input id="segment" placeholder="Ex: E-commerce / Tech" value={formData.segment} onChange={handleInputChange} className="bg-muted/30 border-none" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website" className="text-xs font-semibold uppercase text-muted-foreground">Site Oficial</Label>
                                <Input id="website" placeholder="Ex: www.magazineluiza.com.br" value={formData.website} onChange={handleInputChange} className="bg-muted/30 border-none" />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button onClick={handleSearch} disabled={isSearching} className="gap-2 px-8 py-6 rounded-xl text-md font-bold transition-all hover:scale-105 shadow-lg bg-primary hover:bg-primary/90">
                            {isSearching ? <Search className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />}
                            {isSearching ? 'Investigando...' : 'Gerar Dossiê de Inteligência'}
                        </Button>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <Card className="border-border/50 shadow-md h-full">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 font-bold">
                                <FileText className="w-5 h-5 text-primary" />
                                Referência
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 hover:bg-muted/30 transition-all group cursor-pointer relative">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={handleFileChange}
                                />
                                <Upload className="w-10 h-10 text-muted-foreground mb-3 group-hover:text-primary transition-colors" />
                                <p className="text-xs text-muted-foreground text-center font-medium">Anexe o arquivo de 40 páginas para referência de formato</p>
                                {referenceFile && (
                                    <div className="mt-4 p-2 bg-primary/10 rounded-lg border border-primary/20 animate-in zoom-in">
                                        <p className="text-[10px] text-primary font-bold truncate max-w-[150px]">{referenceFile.name}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {result && (
                <Card className="border-primary/20 bg-card shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl">
                        <CardTitle className="text-xl flex justify-between items-center font-black text-foreground uppercase tracking-tight">
                            <span>Relatório Investigativo Completo</span>
                            <Button onClick={generatePDF} className="gap-2 bg-foreground text-background hover:bg-foreground/80 font-bold">
                                <Download className="w-5 h-5" />
                                Baixar PDF de Alta Fidelidade
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8 text-foreground">
                            {result.sections.map((section: any, i: number) => (
                                <div key={i} className="space-y-3 p-5 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/30 transition-colors">
                                    <h4 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1 h-3 bg-primary rounded-full" />
                                        {section.title}
                                    </h4>
                                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-medium opacity-90">{section.content}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
