const axios = require('axios');

/**
 * Searches real academic research papers using Semantic Scholar API as primary engine,
 * falling back to arXiv API if Semantic Scholar fails or returns empty.
 */
const searchAcademicPapers = async (query, maxResults = 5) => {
  if (!query || !query.trim()) return [];
  const papers = [];

  // Step 1: Semantic Scholar API (Primary)
  try {
    const semanticUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=${maxResults}&fields=title,authors,year,abstract,url,citationCount`;
    const response = await axios.get(semanticUrl, {
      timeout: 5000,
      headers: { 'User-Agent': 'TeamForgeAI-AcademicBot/1.0' }
    });

    if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      for (const p of response.data.data) {
        if (p.title) {
          papers.push({
            title: p.title,
            authors: Array.isArray(p.authors) && p.authors.length > 0 ? p.authors.map(a => a.name) : ['Unknown Author'],
            year: p.year ? String(p.year) : 'Recent',
            abstract: p.abstract || 'No abstract preview provided in Semantic Scholar database record.',
            citationCount: typeof p.citationCount === 'number' ? p.citationCount : 0,
            url: p.url || `https://www.semanticscholar.org/paper/${p.paperId || ''}`,
            source: 'Semantic Scholar'
          });
        }
      }
      if (papers.length > 0) {
        return papers;
      }
    }
  } catch (err) {
    console.warn(`[Academic API Warning] Semantic Scholar API skipped or failed (${err.message}). Falling back to arXiv API...`);
  }

  // Step 2: arXiv API (Fallback)
  try {
    const arxivUrl = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=${maxResults}`;
    const response = await axios.get(arxivUrl, { timeout: 5000 });

    if (response.data && typeof response.data === 'string') {
      const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
      let match;
      while ((match = entryRegex.exec(response.data)) !== null) {
        const entryStr = match[1];
        const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(entryStr);
        const summaryMatch = /<summary>([\s\S]*?)<\/summary>/.exec(entryStr);
        const idMatch = /<id>([\s\S]*?)<\/id>/.exec(entryStr);
        const publishedMatch = /<published>([\s\S]*?)<\/published>/.exec(entryStr);

        // Extract authors from XML
        const authorRegex = /<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g;
        const authorNames = [];
        let authorMatch;
        while ((authorMatch = authorRegex.exec(entryStr)) !== null) {
          authorNames.push(authorMatch[1].trim());
        }

        if (titleMatch && summaryMatch) {
          const cleanTitle = titleMatch[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
          const cleanAbstract = summaryMatch[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

          papers.push({
            title: cleanTitle,
            authors: authorNames.length > 0 ? authorNames : ['arXiv Author'],
            year: publishedMatch ? publishedMatch[1].substring(0, 4) : '2024',
            abstract: cleanAbstract,
            citationCount: 0,
            url: idMatch ? idMatch[1].trim() : 'https://arxiv.org',
            source: 'arXiv'
          });
        }
      }
    }
  } catch (err) {
    console.warn(`[Academic API Warning] arXiv API search failed: ${err.message}`);
  }

  return papers;
};

module.exports = { searchAcademicPapers };
