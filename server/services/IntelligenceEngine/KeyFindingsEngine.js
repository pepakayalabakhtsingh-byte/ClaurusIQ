class KeyFindingsEngine {
  static identify(verificationData, citationData) {
    const claims = verificationData.claims || [];
    
    // Sort claims by confidence (supporting evidence count)
    const sortedClaims = claims.sort((a, b) => {
      const aCount = (a.supportingEvidence || []).length;
      const bCount = (b.supportingEvidence || []).length;
      return bCount - aCount;
    });

    // Take top discoveries
    const topDiscoveries = sortedClaims.slice(0, 10).map(c => ({
      claim: c.text,
      status: c.status,
      confidence: c.confidenceScore || 0,
      supportCount: (c.supportingEvidence || []).length,
      contradictCount: (c.contradictingEvidence || []).length
    }));

    return {
      topDiscoveries,
      totalAnalyzed: claims.length
    };
  }
}

module.exports = KeyFindingsEngine;
