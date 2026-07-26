class DuplicateDetector {
  /**
   * Deduplicates an array of source metadata objects.
   * Prioritizes sources with DOI, then by completeness.
   * @param {Array<Object>} sources 
   * @returns {Array<Object>} unique sources
   */
  static deduplicate(sources) {
    const uniqueMap = new Map();

    for (const source of sources) {
      if (!source.url && !source.title) continue; // Skip entirely empty
      
      // Create a unique key. Prefer DOI, then URL, then Title + Year
      let key = '';
      if (source.doi) {
        key = `doi:${source.doi}`;
      } else if (source.url) {
        key = `url:${source.url}`;
      } else {
        key = `title:${source.title.toLowerCase()}_year:${source.year}`;
      }

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, source);
      } else {
        // Merge strategy: Keep the one with more metadata
        const existing = uniqueMap.get(key);
        const existingScore = this.scoreCompleteness(existing);
        const newScore = this.scoreCompleteness(source);
        
        if (newScore > existingScore) {
          // Merge missing fields from existing to new, then replace
          if (existing.doi && !source.doi) source.doi = existing.doi;
          uniqueMap.set(key, source);
        }
      }
    }

    return Array.from(uniqueMap.values());
  }

  static scoreCompleteness(source) {
    let score = 0;
    if (source.author !== 'Unknown Author') score++;
    if (source.publisher !== 'Unknown Publisher') score++;
    if (source.year !== 'Unknown Year') score++;
    if (source.doi) score += 2; // DOI is highly valuable
    return score;
  }
}

module.exports = DuplicateDetector;
