class SourceQualityEngine {
  /**
   * Categorizes the source based on URL and provider.
   * @param {Object} metadata 
   * @returns {string} Category
   */
  static categorize(metadata) {
    const url = (metadata.url || '').toLowerCase();
    const provider = metadata.provider || '';

    if (url.includes('.gov')) return 'Government';
    if (url.includes('.edu')) return 'University';
    if (provider === 'Semantic Scholar' || provider === 'Crossref' || url.includes('doi.org')) return 'Peer-reviewed Journal';
    if (provider === 'CORE' || url.includes('arxiv.org') || url.includes('researchgate')) return 'Research Paper';
    if (provider === 'NewsAPI' || url.includes('news') || url.includes('times.com') || url.includes('bbc.co')) return 'News';
    if (url.includes('wikipedia.org')) return 'Wikipedia';
    if (url.includes('blog') || url.includes('medium.com')) return 'Blog';
    
    // Check organizations
    if (url.includes('.org') || url.includes('.int')) return 'Official Organization';

    return 'Unknown';
  }
}

module.exports = SourceQualityEngine;
