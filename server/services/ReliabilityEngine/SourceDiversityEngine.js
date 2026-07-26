class SourceDiversityEngine {
  /**
   * Evaluates the diversity of the collected sources.
   * @param {Array<Object>} sources - Array of deduplicated citations/sources
   * @returns {Object} Diversity analysis result
   */
  static analyze(sources) {
    if (!sources || sources.length === 0) {
      return { score: 0, independentSources: 0, publishers: 0, categories: 0, level: 'None' };
    }

    const uniquePublishers = new Set();
    const uniqueCategories = new Set();

    sources.forEach(src => {
      if (src.publisher && src.publisher !== 'Unknown Publisher') {
        uniquePublishers.add(src.publisher);
      } else if (src.url) {
        // Fallback: extract domain as publisher
        try {
          const urlObj = new URL(src.url);
          uniquePublishers.add(urlObj.hostname.replace('www.', ''));
        } catch(e) {}
      }

      if (src.sourceCategory) {
        uniqueCategories.add(src.sourceCategory);
      }
    });

    const independentCount = sources.length;
    const publisherCount = uniquePublishers.size;
    const categoryCount = uniqueCategories.size;

    // Calculate Diversity Score (0-100)
    // A highly diverse set has many publishers across multiple categories.
    let score = Math.min(100, (publisherCount * 10) + (categoryCount * 15));
    
    let level = 'Very Low';
    if (score >= 80) level = 'Excellent';
    else if (score >= 60) level = 'High';
    else if (score >= 40) level = 'Moderate';
    else if (score >= 20) level = 'Low';

    return {
      score,
      level,
      independentSources: independentCount,
      publishers: publisherCount,
      categories: categoryCount
    };
  }
}

module.exports = SourceDiversityEngine;
