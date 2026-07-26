const ExecutiveSummaryGenerator = require('./ExecutiveSummaryGenerator');
const KeyFindingsEngine = require('./KeyFindingsEngine');
const RecommendationEngine = require('./RecommendationEngine');
const ResearchGapDetector = require('./ResearchGapDetector');

class IntelligenceEngine {
  /**
   * Transforms raw phase data into Executive Intelligence outputs.
   */
  static generateReport(workflow, verificationData, citationData, reliabilityData) {
    const executiveSummary = ExecutiveSummaryGenerator.generate(workflow, verificationData, reliabilityData);
    const keyFindings = KeyFindingsEngine.identify(verificationData, citationData);
    const recommendations = RecommendationEngine.generate(reliabilityData);
    const researchGaps = ResearchGapDetector.detect(verificationData, reliabilityData);

    return {
      executiveSummary,
      keyFindings,
      recommendations,
      researchGaps,
      metadata: {
        generatedAt: new Date(),
        workflowId: workflow._id,
        confidenceHeatmapEnabled: true
      }
    };
  }
}

module.exports = IntelligenceEngine;
