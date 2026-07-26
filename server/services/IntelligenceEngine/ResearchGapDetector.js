class ResearchGapDetector {
  static detect(verificationData, reliabilityData) {
    const gaps = [];

    // Check for conflicting evidence
    if (reliabilityData.consensus && reliabilityData.consensus.level.includes('Conflicting')) {
      gaps.push({
        type: 'Conflicting Publications',
        description: 'Significant disagreement found across independent sources. Deep dive required.'
      });
    }

    // Check for claims lacking evidence
    const claims = verificationData.claims || [];
    const weakClaims = claims.filter(c => (c.supportingEvidence || []).length === 0);
    
    if (weakClaims.length > 0) {
      gaps.push({
        type: 'Missing Evidence',
        description: `${weakClaims.length} extracted claims lacked verifiable supporting evidence.`
      });
    }

    if (gaps.length === 0) {
      gaps.push({
        type: 'None Detected',
        description: 'Current evidence sufficiently covers the extracted claims.'
      });
    }

    return gaps;
  }
}

module.exports = ResearchGapDetector;
