const BaseAgent = require('./BaseAgent');
const ClaimExtractor = require('../services/VerificationEngine/ClaimExtractor');
const ClaimClassifier = require('../services/VerificationEngine/ClaimClassifier');
const EvidenceCollector = require('../services/VerificationEngine/EvidenceCollector');
const ContradictionDetector = require('../services/VerificationEngine/ContradictionDetector');
const ConfidenceScorer = require('../services/VerificationEngine/ConfidenceScorer');
const VerificationSession = require('../models/VerificationSession');
const Logger = require('../logs/Logger');

class EvidenceVerificationAgent extends BaseAgent {
  constructor() {
    super('EvidenceVerificationAgent');
  }

  async execute(input) {
    this.logExecution('execute', 'Verifying claims from discovered sources');
    
    // Input should be the output from SourceDiscoveryAgent
    const sourceData = input.previousOutput;
    if (!sourceData || !sourceData.allProcessedSources) {
      throw new Error('Missing allProcessedSources from Phase 3');
    }

    const sources = sourceData.allProcessedSources;
    this.logExecution('execute', `Received ${sources.length} sources for verification`);

    // 1. Extract Claims
    this.logExecution('execute', 'Extracting factual claims from sources');
    const rawClaims = await ClaimExtractor.extractClaims(sources);
    
    if (rawClaims.length === 0) {
      this.logExecution('warn', 'No claims could be extracted');
      return { verifiedClaims: [], status: 'No claims found' };
    }

    // 2. Classify Claims
    this.logExecution('execute', 'Classifying extracted claims');
    const classifiedClaims = await ClaimClassifier.classifyClaims(rawClaims);

    // 3. Collect Evidence & Score (Processed concurrently)
    this.logExecution('execute', 'Collecting evidence, detecting contradictions, and scoring confidence');
    const processedClaims = [];

    for (const claimObj of classifiedClaims) {
      // Collect all potential evidence snippets
      const evidence = EvidenceCollector.collectEvidence(claimObj, sources);
      
      // Separate into supporting vs contradicting
      const { supporting, contradicting } = ContradictionDetector.evaluate(claimObj.text, evidence);

      // Score
      const verificationResult = ConfidenceScorer.calculate(supporting, contradicting);

      processedClaims.push({
        text: claimObj.text,
        category: claimObj.category,
        status: verificationResult.status,
        confidenceScore: verificationResult.score,
        rationale: verificationResult.rationale,
        supportingEvidence: supporting,
        contradictingEvidence: contradicting
      });
    }

    // Save to Database
    let sessionId = null;
    try {
      // Try to tie it to the workflow, if available
      const session = new VerificationSession({
        workflowId: input.workflowId || '000000000000000000000000', 
        ownerId: input.userId || '000000000000000000000000',
        claims: processedClaims,
        status: 'completed',
        verificationTime: Date.now()
      });
      const saved = await session.save();
      sessionId = saved._id;
      this.logExecution('execute', `Verification Session saved to DB: ${sessionId}`);
    } catch (err) {
      Logger.error('EvidenceVerificationAgent', 'Failed to save VerificationSession to DB', err);
    }

    this.logExecution('execute', 'Verification complete');

    return {
      verificationSessionId: sessionId,
      claims: processedClaims,
      summary: {
        total: processedClaims.length,
        verified: processedClaims.filter(c => c.status === 'Verified' || c.status === 'Likely Verified').length,
        conflicting: processedClaims.filter(c => c.status === 'Conflicting Evidence').length
      }
    };
  }
}

module.exports = EvidenceVerificationAgent;
