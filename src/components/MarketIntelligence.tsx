import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, FileText, Upload, Download, Globe, User, Building2, Send, Save, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { cn } from '@/lib/utils';
// import { searchLinkedIn } from '@/utils/serpApi'; // Removido por hora

const APP_VERSION = "1.1.0-gemini";
import { generateWithGemini } from '@/utils/geminiApi';

interface MarketIntelligenceProps {
    onResultsGenerated?: (analysis: any, emails: any[]) => void;
}

export function MarketIntelligence({ onResultsGenerated }: MarketIntelligenceProps) {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        segment: '',
        website: ''
    });
    const [referenceFile, setReferenceFile] = useState<File | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [emailPrompt, setEmailPrompt] = useState('');
    const [isGeneratingEmails, setIsGeneratingEmails] = useState(false);
    const [generatedEmails, setGeneratedEmails] = useState<any[]>([]);
    const [result, setResult] = useState<any>(null);
    // const [linkedInResults, setLinkedInResults] = useState<any[]>([]); // Removido por hora
    // const [isSearchingLinkedIn, setIsSearchingLinkedIn] = useState(false); // Removido por hora
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
        if (!formData.name && !formData.company) {
            toast({
                title: "Campos obrigatórios",
                description: "Por favor, preencha o nome do lead ou a empresa.",
                variant: "destructive"
            });
            return;
        }

        setIsSearching(true);
        // setIsSearchingLinkedIn(true); // Removido por hora
        setGeneratedEmails([]);
        // setLinkedInResults([]); // Removido por hora
        setResult(null);

        // 1. Iniciar busca no LinkedIn (paralelo) - REMOVIDO POR HORA
        /*
        const linkedinPromise = searchLinkedIn(formData.name, formData.company)
            .then(results => {
                setLinkedInResults(results);
                setIsSearchingLinkedIn(false);
                return results;
            })
            .catch(err => {
                console.error("LinkedIn search failed:", err);
                setIsSearchingLinkedIn(false);
                return [];
            });
        */

        // 2. Usar Gemini para pesquisa e análise vasta
        const performGeminiAnalysis = async () => {
            try {
                // const results = await linkedinPromise; // Removido por hora
                const linkedinContext = "Nenhum perfil público de LinkedIn pesquisado no momento."; // Simplificado por hora

                const prompt = `
                    Analise as seguintes informações e gere um Dossiê de Inteligência de Mercado detalhado:
                    Lead: ${formData.name}
                    Empresa: ${formData.company}
                    Segmento: ${formData.segment}
                    Site: ${formData.website}
                    Contexto Extra: ${linkedinContext}

                    Gere um JSON com a seguinte estrutura exatamente:
                    {
                      "lead": "${formData.name}",
                      "company": "${formData.company}",
                      "segment": "${formData.segment || 'Tecnologia'}",
                      "sections": [
                        {"title": "1. Perfil Executivo e Presença Digital", "content": "Análise detalhada do lead..."},
                        {"title": "2. Histórico de Inovação e M&A", "content": "Fatos sobre a empresa..."},
                        {"title": "3. Posicionamento de Mercado", "content": "Dados sobre faturamento, crescimento..."},
                        {"title": "4. Insights Estratégicos para Abordagem", "content": "Como falar com esse lead..."}
                      ]
                    }
                    Seja específico, use dados reais de mercado para 2025/2026. Se não tiver certeza de um dado, gere uma análise baseada em tendências reais do segmento.
                `;

                const systemInstruction = "Você é um Agente de Inteligência de Mercado especializado em consultoria de tecnologia e Transformação Digital (Deal). Sua linguagem é executiva, direta e focada em ROI e inovação.";

                const response = await generateWithGemini(prompt, systemInstruction);

                // Tenta extrair JSON da resposta do Gemini
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const analysisData = JSON.parse(jsonMatch[0]);
                    setResult(analysisData);
                    if (onResultsGenerated) onResultsGenerated(analysisData, []);

                    toast({
                        title: "Dossiê Inteligente Gerado",
                        description: `Análise profunda sobre ${analysisData.lead} concluída via Gemini AI.`,
                    });
                } else {
                    throw new Error("Resposta do Gemini não contém JSON válido");
                }
            } catch (error: any) {
                console.error("Gemini analysis failed:", error);
                toast({
                    title: "Erro na Análise IA",
                    description: error.message || "Não foi possível gerar a análise com o Gemini.",
                    variant: "destructive"
                });
            } finally {
                setIsSearching(false);
            }
        };

        performGeminiAnalysis();
    };

    const handleGenerateEmails = () => {
        if (!result) return;
        setIsGeneratingEmails(true);

        setTimeout(() => {
            // Extração dinâmica de insights do dossiê
            const insight = result.sections.find((s: any) => s.title.includes('Insights'))?.content || '';
            const techInfo = result.sections.find((s: any) => s.title.includes('Mercado') || s.title.includes('IA'))?.content || '';

            const promptContext = emailPrompt ? `Considerando seu pedido: "${emailPrompt}". ` : '';
            const firstName = result.lead.split(' ')[0];

            const emails = [
                {
                    id: 1,
                    sequence: 1,
                    subject: `Inovação e dados na ${result.company}`,
                    body: `Olá ${firstName},\n\nNotei que a ${result.company} está avançando em ${result.segment}. ${promptContext}Com base no crescimento de IA projetado para 2026, como vocês estão preparando a infraestrutura de dados para suportar essa escala?\n\nAbraço.`
                },
                {
                    id: 2,
                    sequence: 2,
                    subject: `Eficiência Operacional: Um insight para ${result.lead}`,
                    body: `Oi ${firstName},\n\n${insight.split('.')[0]}. Vi que há uma oportunidade grande de otimização na ${result.company}. ${emailPrompt ? 'Alinhado ao que você sugeriu, o' : 'O'} foco em ROI rápido parece ser o caminho mais seguro agora.\n\nPodemos trocar uma ideia?`
                },
                {
                    id: 3,
                    sequence: 3,
                    subject: `Tendências 2026: ${result.company}`,
                    body: `Prezado ${result.lead},\n\n${techInfo.split('.')[0]}. Considerando sua trajetória, acredito que a ${result.company} pode se beneficiar de uma abordagem mais técnica em modelos abertos.\n\n${emailPrompt || 'Espero que este insight seja útil.'}\n\nAbs.`
                },
                {
                    id: 4,
                    sequence: 4,
                    subject: `Estratégia e Próximos Passos`,
                    body: `Olá ${firstName},\n\nEntendo a correria. Se fizer sentido no futuro falarmos sobre como aplicar esses insights de inteligência na ${result.company}, conte comigo.\n\n${emailPrompt ? 'Fiquei com seu ponto sobre ' + emailPrompt.substring(0, 30) + '... na cabeça.' : ''}\n\nSucesso!`
                }
            ];
            setGeneratedEmails(emails);
            setIsGeneratingEmails(false);

            if (onResultsGenerated) {
                onResultsGenerated(result, emails);
            }

            toast({
                title: "E-mails Dinâmicos Gerados",
                description: "Sequência de 4 e-mails criada com base no dossiê e no seu prompt.",
            });
        }, 2000);
    };

    const downloadEmailHtml = (email: any) => {
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${email.subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #003366;">${email.subject}</h2>
        <hr>
        <div style="white-space: pre-wrap;">${email.body}</div>
      </body>
      </html>
    `;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Email_${email.sequence}_${result.company.replace(/\s+/g, '_')}.html`;
        a.click();
        URL.revokeObjectURL(url);
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
                <div className="space-y-6">
                    {/* LinkedIn Results Section - REMOVIDO POR HORA */}
                    {/* 
                    <div className="space-y-4">
                        <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2 text-foreground">
                            <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
                            Perfis Encontrados no LinkedIn
                            {isSearchingLinkedIn && <Search className="w-4 h-4 animate-spin text-blue-600" />}
                        </h3>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {linkedInResults.length > 0 ? (
                                linkedInResults.map((profile, i) => (
                                    <a
                                        key={i}
                                        href={profile.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-all group flex flex-col justify-between"
                                    >
                                        <div>
                                            <h4 className="text-sm font-bold text-blue-600 group-hover:underline mb-1 flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                {profile.title.split('-')[0].trim()}
                                            </h4>
                                            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                                                {profile.snippet}
                                            </p>
                                        </div>
                                        <div className="flex justify-end">
                                            <span className="text-[10px] font-bold uppercase text-blue-500/70">Ver Perfil ↗</span>
                                        </div>
                                    </a>
                                ))
                            ) : !isSearchingLinkedIn && (
                                <div className="col-span-full p-8 text-center border-2 border-dashed border-border rounded-xl">
                                    <p className="text-sm text-muted-foreground">Nenhum perfil público encontrado para "{formData.name}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                    */}

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

                    <Card className="border-primary/20 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 font-bold">
                                <Mail className="w-5 h-5 text-primary" />
                                Gerar Sequência de E-mails
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="emailPrompt" className="text-xs font-semibold uppercase text-muted-foreground flex items-center justify-between">
                                    <span>Prompt Customizado para os E-mails</span>
                                    <span className="text-[10px] lowercase font-normal opacity-70 italic">USA O DOSSIÊ COMO CONTEXTO</span>
                                </Label>
                                <textarea
                                    id="emailPrompt"
                                    className="w-full min-h-[100px] p-4 rounded-xl bg-muted/30 border-none text-sm focus:ring-2 focus:ring-primary transition-all text-white placeholder:text-muted-foreground"
                                    placeholder="Ex: Quero focar em redução de custos logísticos ou automação de estoque..."
                                    value={emailPrompt}
                                    onChange={(e) => setEmailPrompt(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleGenerateEmails}
                                    disabled={isGeneratingEmails}
                                    className="gap-2 bg-primary hover:bg-primary/90"
                                >
                                    {isGeneratingEmails ? <Send className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {isGeneratingEmails ? 'Gerando...' : 'Gerar 4 E-mails'}
                                </Button>
                            </div>

                            {generatedEmails.length > 0 && (
                                <div className="pt-6 grid md:grid-cols-2 gap-4">
                                    {generatedEmails.map((email) => (
                                        <div key={email.id} className="p-4 rounded-xl border border-border bg-muted/5 space-y-3 relative group">
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] font-black uppercase text-primary px-2 py-0.5 bg-primary/10 rounded-full">Sequência {email.sequence}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-primary hover:bg-primary/10"
                                                    onClick={() => downloadEmailHtml(email)}
                                                    title="Baixar HTML"
                                                >
                                                    <Save className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <h5 className="text-sm font-bold truncate pr-8">{email.subject}</h5>
                                            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{email.body}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="pt-10 pb-4 text-center">
                <p className="text-[10px] font-mono text-muted-foreground opacity-30 uppercase tracking-[0.2em]">
                    Email Agent Deal - v{APP_VERSION}
                </p>
            </div>
        </div>
    );
}
