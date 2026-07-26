const axios = require('axios');
const FetcherBase = require('./FetcherBase');

class TavilyProvider extends FetcherBase {
  constructor() {
    super('Tavily');
    this.apiKey = process.env.TAVILY_API_KEY;
  }

  async fetchData(query) {
    if (!this.apiKey) throw new Error('TAVILY_API_KEY is missing');

    const response = await axios.post('https://api.tavily.com/search', {
      api_key: this.apiKey,
      query: query,
      search_depth: 'advanced',
      include_answer: false,
      include_raw_content: false,
      max_results: 5
    });

    return response.data.results || [];
  }

  normalize(rawData) {
    return rawData.map(item => ({
      title: item.title,
      author: 'Unknown', // Tavily usually doesn't extract specific authors easily
      summary: item.content,
      url: item.url,
      year: new Date().getFullYear().toString(),
      source: 'Tavily Search',
      publisher: new URL(item.url).hostname,
      sourceType: 'Web',
      retrievedTime: new Date().toISOString()
    }));
  }
}

module.exports = TavilyProvider;
