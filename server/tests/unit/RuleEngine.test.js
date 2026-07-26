const RuleBasedReliabilityStrategy = require('../../services/ReliabilityEngine/strategies/RuleBasedReliabilityStrategy');

describe('RuleBasedReliabilityStrategy', () => {
  let strategy;

  beforeAll(() => {
    strategy = new RuleBasedReliabilityStrategy();
  });

  test('should be deterministic and reproducible', () => {
    const mockMetrics = {
      bias: { score: 90 },
      diversity: { score: 80 },
      consensus: { score: 100 },
      citationAvgTrust: 85
    };

    const result1 = strategy.computeReliability(mockMetrics);
    const result2 = strategy.computeReliability(mockMetrics);

    expect(result1).toEqual(result2); // Deterministic guarantee
  });

  test('should accurately compute factor breakdowns based on rules', () => {
    const mockMetrics = {
      bias: { score: 100 },
      diversity: { score: 100 },
      consensus: { score: 100 },
      citationAvgTrust: 100
    };

    const result = strategy.computeReliability(mockMetrics);
    
    // Weights: consensus: 0.40, diversity: 0.25, evidenceQuality: 0.15, citationQuality: 0.10, objectivity: 0.10
    expect(result.score).toBe(100);
    expect(result.breakdown.consensusContribution).toBe(40);
    expect(result.breakdown.sourceDiversityContribution).toBe(25);
    expect(result.breakdown.evidenceQualityContribution).toBe(15);
    expect(result.breakdown.citationQualityContribution).toBe(10);
    expect(result.breakdown.objectivityContribution).toBe(10);
  });
});
