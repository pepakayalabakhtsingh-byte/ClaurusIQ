class ExecutiveSummaryGenerator {
  static generate(workflow, verificationData, reliabilityData) {
    // Generate a strictly data-driven summary without hallucinations.
    const query = workflow.query || 'Unknown Topic';
    const totalEvidence = verificationData.claims ? verificationData.claims.length : 0;
    const confidence = reliabilityData.reliability ? reliabilityData.reliability.level : 'Unknown';
    const consensus = reliabilityData.consensus ? reliabilityData.consensus.level : 'Unknown';

    return {
      objective: `To autonomously investigate and verify claims regarding: "${query}".`,
      scope: `Analyzed ${totalEvidence} distinct claims across diverse independent sources.`,
      methodology: `Multi-Agent pipeline utilizing heuristic pattern matching, consensus verification, and rule-based reliability scoring.`,
      conclusion: `The system determined a ${confidence} confidence level with ${consensus} regarding the query.`,
      futureResearch: `Additional investigation recommended for areas lacking corroborating academic sources.`
    };
  }
}

module.exports = ExecutiveSummaryGenerator;
