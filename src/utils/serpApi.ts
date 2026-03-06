export async function searchLinkedIn(name: string, company: string = '') {
    const apiKey = import.meta.env.VITE_SERPAPI_KEY;
    if (!apiKey) {
        throw new Error('SerpApi key not found in environment variables');
    }

    const query = `site:linkedin.com/in "${name}" ${company}`;
    // Usando o proxy local para contornar erros de CORS
    const url = `/api/serpapi?engine=google&q=${encodeURIComponent(query)}&api_key=${apiKey}`;

    try {
        console.log(`Iniciando busca SerpApi para: ${query}`);
        const response = await fetch(url);

        if (!response.ok) {
            const errorMsg = `Erro na API SerpApi (${response.status}): ${response.statusText}`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log("Dados recebidos do SerpApi:", data);

        if (data.organic_results && data.organic_results.length > 0) {
            const results = data.organic_results.map((result: any) => ({
                title: result.title || 'Perfil LinkedIn',
                link: result.link,
                snippet: result.snippet || '',
                position: result.position
            }));
            console.log(`Encontrados ${results.length} resultados no LinkedIn`);
            return results;
        }
        console.warn("Nenhum resultado orgânico retornado pelo SerpApi");
        return [];
    } catch (error) {
        console.error('Error searching LinkedIn via SerpApi Proxy:', error);
        throw error;
    }
}
