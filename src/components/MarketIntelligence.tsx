import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, FileText, Upload, Download, Globe, User, Building2, Send, Save, Mail, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { cn } from '@/lib/utils';

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
        website: '',
        linkedinUrl: ''
    });
    const [referenceFile, setReferenceFile] = useState<File | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [emailPrompt, setEmailPrompt] = useState('');
    const [isGeneratingEmails, setIsGeneratingEmails] = useState(false);
    const [generatedEmails, setGeneratedEmails] = useState<any[]>([]);
    const [result, setResult] = useState<any>(null);
    const { toast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
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
        setGeneratedEmails([]);
        setResult(null);

        const performGeminiAnalysis = async () => {
            try {
                const linkedinContext = formData.linkedinUrl
                    ? `URL do LinkedIn do Lead para análise: ${formData.linkedinUrl}`
                    : "Nenhum perfil público de LinkedIn pesquisado ou fornecido no momento.";

                const prompt = `
                    Analise as seguintes informações e gere um Dossiê de Inteligência de Mercado detalhado:
                    Lead: ${formData.name}
                    Empresa: ${formData.company}
                    Segmento: ${formData.segment}
                    Site: ${formData.website}
                    LinkedIn do Lead: ${formData.linkedinUrl}
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

    const handleGenerateEmails = async () => {
        if (!result) return;
        setIsGeneratingEmails(true);

        try {
            const prompt = `
                Com base no seguinte Dossiê de Inteligência de Mercado, gere uma sequência de 4 e-mails de prospecção fria.
                
                Dossiê:
                ${JSON.stringify(result, null, 2)}
                
                Pedido Especial do Usuário para o tom/foco dos e-mails: "${emailPrompt || 'Foco em inovação e parceria estratégica.'}"
                
                REGRAS CRÍTICAS:
                1. Retorne APENAS um JSON array válido. Não adicione textos explicativos fora do JSON.
                2. Cada objeto do array deve ter: id (number), sequence (number), subject (string) e body (string).
                3. O campo "body" deve ser um HTML COMPLETO E PROFISSIONAL (com styles inline, fontes limpas, espaçamento correto e tags <html><body>).
                4. Use o nome do lead (${result.lead}) e a empresa (${result.company}).
                5. Linguagem executiva Deal (Transformação Digital).
            `;

            const systemInstruction = "Você é um especialista em Copywriting B2B e HTML de e-mails. Sua resposta deve ser ESTRITAMENTE um JSON array contendo os e-mails, com o corpo em HTML formatado.";

            const response = await generateWithGemini(prompt, systemInstruction);
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const emails = JSON.parse(jsonMatch[0]);
                setGeneratedEmails(emails);

                if (onResultsGenerated) {
                    onResultsGenerated(result, emails);
                }

                toast({
                    title: "E-mails Dinâmicos Gerados",
                    description: "A sequência foi gerada em HTML com base no seu prompt.",
                });
            } else {
                throw new Error("Não foi possível encontrar o JSON na resposta.");
            }
        } catch (error: any) {
            console.error("Email generation failed:", error);
            toast({
                title: "Erro na Geração",
                description: "Tente novamente ou ajuste seu prompt.",
                variant: "destructive"
            });
        } finally {
            setIsGeneratingEmails(false);
        }
    };

    const downloadEmailHtml = (email: any) => {
        const fullHtml = email.body.includes('<html>')
            ? email.body
            : `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family: Arial; padding: 20px;">${email.body}</body></html>`;

        const blob = new Blob([fullHtml], { type: 'text/html' });
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

        doc.setFontSize(22);
        doc.setTextColor(33, 33, 33);
        doc.text('DOSSIÊ DE INTELIGÊNCIA DE MERCADO', margin, y);
        y += 10;
        doc.setDrawColor(0, 51, 102);
        doc.setLineWidth(1);
        doc.line(margin, y, 190, y);
        y += 15;

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

        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text(`Página ${i} de ${pageCount} | Inteligência Confidencial Antigravity`, margin, 285);
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
                                <Input id="name" placeholder="Ex: Rodrigo Caldas" value={formData.name} onChange={handleInputChange} className="bg-muted/30 border border-input text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-xs font-semibold uppercase text-muted-foreground">Empresa</Label>
                                <Input id="company" placeholder="Ex: Magalu" value={formData.company} onChange={handleInputChange} className="bg-muted/30 border border-input text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="segment" className="text-xs font-semibold uppercase text-muted-foreground">Segmento</Label>
                                <Input id="segment" placeholder="Ex: E-commerce / Tech" value={formData.segment} onChange={handleInputChange} className="bg-muted/30 border border-input text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website" className="text-xs font-semibold uppercase text-muted-foreground">Site Oficial</Label>
                                <Input id="website" placeholder="Ex: www.magazineluiza.com.br" value={formData.website} onChange={handleInputChange} className="bg-muted/30 border border-input text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedinUrl" className="text-xs font-semibold uppercase text-muted-foreground">LinkedIn do Lead (URL)</Label>
                                <Input id="linkedinUrl" placeholder="Ex: linkedin.com/in/perfil" value={formData.linkedinUrl} onChange={handleInputChange} className="bg-muted/30 border border-input text-foreground" />
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

                <div className="space-y-6">
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase text-muted-foreground">Instruções</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs space-y-4 text-muted-foreground leading-relaxed">
                            <p>1. Preencha o nome e empresa do lead.</p>
                            <p>2. Clique em <strong>Gerar Dossiê</strong> para análise via Gemini AI.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {result && (
                <div className="space-y-6">
                    <Card className="border-primary/20 bg-card shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-xl">
                            <CardTitle className="text-xl flex justify-between items-center font-black text-foreground uppercase tracking-tight">
                                <span>Relatório Investigativo Completo</span>
                                <Button onClick={generatePDF} className="gap-2 bg-foreground text-background hover:bg-foreground/80 font-bold">
                                    <Download className="w-5 h-5" />
                                    Baixar PDF
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid md:grid-cols-2 gap-8 text-foreground">
                                {result.sections.map((section: any, i: number) => (
                                    <div key={i} className="space-y-3 p-5 rounded-xl bg-muted/20 border border-border/50">
                                        <h4 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1 h-3 bg-primary rounded-full" />
                                            {section.title}
                                        </h4>
                                        <p className="text-sm text-foreground whitespace-pre-wrap font-medium opacity-90">{section.content}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 font-bold uppercase tracking-tight">
                                <Mail className="w-5 h-5 text-primary" />
                                Configuração de E-mails
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="emailPrompt" className="text-xs font-semibold uppercase text-muted-foreground">Prompt Inicial (Contextualizado pelo Dossiê)</Label>
                                <textarea
                                    id="emailPrompt"
                                    className="w-full min-h-[100px] p-4 rounded-xl bg-muted/30 border border-input text-sm focus:ring-2 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground"
                                    placeholder="Ex: Foco em segurança de dados e eficiência operacional..."
                                    value={emailPrompt}
                                    onChange={(e) => setEmailPrompt(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button onClick={handleGenerateEmails} disabled={isGeneratingEmails} className="gap-2">
                                    {isGeneratingEmails ? <Send className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Gerar 4 E-mails
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {generatedEmails.length > 0 && (
                        <div className="grid gap-6">
                            {generatedEmails.map((email: any) => (
                                <Card key={email.id} className="border-border overflow-hidden bg-card shadow-lg">
                                    <div className="bg-muted/50 p-4 border-b border-border flex justify-between items-center">
                                        <span className="text-sm font-bold text-foreground">Email {email.sequence}: {email.subject}</span>
                                        <Button size="sm" variant="ghost" onClick={() => downloadEmailHtml(email)} className="h-8 text-[10px] uppercase font-bold">
                                            <Download className="w-3 h-3 mr-1" /> HTML
                                        </Button>
                                    </div>
                                    <CardContent className="p-0">
                                        <div className="bg-white p-8 min-h-[150px] overflow-auto">
                                            <div dangerouslySetInnerHTML={{ __html: email.body }} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
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
