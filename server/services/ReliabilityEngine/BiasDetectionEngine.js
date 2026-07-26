class BiasDetectionEngine {
  /**
   * Analyzes writing style for bias indicators. 
   * Does NOT analyze political affiliation.
   * @param {string} text - The text to analyze
   * @returns {Object} Bias analysis result
   */
  static analyze(text) {
    if (!text) return this.getDefaultBias();
    
    const lowerText = text.toLowerCase();
    
    let emotionalCount = 0;
    let subjectiveCount = 0;
    let sensationalCount = 0;

    // Word lists for stylistic analysis
    const emotionalWords = ['shocking', 'outrageous', 'devastating', 'horrific', 'miracle', 'disaster'];
    const subjectiveWords = ['i think', 'we believe', 'probably', 'maybe', 'perhaps', 'in my opinion', 'should', 'must'];
    const sensationalWords = ['destroy', 'obliterate', 'slams', 'blast', 'mind-blowing', 'insane'];

    emotionalWords.forEach(word => { if (lowerText.includes(word)) emotionalCount++; });
    subjectiveWords.forEach(word => { if (lowerText.includes(word)) subjectiveCount++; });
    sensationalWords.forEach(word => { if (lowerText.includes(word)) sensationalCount++; });

    const totalFlags = emotionalCount + subjectiveCount + sensationalCount;
    
    let biasLevel = 'Very Low';
    let writingStyle = 'Objective & Factual';
    let score = 100;

    if (totalFlags > 6) {
      biasLevel = 'Very High';
      writingStyle = 'Highly Sensationalized & Opinionated';
      score = 20;
    } else if (totalFlags > 4) {
      biasLevel = 'High';
      writingStyle = 'Opinion-Heavy & Emotional';
      score = 40;
    } else if (totalFlags > 2) {
      biasLevel = 'Moderate';
      writingStyle = 'Mixed Objective/Subjective';
      score = 60;
    } else if (totalFlags > 0) {
      biasLevel = 'Low';
      writingStyle = 'Mostly Objective';
      score = 80;
    }

    return {
      level: biasLevel,
      score,
      style: writingStyle,
      indicators: {
        emotional: emotionalCount,
        subjective: subjectiveCount,
        sensational: sensationalCount
      }
    };
  }

  static getDefaultBias() {
    return {
      level: 'Low',
      score: 80,
      style: 'Mostly Objective (Assumed)',
      indicators: { emotional: 0, subjective: 0, sensational: 0 }
    };
  }
}

module.exports = BiasDetectionEngine;
