class RecommendationEngine {
  static generate(reliabilityData) {
    const recommendations = [];
    const rel = reliabilityData.reliability;

    if (rel && rel.score < 60) {
      recommendations.push({
        category: 'Research',
        priority: 'High',
        recommendation: 'Seek additional corroborating sources.',
        why: `Current evidence strength is low (${rel.score}/100).`,
        confidence: rel.level
      });
    } else {
      recommendations.push({
        category: 'General',
        priority: 'Medium',
        recommendation: 'Proceed with strategic implementation based on findings.',
        why: 'Evidence consensus and source diversity indicate high reliability.',
        confidence: rel.level
      });
    }

    if (reliabilityData.diversity && reliabilityData.diversity.publishers < 3) {
      recommendations.push({
        category: 'Policy',
        priority: 'Medium',
        recommendation: 'Cross-reference findings with external domain experts.',
        why: 'Information originates from a narrow band of publishers.',
        confidence: 'Moderate'
      });
    }

    return recommendations;
  }
}

module.exports = RecommendationEngine;
