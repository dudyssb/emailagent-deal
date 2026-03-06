import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Upload, Image as ImageIcon, Code, Sparkles, Send } from 'lucide-react';
import { NurturingEmail, EmailContact } from '@/types/email';
import { generateWithGemini } from '@/utils/geminiApi';

interface ManualEmailGeneratorProps {
    onGenerate: (emails: NurturingEmail[]) => void;
}

export function ManualEmailGenerator({ onGenerate }: ManualEmailGeneratorProps) {
    const [prompt, setPrompt] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [mode, setMode] = useState<'prompt' | 'html' | 'image'>('prompt');

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const systemInstruction = "Você é um especialista em Copywriting para E-mails de Vendas e Consultoria de TI. Seu tom é profissional, amigável e focado em gerar valor. Gere sempre um HTML completo e moderno.";

            const userPrompt = mode === 'prompt'
                ? prompt
                : mode === 'html'
                    ? `Melhore este HTML de e-mail e torne-o mais persuasivo:\n${htmlContent}`
                    : `Analise as intenções deste print de e-mail e gere um novo e-mail baseado nele.`;

            const aiResponse = await generateWithGemini(userPrompt, systemInstruction);

            // Tenta extrair assunto e corpo se o Gemini formatar assim, senão usa padrão
            const subjectMatch = aiResponse.match(/Assunto: (.*)/);
            const subject = subjectMatch ? subjectMatch[1] : "Sua proposta personalizada da Deal";
            const cleanHtml = aiResponse.replace(/Assunto: .*/, '').trim();

            const mockContact: EmailContact = {
                nome: 'Lead Selecionado',
                email: 'contato@empresa.com',
                segmento: 'Outros' as any
            };

            const generatedEmails: NurturingEmail[] = [
                {
                    id: Date.now().toString(),
                    sequence: 1,
                    subject: subject,
                    htmlContent: cleanHtml.includes('<html>') ? cleanHtml : `<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">${cleanHtml.replace(/\n/g, '<br>')}</body></html>`,
                    targetContact: mockContact
                }
            ];

            onGenerate(generatedEmails);
            setPrompt('');
            setHtmlContent('');
            setImage(null);
        } catch (error: any) {
            console.error("Gemini email generation failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/20 flex gap-2">
                <Button
                    variant={mode === 'prompt' ? 'default' : 'outline'}
                    onClick={() => setMode('prompt')}
                    className="gap-2"
                >
                    <Sparkles className="w-4 h-4" /> Prompts
                </Button>
                <Button
                    variant={mode === 'html' ? 'default' : 'outline'}
                    onClick={() => setMode('html')}
                    className="gap-2"
                >
                    <Code className="w-4 h-4" /> HTML
                </Button>
                <Button
                    variant={mode === 'image' ? 'default' : 'outline'}
                    onClick={() => setMode('image')}
                    className="gap-2"
                >
                    <ImageIcon className="w-4 h-4" /> Print/Imagem
                </Button>
            </div>

            <div className="p-6 space-y-4">
                {mode === 'prompt' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descreva o tipo de e-mail que deseja gerar:</label>
                        <textarea
                            className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Ex: Crie um email curto e persuasivo oferecendo um desconto de 20% para a Black Friday..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                )}

                {mode === 'html' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cole o HTML do seu e-mail modelo:</label>
                        <textarea
                            className="w-full min-h-[logo] p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono text-xs"
                            placeholder="<html><body><h1>Seu título aqui...</h1></body></html>"
                            value={htmlContent}
                            onChange={(e) => setHtmlContent(e.target.value)}
                            rows={8}
                        />
                    </div>
                )}

                {mode === 'image' && (
                    <div className="space-y-4">
                        <label className="text-sm font-medium">Faça upload de um print para servir de base:</label>
                        <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors">
                            <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground mb-4">Arraste uma imagem ou clique para procurar</p>
                            <Input
                                type="file"
                                accept="image/*"
                                className="max-w-xs cursor-pointer"
                                onChange={(e) => setImage(e.target.files?.[0] || null)}
                            />
                            {image && (
                                <p className="text-xs text-primary mt-2 font-medium">Arquivo selecionado: {image.name}</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="pt-2 flex justify-end">
                    <Button
                        onClick={handleGenerate}
                        disabled={
                            isGenerating ||
                            (mode === 'prompt' && !prompt) ||
                            (mode === 'html' && !htmlContent) ||
                            (mode === 'image' && !image)
                        }
                        className="gap-2"
                    >
                        {isGenerating ? (
                            <span className="animate-pulse">Gerando...</span>
                        ) : (
                            <>
                                <Send className="w-4 h-4" /> Gerar E-mail
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
