class ConsensusEngine {
  /**
   * Analyzes consensus across verified claims.
   * @param {Array<Object>} verifiedClaims 
   * @returns {Object} Consensus analysis
   */
  static analyze(verifiedClaims) {
    if (!verifiedClaims || verifiedClaims.length === 0) {
      return { score: 0, level: 'Insufficient Evidence', agreementPercentage: 0 };
    }

    let supportingCount = 0;
    let contradictingCount = 0;
    let neutralCount = 0; // Claims that couldn't be strictly verified or conflicted

    verifiedClaims.forEach(claim => {
      const status = claim.status || '';
      if (status.includes('Verified')) {
        supportingCount += (claim.supportingEvidence ? claim.supportingEvidence.length : 1);
      } else if (status.includes('Contradicted') || status.includes('Refuted')) {
        contradictingCount += (claim.contradictingEvidence ? claim.contradictingEvidence.length : 1);
      } else if (status.includes('Conflicting')) {
        supportingCount += (claim.supportingEvidence ? claim.supportingEvidence.length : 1);
        contradictingCount += (claim.contradictingEvidence ? claim.contradictingEvidence.length : 1);
      } else {
        neutralCount++;
      }
    });

    const totalDefinitive = supportingCount + contradictingCount;
    let agreementPercentage = 0;

    if (totalDefinitive > 0) {
      agreementPercentage = Math.round((supportingCount / totalDefinitive) * 100);
    } else if (neutralCount > 0) {
      return { score: 50, level: 'Mixed Evidence', agreementPercentage: 50 };
    }

    let level = 'No Consensus';
    let score = agreementPercentage;

    if (totalDefinitive === 0) {
      level = 'Insufficient Evidence';
      score = 0;
    } else if (agreementPercentage >= 90) {
      level = 'Strong Consensus';
    } else if (agreementPercentage >= 70) {
      level = 'Moderate Consensus';
    } else if (agreementPercentage >= 40) {
      level = 'Mixed Evidence';
    } else {
      level = 'Conflicting Evidence';
    }

    return {
      score,
      level,
      agreementPercentage,
      metrics: {
        supporting: supportingCount,
        contradicting: contradictingCount,
        neutral: neutralCount
      }
    };
  }
}

module.exports = ConsensusEngine;
