class MetadataExtractor {
  /**
   * Enriches raw evidence from Phase 4 to ensure citation fields are present.
   * @param {Object} rawEvidence 
   * @returns {Object} enriched source object
   */
  static extract(rawEvidence) {
    const enriched = {
      title: rawEvidence.source || 'Unknown Title',
      author: rawEvidence.author || 'Unknown Author',
      publisher: rawEvidence.publication || rawEvidence.provider || 'Unknown Publisher',
      year: rawEvidence.date || 'Unknown Year',
      url: rawEvidence.url || '',
      doi: '',
      provider: rawEvidence.provider || 'Unknown'
    };

    // Attempt to extract DOI from URL if present
    if (enriched.url.includes('doi.org/')) {
      enriched.doi = enriched.url.split('doi.org/')[1].split(/[#?]/)[0];
    } else if (enriched.url.includes('10.')) {
      const doiMatch = enriched.url.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i);
      if (doiMatch) {
        enriched.doi = doiMatch[0];
      }
    }

    return enriched;
  }
}

module.exports = MetadataExtractor;
