
export async function generateWithGemini(prompt: string, systemInstruction: string = "") {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log("Debug: Verificando chave Gemini...");

    if (!apiKey) {
        console.error("Debug: VITE_GEMINI_API_KEY está undefined ou vazio.");
        throw new Error('Chave da API do Gemini não encontrada. POR FAVOR, REINICIE O SERVIDOR (Ctrl+C e npm run dev).');
    }

    if (apiKey === "SUA_CHAVE_AQUI") {
        console.error("Debug: A chave ainda é o placeholder 'SUA_CHAVE_AQUI'.");
        throw new Error('Chave da API do Gemini ainda está como o texto padrão no arquivo .env');
    }

    console.log("Debug: Chave Gemini detectada (Tamanho:", apiKey.length, ")");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const body = {
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }]
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
