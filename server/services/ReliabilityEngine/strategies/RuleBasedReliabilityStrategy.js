const fs = require('fs');
const path = require('path');
const IReliabilityStrategy = require('./IReliabilityStrategy');

class RuleBasedReliabilityStrategy extends IReliabilityStrategy {
  constructor() {
    super();
    // Load configurable rules
    const rulesPath = path.join(__dirname, '../../../config/reliabilityRules.json');
    const rawData = fs.readFileSync(rulesPath);
    this.rules = JSON.parse(rawData);
  }

  computeReliability(metrics) {
    const { bias, diversity, consensus, citationAvgTrust } = metrics;
    const { weights, thresholds } = this.rules;

    // Normalizing scores
    const consensusScore = consensus.score || 0;
    const diversityScore = diversity.score || 0;
    const objectivityScore = 100 - (bias.score || 0); // Re-inverting because 100 bias = Very Low bias => 100 objectivity. Wait, the original code had bias.score=80 for 'Low'. So Objectivity = bias.score.
    const actualObjectivityScore = bias.score || 0; // Better logic: 'bias.score' was already normalized such that higher is better.

    // Contributions based on weights
    const consensusContribution = (consensusScore * weights.consensus);
    const diversityContribution = (diversityScore * weights.diversity);
    const citationContribution = (citationAvgTrust * weights.citationQuality);
    const evidenceQualityContribution = (consensusScore * weights.evidenceQuality);
    const objectivityContribution = (actualObjectivityScore * weights.objectivity);

    // Ensure total weights equal 1.0. If not, normalize them or just sum up.
    // In our config: 0.4 + 0.25 + 0.15 + 0.10 + 0.10 = 1.0
    let totalScore = Math.round(
      consensusContribution +
      diversityContribution +
      evidenceQualityContribution +
      citationContribution +
      objectivityContribution
    );

    totalScore = Math.max(0, Math.min(100, totalScore));

    // Determine Level
    let level = 'Very Low';
    if (totalScore >= thresholds.excellent) level = 'Excellent';
    else if (totalScore >= thresholds.veryHigh) level = 'Very High';
    else if (totalScore >= thresholds.high) level = 'High';
    else if (totalScore >= thresholds.moderate) level = 'Moderate';
    else if (totalScore >= thresholds.low) level = 'Low';

    return {
      score: totalScore,
      level,
      breakdown: {
        evidenceQualityContribution: parseFloat(evidenceQualityContribution.toFixed(2)),
        sourceDiversityContribution: parseFloat(diversityContribution.toFixed(2)),
        consensusContribution: parseFloat(consensusContribution.toFixed(2)),
        citationQualityContribution: parseFloat(citationContribution.toFixed(2)),
        objectivityContribution: parseFloat(objectivityContribution.toFixed(2))
      }
    };
  }
}

module.exports = RuleBasedReliabilityStrategy;
