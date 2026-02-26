import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, FileText, Upload, Download, Globe, User, Building2, MapPin } from 'lucide-react';
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
                description: `O arquivo ${e.target.files[0].name} será usado como modelo.`,
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
        // Simulação de pesquisa
        setTimeout(() => {
            setResult({
                summary: `Informações detalhadas sobre ${formData.name} da empresa ${formData.company}.`,
                details: [
                    { label: 'Cargo Provável', value: 'Diretor de Inovação / Tecnologia' },
                    { label: 'Últimas Notícias', value: `${formData.company} expande operações no setor de ${formData.segment || 'tecnologia'}.` },
                    { label: 'LinkedIn', value: `linkedin.com/in/${formData.name.toLowerCase().replace(' ', '-')}` },
                    { label: 'Presença Digital', value: `O site ${formData.website || formData.company.toLowerCase() + '.com'} apresenta crescimento em tráfego orgânico.` },
                    { label: 'Insight Estratégico', value: 'A empresa demonstrou interesse recente em soluções de IA e automação.' }
                ]
            });
            setIsSearching(false);
            toast({
                title: "Pesquisa concluída",
                description: "Inteligência de mercado gerada com sucesso.",
            });
        }, 2000);
    };

    const generatePDF = () => {
        if (!result) return;

        const doc = new jsPDF();
        const margin = 20;
        let y = 20;

        doc.setFontSize(18);
        doc.text('Relatório de Inteligência de Mercado', margin, y);
        y += 15;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Dados do Lead:', margin, y);
        y += 7;
        doc.setFont('helvetica', 'normal');
        doc.text(`Nome: ${formData.name}`, margin, y);
        y += 7;
        doc.text(`Empresa: ${formData.company}`, margin, y);
        y += 7;
        doc.text(`Segmento: ${formData.segment || 'N/A'}`, margin, y);
        y += 7;
        doc.text(`Site: ${formData.website || 'N/A'}`, margin, y);
        y += 15;

        doc.setFont('helvetica', 'bold');
        doc.text('Resultados da Pesquisa:', margin, y);
        y += 10;
        doc.setFont('helvetica', 'normal');

        result.details.forEach((item: any) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            doc.setFont('helvetica', 'bold');
            doc.text(`${item.label}:`, margin, y);
            y += 7;
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(item.value, 170);
            doc.text(lines, margin, y);
            y += (lines.length * 7) + 5;
        });

        if (referenceFile) {
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text(`Formato baseado no arquivo: ${referenceFile.name}`, margin, 285);
        }

        doc.save(`Inteligencia_${formData.company.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Dados do Lead e Empresa
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Lead</Label>
                        <Input id="name" placeholder="Ex: João Silva" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input id="company" placeholder="Ex: Tech Solutions" value={formData.company} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="segment">Segmento</Label>
                        <Input id="segment" placeholder="Ex: Varejo" value={formData.segment} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website">Site da Empresa</Label>
                        <Input id="website" placeholder="Ex: www.techsolutions.com" value={formData.website} onChange={handleInputChange} />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Material de Referência (Opcional)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 hover:bg-muted/30 transition-colors">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-4">Arraste ou selecione o arquivo que servirá de modelo para o PDF</p>
                        <div className="relative">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                            <Button variant="outline" size="sm">
                                {referenceFile ? referenceFile.name : 'Selecionar Arquivo'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
                <Button onClick={handleSearch} disabled={isSearching} className="gap-2">
                    {isSearching ? <Search className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                    {isSearching ? 'Pesquisando...' : 'Pesquisar Inteligência'}
                </Button>
            </div>

            {result && (
                <Card className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-bottom-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex justify-between items-center">
                            <span>Resultado da Pesquisa</span>
                            <Button onClick={generatePDF} variant="secondary" size="sm" className="gap-2">
                                <Download className="w-4 h-4" />
                                Baixar PDF
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {result.details.map((item: any, i: number) => (
                                <div key={i} className="space-y-1">
                                    <h4 className="text-sm font-semibold text-primary">{item.label}</h4>
                                    <p className="text-sm text-foreground">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
