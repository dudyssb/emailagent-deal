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
    const [refinementImage, setRefinementImage] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [mode, setMode] = useState<'prompt' | 'html' | 'image'>('prompt');
    const [emailHistory, setEmailHistory] = useState<{ role: 'user' | 'model', content: string }[]>([]);
    const [refinement, setRefinement] = useState('');
    const [lastGeneratedEmails, setLastGeneratedEmails] = useState<NurturingEmail[]>([]);
    const { toast } = useToast();

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result as string;
                resolve(base64String.split(',')[1]);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleGenerate = async (isRefinement: boolean = false) => {
        setIsGenerating(true);
        try {
            const systemInstruction = `Você é um Especialista em Copywriting B2B e HTML. 
            REGRAS CRÍTICAS:
            1. Retorne SEMPRE um JSON com as chaves "subject" e "body".
            2. O campo "body" deve ser um HTML COMPLETO e PROFISSIONAL.
            3. NÃO adicione nenhum texto explicativo, saudação ou conversa fora do JSON.
            4. Responda APENAS o objeto JSON.`;

            const currentPrompt = isRefinement ? refinement : prompt;
            const currentImage = isRefinement ? refinementImage : image;

            let imageData = undefined;
            if (currentImage) {
                const base64Data = await fileToBase64(currentImage);
                imageData = {
                    mimeType: currentImage.type,
                    data: base64Data
                };
            }

            let userPrompt = "";
            if (!isRefinement) {
                userPrompt = mode === 'prompt'
                    ? `Gere um e-mail B2B persuasivo com base neste pedido: "${prompt}".`
                    : mode === 'html'
                        ? `Melhore este HTML de e-mail e torne-o mais persuasivo:\n${htmlContent}`
                        : `Analise as intenções deste print de e-mail e gere um novo e-mail baseado nele.`;
            } else {
                userPrompt = `
                    O usuário solicitou uma alteração no e-mail anterior.
                    Histórico: ${JSON.stringify(emailHistory, null, 2)}
                    Alteração desejada: "${refinement}"
                    Re-gere o JSON com subject e body (HTML).
                `;
            }

            const aiResponse = await generateWithGemini(userPrompt, systemInstruction, imageData);

            // Tenta extrair JSON (Gemini às vezes coloca em blocos de código)
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Não foi possível processar a resposta da IA. Tente novamente.");

            const emailData = JSON.parse(jsonMatch[0]);
            const subject = emailData.subject || "Proposta Estratégica Deal";
            const body = emailData.body || "";

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
                    htmlContent: body.includes('<html>') ? body : `<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">${body.replace(/\n/g, '<br>')}</body></html>`,
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
                setRefinementImage(null);
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
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Descreva o tipo de e-mail que deseja gerar:</label>
                            <textarea
                                className="w-full min-h-[120px] p-4 rounded-xl border border-input bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                                placeholder="Ex: Crie um email curto e persuasivo oferecendo um convite para o jantar de IA..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Button variant="outline" size="sm" className="gap-2 text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" />
                                    {image ? "Trocar Imagem" : "Anexar Referência"}
                                </Button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                                />
                            </div>
                            {image && (
                                <span className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">
                                    {image.name}
                                </span>
                            )}
                        </div>
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
                        <div className="flex gap-2 items-center">
                            <Input
                                placeholder="Peça uma alteração (ex: deixe mais executivo)..."
                                value={refinement}
                                onChange={(e) => setRefinement(e.target.value)}
                                className="flex-1 bg-muted/20 border-primary/20 h-10"
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate(true)}
                            />
                            <div className="relative">
                                <Button variant="outline" size="icon" className={cn("h-10 w-10 border-primary/20", refinementImage && "bg-primary/10 border-primary")}>
                                    <Upload className="w-4 h-4" />
                                </Button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => setRefinementImage(e.target.files?.[0] || null)}
                                />
                            </div>
                            <Button
                                onClick={() => handleGenerate(true)}
                                disabled={isGenerating || (!refinement && !refinementImage)}
                                variant="secondary"
                                className="font-bold uppercase text-xs h-10 px-6"
                            >
                                Refinar
                            </Button>
                        </div>
                        {refinementImage && (
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">
                                    📷 {refinementImage.name}
                                </span>
                                <Button variant="ghost" size="sm" className="h-4 p-0 text-[8px] uppercase text-muted-foreground hover:text-destructive" onClick={() => setRefinementImage(null)}>
                                    Remover
                                </Button>
                            </div>
                        )}
                        <p className="text-[10px] text-muted-foreground italic mt-3">
                            💡 O Gemini agora lembra desta conversa e aplicará seus pedidos (texto e imagem) no conteúdo.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
