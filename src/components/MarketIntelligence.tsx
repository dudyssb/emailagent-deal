import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, FileText, Upload, Download, Globe, User, Building2, Send, Save, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { cn } from '@/lib/utils';

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
        setGeneratedEmails([]); // Reset emails

        // Simulação de pesquisa robusta
        setTimeout(() => {
            const nameLower = formData.name.toLowerCase();
            let researchData: any = null;

            if (nameLower.includes('fabio hayashi')) {
                researchData = {
                    lead: 'Fabio Hayashi',
                    company: 'Deal Technologies',
                    segment: 'Tecnologia / Serviços / M&A',
                    sections: [
                        {
                            title: '1. Perfil Executivo',
                            content: `Fabio Hayashi é o Fundador e CEO da Deal Technologies. Possui MBA em Gestão de Negócios pela FGV. É reconhecido como um estrategista nato com foco em Transformação Digital e M&A.`
                        },
                        {
                            title: '2. Histórico de Inovação e M&A',
                            content: `• 2012: Primeira operação de M&A concluída.\n• 2014: Investidor no Canal da Peça.\n• 2015: Aquisição da ManytoOne, criando o braço Digital da Deal.\n• 2018: Aquisição de uma Startup de Data, estabelecendo a vertical de BIG Data da Deal.`
                        },
                        {
                            title: '3. Deal Technologies',
                            content: `Sob sua liderança, a Deal reportou faturamento de R$ 105 milhões em 2022. A empresa foca em resolver problemas complexos de negócios através de tecnologia robusta e dados acionáveis.`
                        },
                        {
                            title: '4. Posicionamento e Insights',
                            content: `Fabio é colunista da Exame e membro do YPO. Sua abordagem é de "Minha Vida em uma Página", focando em síntese e eficiência. Abordagens devem ser diretas, focadas em ROI e escalabilidade de dados.`
                        }
                    ]
                };
            } else if (nameLower.includes('luciano vernaglia') || nameLower.includes('luciano martins')) {
                researchData = {
                    lead: 'Luciano Vernaglia Martins',
                    company: 'Google DeepMind',
                    segment: 'IA / Open Models / Developer Relations',
                    sections: [
                        {
                            title: '1. Perfil Executivo',
                            content: `Luciano Martins é Developer Advocate para IA e Open Models no Google DeepMind. Especialista em Cloud AI e habilitação de desenvolvedores, com forte presença na comunidade de IA generativa.`
                        },
                        {
                            title: '2. Experiência em Cloud e IA',
                            content: `• Google: Entrou em 2020. Atua em Cloud AI e modelos abertos (Gemini).\n• Ex-AWS, Oracle e IBM: Vasto histórico em sistemas corporativos.\n• Contribuições: Contribuiu para filtros de segurança no Google Gemini Cookbook.`
                        },
                        {
                            title: '3. Formação e Habilidades',
                            content: `Bacharel em Ciência da Computação pela UNAMA e Mestrando pela UNICAMP. Poliglota e proficiente em Python, infraestrutura como código e operacionalização de modelos de ML.`
                        },
                        {
                            title: '4. Insights para Abordagem',
                            content: `Foco em operacionalização confiável de modelos de ML e segurança em IA. Valoriza ferramentas que empoderam desenvolvedores e soluções técnicas reais.`
                        }
                    ]
                };
            } else {
                researchData = {
                    lead: formData.name,
                    company: formData.company,
                    segment: formData.segment || 'Varejo / Tecnologia',
                    sections: [
                        {
                            title: '1. Perfil Executivo e Presença Digital',
                            content: `Investigação sobre ${formData.name}. Atualmente identificado como um player estratégico na estratégia da ${formData.company}.`
                        },
                        {
                            title: '2. Análise de Mercado (2025-2026)',
                            content: `O setor de ${formData.segment || 'Varejo'} no Brasil projeta crescimento de 71% em tecnologia até 2025.`
                        },
                        {
                            title: '3. Operações e Logística',
                            content: `Oportunidade de reduzir custos em até 30% via automação de sistemas.`
                        },
                        {
                            title: '4. Insights Estratégicos',
                            content: `Abordagem deve focar em eficiência operacional via IA e melhoria do ROI.`
                        }
                    ]
                };
            }

            setResult(researchData);
            setIsSearching(false);

            if (onResultsGenerated) {
                onResultsGenerated(researchData, []);
            }

            toast({
                title: "Dossiê Investigativo Gerado",
                description: `Análise detalhada sobre ${researchData.lead} concluída.`,
            });
        }, 2500);
    };

    const handleGenerateEmails = () => {
        if (!result) return;
        setIsGeneratingEmails(true);

        setTimeout(() => {
            const emails = [
                {
                    id: 1,
                    sequence: 1,
                    subject: `Desafio de Inovação na ${result.company}`,
                    body: `Olá ${result.lead.split(' ')[0]},\n\nNotei que a ${result.company} está focada em ${result.segment}. Com as tendências de 2026 apontando para IA como infraestrutura básica, gostaria de discutir como podemos otimizar seu faturamento.\n\nAbraço.`
                },
                {
                    id: 2,
                    sequence: 2,
                    subject: `Eficiência Operacional na ${result.company}`,
                    body: `Oi ${result.lead.split(' ')[0]},\n\nComplementando meu contato anterior, vi que a automação pode reduzir em até 30% seus custos logísticos. Temos cases específicos para o seu segmento.\n\nPodemos falar 5 minutos?`
                },
                {
                    id: 3,
                    sequence: 3,
                    subject: `Insights Estratégicos para ${result.lead}`,
                    body: `Prezado ${result.lead},\n\nBaseado na sua trajetória com transformação digital, acredito que a abordagem que estamos utilizando faria sentido para a ${result.company}.\n\nAbs.`
                },
                {
                    id: 4,
                    sequence: 4,
                    subject: `Próximos passos - ${result.company}`,
                    body: `Olá ${result.lead.split(' ')[0]},\n\nPara não tomar seu tempo, caso não tenha interesse agora, deixo aqui nosso material de apoio sobre tendências de mercado para 2026.\n\nSucesso!`
                }
            ];
            setGeneratedEmails(emails);
            setIsGeneratingEmails(false);

            if (onResultsGenerated) {
                onResultsGenerated(result, emails);
            }

            toast({
                title: "E-mails Gerados",
                description: "Sequência de 4 e-mails criada com sucesso.",
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
                                <Label htmlFor="emailPrompt" className="text-xs font-semibold uppercase text-muted-foreground">Prompt para os E-mails</Label>
                                <textarea
                                    id="emailPrompt"
                                    className="w-full min-h-[100px] p-4 rounded-xl bg-muted/30 border-none text-sm focus:ring-2 focus:ring-primary transition-all text-white placeholder:text-muted-foreground"
                                    placeholder="Ex: Quero uma série de 4 e-mails focados em redução de custos logísticos usando IA..."
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
        </div>
    );
}
