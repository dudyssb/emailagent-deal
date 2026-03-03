export async function searchLinkedIn(name: string, company: string = '') {
    const apiKey = import.meta.env.VITE_SERPAPI_KEY;
    if (!apiKey) {
        throw new Error('SerpApi key not found in environment variables');
    }

    const query = `site:linkedin.com/in "${name}" ${company}`;
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.organic_results && data.organic_results.length > 0) {
            return data.organic_results.map((result: any) => ({
                title: result.title,
                link: result.link,
                snippet: result.snippet,
                position: result.position
            }));
        }
        return [];
    } catch (error) {
        console.error('Error searching LinkedIn via SerpApi:', error);
        throw error;
    }
}
