import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Upload, Image as ImageIcon, Code, Sparkles, Send, Download } from 'lucide-react';
import { NurturingEmail, EmailContact } from '@/types/email';
import { generateWithGemini } from '@/utils/geminiApi';
import { useToast } from '@/hooks/use-toast';

interface ManualEmailGeneratorProps {
    onGenerate: (emails: NurturingEmail[]) => void;
}

export function ManualEmailGenerator({ onGenerate }: ManualEmailGeneratorProps) {
    const [prompt, setPrompt] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [mode, setMode] = useState<'prompt' | 'html' | 'image'>('prompt');
    const [emailHistory, setEmailHistory] = useState<{ role: 'user' | 'model', content: string }[]>([]);
    const [refinement, setRefinement] = useState('');
    const [lastGeneratedEmails, setLastGeneratedEmails] = useState<NurturingEmail[]>([]);
    const { toast } = useToast();

    const handleGenerate = async (isRefinement: boolean = false) => {
        setIsGenerating(true);
        try {
            const systemInstruction = "Você é um especialista em Copywriting B2B e HTML de e-mails. Sua missão é gerar e-mails altamente profissionais e persuasivos. Sempre retorne o conteúdo em HTML completo.";

            const currentPrompt = isRefinement ? refinement : prompt;

            let userPrompt = "";
            if (!isRefinement) {
                userPrompt = mode === 'prompt'
                    ? `Gere um e-mail B2B persuasivo com base neste pedido: "${prompt}". Retorne o HTML completo.`
                    : mode === 'html'
                        ? `Melhore este HTML de e-mail e torne-o mais persuasivo:\n${htmlContent}`
                        : `Analise as intenções deste print de e-mail e gere um novo e-mail baseado nele.`;
            } else {
                userPrompt = `
                    O usuário solicitou uma alteração no e-mail gerado anteriormente.
                    Histórico: ${JSON.stringify(emailHistory, null, 2)}
                    Pedido de Refinamento: "${refinement}"
                    Por favor, re-gere o e-mail aplicando as alterações solicitadas. Retorne sempre o HTML completo.
                `;
            }

            const aiResponse = await generateWithGemini(userPrompt, systemInstruction);

            const subjectMatch = aiResponse.match(/Assunto: (.*)/) || aiResponse.match(/Subject: (.*)/);
            const subject = subjectMatch ? subjectMatch[1] : "Sua proposta personalizada da Deal";
            const cleanHtml = aiResponse.replace(/(Assunto|Subject): .*/i, '').trim();

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
            setLastGeneratedEmails(generatedEmails);

            // Atualizar histórico
            const newHistory = [
                ...emailHistory,
                { role: 'user' as const, content: currentPrompt },
                { role: 'model' as const, content: 'E-mail gerado com sucesso em HTML.' }
            ];
            setEmailHistory(newHistory.slice(-6));

            if (!isRefinement) {
                setPrompt('');
                setHtmlContent('');
                setImage(null);
            } else {
                setRefinement('');
            }

            toast({
                title: isRefinement ? "E-mail Refinado" : "E-mail Gerado",
                description: "O conteúdo foi atualizado via Gemini AI.",
            });
        } catch (error: any) {
            console.error("Gemini email generation failed:", error);
            toast({
                title: "Erro na Geração",
                description: "Não foi possível processar o seu pedido.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-lg">
            <div className="p-4 border-b border-border bg-muted/20 flex gap-2 overflow-x-auto">
                <Button
                    variant={mode === 'prompt' ? 'default' : 'outline'}
                    onClick={() => setMode('prompt')}
                    className="gap-2 shrink-0"
                >
                    <Sparkles className="w-4 h-4" /> Prompts
                </Button>
                <Button
                    variant={mode === 'html' ? 'default' : 'outline'}
                    onClick={() => setMode('html')}
                    className="gap-2 shrink-0"
                >
                    <Code className="w-4 h-4" /> HTML
                </Button>
                <Button
                    variant={mode === 'image' ? 'default' : 'outline'}
                    onClick={() => setMode('image')}
                    className="gap-2 shrink-0"
                >
                    <ImageIcon className="w-4 h-4" /> Print/Imagem
                </Button>
            </div>

            <div className="p-6 space-y-6">
                {mode === 'prompt' && (
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Descreva o tipo de e-mail que deseja gerar:</label>
                        <textarea
                            className="w-full min-h-[120px] p-4 rounded-xl border border-input bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                            placeholder="Ex: Crie um email curto e persuasivo oferecendo um convite para o jantar de IA..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                )}

                {mode === 'html' && (
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Cole o HTML do seu e-mail modelo:</label>
                        <textarea
                            className="w-full min-h-[120px] p-4 rounded-xl border border-input bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono text-xs"
                            placeholder="<html><body><h1>Seu título aqui...</h1></body></html>"
                            value={htmlContent}
                            onChange={(e) => setHtmlContent(e.target.value)}
                            rows={8}
                        />
                    </div>
                )}

                {mode === 'image' && (
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Faça upload de um print para servir de base:</label>
                        <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground mb-4">Arraste uma imagem ou clique para procurar</p>
                            <Input
                                type="file"
                                accept="image/*"
                                className="max-w-xs cursor-pointer opacity-0 absolute h-20 w-60"
                                onChange={(e) => setImage(e.target.files?.[0] || null)}
                            />
                            {image && (
                                <p className="text-xs text-primary mt-2 font-bold uppercase tracking-widest">Selecionado: {image.name}</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-end border-b border-border pb-6">
                    <Button
                        onClick={() => handleGenerate(false)}
                        disabled={
                            isGenerating ||
                            (mode === 'prompt' && !prompt) ||
                            (mode === 'html' && !htmlContent) ||
                            (mode === 'image' && !image)
                        }
                        className="gap-2 bg-primary hover:bg-primary/90 font-bold uppercase text-xs tracking-widest px-6"
                    >
                        {isGenerating ? <Send className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {isGenerating ? 'Gerando...' : 'Gerar E-mail'}
                    </Button>
                </div>

                {lastGeneratedEmails.length > 0 && (
                    <div className="pt-2 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-2 text-primary mb-4">
                            <Sparkles className="w-5 h-5" />
                            <h4 className="font-bold uppercase text-sm tracking-widest">Refinar este e-mail</h4>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Peça uma alteração (ex: deixe mais executivo)..."
                                value={refinement}
                                onChange={(e) => setRefinement(e.target.value)}
                                className="flex-1 bg-muted/20 border-primary/20"
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate(true)}
                            />
                            <Button
                                onClick={() => handleGenerate(true)}
                                disabled={isGenerating || !refinement}
                                variant="secondary"
                                className="font-bold uppercase text-xs"
                            >
                                Refinar
                            </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic mt-3">
                            💡 O Gemini agora lembra desta conversa e aplicará seus pedidos de alteração no conteúdo.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
