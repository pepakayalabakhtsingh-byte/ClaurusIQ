class EvidenceCollector {
  /**
   * Scans the normalized sources to find snippets that discuss the claim.
   * @param {Object} claimObj { text: string, category: string }
   * @param {Array<Object>} sources
   * @returns {Array<Object>} Array of evidence objects
   */
  static collectEvidence(claimObj, sources) {
    const evidence = [];
    
    // Convert claim to important keywords for matching
    const keywords = claimObj.text.toLowerCase().replace(/[^\w\s]/gi, '').split(' ').filter(w => w.length > 4);

    sources.forEach(source => {
      const summaryLower = (source.summary || '').toLowerCase();
      
      // Determine if source contains relevance to the claim
      let matchCount = 0;
      keywords.forEach(kw => {
        if (summaryLower.includes(kw)) matchCount++;
      });

      // Simple threshold: If a reasonable portion of keywords are present, extract the sentence
      if (matchCount > 0 && matchCount >= Math.min(2, Math.floor(keywords.length / 2))) {
        // Extract the specific sentence containing the keywords
        const sentences = source.summary.split(/(?<=\.)\s+/);
        let bestSentence = sentences[0];
        let bestSentenceScore = -1;

        sentences.forEach(sentence => {
          let sScore = 0;
          const sLower = sentence.toLowerCase();
          keywords.forEach(kw => {
            if (sLower.includes(kw)) sScore++;
          });
          if (sScore > bestSentenceScore) {
            bestSentenceScore = sScore;
            bestSentence = sentence;
          }
        });

        evidence.push({
          text: bestSentence,
          source: source.title,
          url: source.url,
          author: source.author,
          publication: source.publisher,
          date: source.year,
          provider: source.source
        });
      }
    });

    return evidence;
  }
}

module.exports = EvidenceCollector;
