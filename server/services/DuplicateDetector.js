class DuplicateDetector {
  /**
   * Removes duplicate sources based on URL and exact Title match.
   * Prioritizes the source with the higher credibility score.
   * @param {Array<Object>} sources 
   * @returns {Array<Object>} Deduplicated array
   */
  static deduplicate(sources) {
    const uniqueMap = new Map();

    for (const source of sources) {
      // Create a unique key. Normalize URL (remove protocol, www, trailing slashes) and lowercase title
      const rawUrl = source.url || '';
      const normUrl = rawUrl.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '').toLowerCase();
      
      const titleKey = (source.title || '').toLowerCase().trim();

      // If we don't have URL, use title as fallback key
      const key = normUrl || titleKey;

      if (!key) continue;

      if (uniqueMap.has(key)) {
        // Conflict! Keep the one with higher score
        const existing = uniqueMap.get(key);
        if ((source.credibilityScore || 0) > (existing.credibilityScore || 0)) {
          uniqueMap.set(key, source);
        }
      } else {
        uniqueMap.set(key, source);
      }
    }

    return Array.from(uniqueMap.values());
  }
}

module.exports = DuplicateDetector;
