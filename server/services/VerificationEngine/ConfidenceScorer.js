class ConfidenceScorer {
  /**
   * Calculates a rule-based confidence score for a claim.
   * @param {Array<Object>} supporting 
   * @param {Array<Object>} contradicting 
   * @returns {Object} { score: number, status: string, rationale: string }
   */
  static calculate(supporting, contradicting) {
    let score = 0;
    const rationale = [];

    // Base rules
    if (supporting.length === 0 && contradicting.length === 0) {
      return { score: 0, status: 'Unable to Verify', rationale: 'No evidence found for or against this claim.' };
    }

    if (supporting.length === 0 && contradicting.length > 0) {
      return { score: 10, status: 'Insufficient Evidence', rationale: 'Only contradicting evidence was found. Claim is likely false.' };
    }

    // Evaluate Supporting Sources
    const supportingProviders = new Set();
    let hasHighQualitySource = false;
    
    supporting.forEach(ev => {
      supportingProviders.add(ev.provider);
      const url = (ev.url || '').toLowerCase();
      
      // High quality indicators
      if (url.includes('.gov') || url.includes('.edu') || ev.provider === 'CORE' || ev.provider === 'Semantic Scholar' || ev.provider === 'Crossref') {
        hasHighQualitySource = true;
        score += 30; // High weight for academic/government
        rationale.push(`+30: Found supporting evidence from high-quality provider (${ev.provider})`);
      } else {
        score += 10;
        rationale.push(`+10: Found supporting evidence from standard provider (${ev.provider})`);
      }
    });

    // Diversity Bonus
    if (supportingProviders.size >= 3) {
      score += 20;
      rationale.push(`+20: Multiple independent confirmations (${supportingProviders.size} providers)`);
    } else if (supportingProviders.size === 2) {
      score += 10;
      rationale.push(`+10: Dual independent confirmations (${supportingProviders.size} providers)`);
    }

    // Contradiction Penalties
    if (contradicting.length > 0) {
      const penalty = contradicting.length * 25;
      score -= penalty;
      rationale.push(`-${penalty}: Found ${contradicting.length} contradicting sources`);
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    // Determine Status
    let status = 'Pending';
    if (contradicting.length > supporting.length) {
      status = 'Conflicting Evidence';
    } else if (contradicting.length > 0 && score < 70) {
      status = 'Partially Verified';
    } else if (score >= 90) {
      status = 'Verified';
    } else if (score >= 70) {
      status = 'Likely Verified';
    } else {
      status = 'Insufficient Evidence';
    }

    return { 
      score, 
      status, 
      rationale: rationale.join('\n')
    };
  }
}

module.exports = ConfidenceScorer;
