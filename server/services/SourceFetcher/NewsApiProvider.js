const axios = require('axios');
const FetcherBase = require('./FetcherBase');

class NewsApiProvider extends FetcherBase {
  constructor() {
    super('NewsAPI');
    this.apiKey = process.env.NEWS_API_KEY;
  }

  async fetchData(query) {
    if (!this.apiKey) {
      return []; // Silently skip if no API key
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        pageSize: 5,
        sortBy: 'relevancy',
        language: 'en'
      },
      headers: {
        'X-Api-Key': this.apiKey
      }
    });

    return response.data.articles || [];
  }

  normalize(rawData) {
    return rawData
      .filter(item => item.title && item.url)
      .map(item => ({
        title: item.title,
        author: item.author || 'Unknown',
        summary: item.description || item.content || 'No description available.',
        url: item.url,
        year: item.publishedAt ? new Date(item.publishedAt).getFullYear().toString() : 'Unknown',
        source: 'News API',
        publisher: item.source && item.source.name ? item.source.name : 'News Outlet',
        sourceType: 'News',
        retrievedTime: new Date().toISOString()
      }));
  }
}

module.exports = NewsApiProvider;
