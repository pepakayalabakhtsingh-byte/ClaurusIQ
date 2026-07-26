const axios = require('axios');
const FetcherBase = require('./FetcherBase');

class CrossrefProvider extends FetcherBase {
  constructor() {
    super('Crossref');
  }

  async fetchData(query) {
    // Crossref REST API (Free)
    const response = await axios.get('https://api.crossref.org/works', {
      params: {
        query: query,
        rows: 5,
        select: 'title,author,URL,abstract,published-print,publisher'
      },
      headers: {
        'User-Agent': 'ClaurusIQ/1.0 (mailto:admin@claurusiq.com)'
      }
    });

    return response.data.message.items || [];
  }

  normalize(rawData) {
    return rawData.map(item => {
      let authorString = 'Unknown';
      if (item.author && item.author.length > 0) {
        authorString = item.author.map(a => `${a.given || ''} ${a.family || ''}`).join(', ');
      }
      
      let year = 'Unknown';
      if (item['published-print'] && item['published-print']['date-parts']) {
        year = item['published-print']['date-parts'][0][0].toString();
      }

      let summary = item.abstract || 'No abstract available.';
      // Remove HTML tags often found in Crossref abstracts
      summary = summary.replace(/<[^>]*>?/gm, '');

      return {
        title: item.title ? item.title[0] : 'Untitled',
        author: authorString,
        summary: summary,
        url: item.URL || '',
        year: year,
        source: 'Crossref',
        publisher: item.publisher || 'Academic Journal',
        sourceType: 'Research Paper',
        retrievedTime: new Date().toISOString()
      };
    });
  }
}

module.exports = CrossrefProvider;
