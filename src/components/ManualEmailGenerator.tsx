import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Upload, Image as ImageIcon, Code, Sparkles, Send } from 'lucide-react';
import { NurturingEmail, EmailContact } from '@/types/email';

interface ManualEmailGeneratorProps {
    onGenerate: (emails: NurturingEmail[]) => void;
}

export function ManualEmailGenerator({ onGenerate }: ManualEmailGeneratorProps) {
    const [prompt, setPrompt] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [mode, setMode] = useState<'prompt' | 'html' | 'image'>('prompt');

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate API call for generation
        setTimeout(() => {
            const mockContact: EmailContact = {
                nome: 'Lead Manual',
                email: 'lead@exemplo.com',
                segmento: 'Outros' as any
            };

            const generatedEmails: NurturingEmail[] = [
                {
                    id: Date.now().toString(),
                    sequence: 1,
                    subject: 'Seu email personalizado chegou',
                    htmlContent: `<html><body><h1>Olá ${mockContact.nome},</h1><p>Este é um email gerado a partir do seu ${mode === 'prompt' ? 'comando' : mode === 'html' ? 'código HTML' : 'print anexado'}.</p></body></html>`,
                    targetContact: mockContact
                }
            ];

            onGenerate(generatedEmails);
            setIsGenerating(false);
            setPrompt('');
            setHtmlContent('');
            setImage(null);
        }, 1500);
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
