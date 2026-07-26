const axios = require('axios');
const FetcherBase = require('./FetcherBase');

class SemanticScholarProvider extends FetcherBase {
  constructor() {
    super('SemanticScholar');
    this.apiKey = process.env.SEMANTIC_SCHOLAR_API_KEY;
  }

  async fetchData(query) {
    const config = {
      params: {
        query: query,
        limit: 5,
        fields: 'title,authors,abstract,url,year,venue'
      }
    };
    if (this.apiKey) {
      config.headers = { 'x-api-key': this.apiKey };
    }
    const response = await axios.get('https://api.semanticscholar.org/graph/v1/paper/search', config);

    return response.data.data || [];
  }

  normalize(rawData) {
    return rawData.map(item => ({
      title: item.title,
      author: item.authors && item.authors.length > 0 ? item.authors.map(a => a.name).join(', ') : 'Unknown',
      summary: item.abstract || 'No abstract available.',
      url: item.url || `https://www.semanticscholar.org/paper/${item.paperId}`,
      year: item.year ? item.year.toString() : 'Unknown',
      source: 'Semantic Scholar',
      publisher: item.venue || 'Academic Journal',
      sourceType: 'Research Paper',
      retrievedTime: new Date().toISOString()
    }));
  }
}

module.exports = SemanticScholarProvider;
