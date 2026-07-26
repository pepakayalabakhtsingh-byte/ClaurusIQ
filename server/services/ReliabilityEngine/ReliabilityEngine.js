const BiasDetectionEngine = require('./BiasDetectionEngine');
const SourceDiversityEngine = require('./SourceDiversityEngine');
const ConsensusEngine = require('./ConsensusEngine');
const ExplainabilityEngine = require('./ExplainabilityEngine');
const TransparencyEngine = require('./TransparencyEngine');
const RuleBasedReliabilityStrategy = require('./strategies/RuleBasedReliabilityStrategy');

class ReliabilityEngine {
  /**
   * Master orchestrator for the Reliability phase.
   * Can accept a strategy object for Dependency Injection (defaults to RuleBased).
   */
  static async analyze(workflow, verificationData, citationData, strategy = new RuleBasedReliabilityStrategy()) {
    
    // 1. Bias Detection
    const combinedText = citationData.citations.map(c => c.title).join(' ');
    const bias = BiasDetectionEngine.analyze(combinedText);

    // 2. Source Diversity
    const diversity = SourceDiversityEngine.analyze(citationData.citations);

    // 3. Consensus
    const consensus = ConsensusEngine.analyze(verificationData.claims);
    
    const citationAvgTrust = citationData.summary ? citationData.summary.averageTrust : 0;

    // 4. Calculate Final Reliability Score via Strategy
    const reliabilityInfo = strategy.computeReliability({
      bias,
      diversity,
      consensus,
      citationAvgTrust
    });

    // Add extra metric fields required by other modules
    reliabilityInfo.metrics = {
      evidenceQuality: consensus.score,
      researchQuality: diversity.score,
      citationQuality: citationAvgTrust
    };

    // 5. Explainability
    const explanation = ExplainabilityEngine.generateExplanation(reliabilityInfo, consensus, diversity, bias);

    // 6. Transparency Trace (now built asynchronously)
    const trace = await TransparencyEngine.buildFullTrace(workflow._id);

    return {
      bias,
      diversity,
      consensus,
      reliability: reliabilityInfo,
      explanation,
      trace
    };
  }
}

module.exports = ReliabilityEngine;
