class SourceScoring {
  /**
   * Assigns a credibility score to a source based on predefined rules.
   * @param {Object} source 
   * @returns {number} Score from 0 to 100
   */
  static scoreSource(source) {
    let score = 50; // Base score
    const url = source.url ? source.url.toLowerCase() : '';
    const sourceType = source.sourceType ? source.sourceType.toLowerCase() : '';
    
    // Evaluate by Domain TLD
    if (url.includes('.gov')) score = 98;
    else if (url.includes('.edu')) score = 95;
    else if (url.includes('wikipedia.org')) score = 80;
    else if (url.includes('.org')) score = 75;

    // Evaluate by Source Type (if domain doesn't explicitly override)
    if (score < 90) {
      if (sourceType.includes('research paper') || sourceType.includes('journal')) score = 94;
      else if (sourceType.includes('book')) score = 90;
      else if (sourceType.includes('news')) score = 75;
      else if (sourceType.includes('blog')) score = 55;
    }

    return score;
  }
}

module.exports = SourceScoring;
