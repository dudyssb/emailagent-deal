
export async function generateWithGemini(prompt: string, systemInstruction: string = "", imageData?: { mimeType: string, data: string }) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('Chave da API do Gemini não encontrada.');
    }

    // v1beta suporta response_mime_type: 'application/json'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const parts: any[] = [{ text: prompt }];

    if (imageData) {
        parts.push({
            inline_data: {
                mime_type: imageData.mimeType,
                data: imageData.data
            }
        });
    }

    const body = {
        contents: [
            {
                role: "user",
                parts: parts
            }
        ],
        system_instruction: systemInstruction ? {
            parts: [{ text: systemInstruction }]
        } : undefined,
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            response_mime_type: "application/json"
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `Erro na API do Gemini (${response.status})`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
        console.error('Erro ao chamar Gemini:', error);
        throw error;
    }
}
