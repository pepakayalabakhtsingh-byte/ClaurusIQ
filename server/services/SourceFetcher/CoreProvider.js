const axios = require('axios');
const FetcherBase = require('./FetcherBase');

class CoreProvider extends FetcherBase {
  constructor() {
    super('CORE');
    this.apiKey = process.env.CORE_API_KEY;
  }

  async fetchData(query) {
    if (!this.apiKey) {
      return []; // Silently skip if no API key
    }

    // CORE API V3
    const response = await axios.get('https://api.core.ac.uk/v3/search/works', {
      params: {
        q: query,
        limit: 5
      },
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    return response.data.results || [];
  }

  normalize(rawData) {
    return rawData
      .filter(item => item.title)
      .map(item => {
        let authorString = 'Unknown';
        if (item.authors && item.authors.length > 0) {
          authorString = item.authors.map(a => a.name).join(', ');
        }
        
        let url = '';
        if (item.downloadUrl) url = item.downloadUrl;
        else if (item.links && item.links.length > 0) url = item.links[0].url;
        else if (item.sourceFulltextUrls && item.sourceFulltextUrls.length > 0) url = item.sourceFulltextUrls[0];
        
        return {
          title: item.title,
          author: authorString,
          summary: item.abstract || 'No abstract available.',
          url: url,
          year: item.publishedDate ? new Date(item.publishedDate).getFullYear().toString() : (item.year ? item.year.toString() : 'Unknown'),
          source: 'CORE',
          publisher: item.publisher || 'Academic Repository',
          sourceType: 'Research Paper',
          retrievedTime: new Date().toISOString()
        };
      });
  }
}

module.exports = CoreProvider;
