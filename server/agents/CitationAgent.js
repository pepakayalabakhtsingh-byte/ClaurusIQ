const BaseAgent = require('./BaseAgent');
const MetadataExtractor = require('../services/CitationEngine/MetadataExtractor');
const CitationFormatter = require('../services/CitationEngine/CitationFormatter');
const SourceQualityEngine = require('../services/CitationEngine/SourceQualityEngine');
const TrustEvaluationEngine = require('../services/CitationEngine/TrustEvaluationEngine');
const DuplicateDetector = require('../services/CitationEngine/DuplicateDetector');
const CitationSession = require('../models/CitationSession');
const Logger = require('../logs/Logger');

class CitationAgent extends BaseAgent {
  constructor() {
    super('CitationAgent');
  }

  async execute(input) {
    this.logExecution('execute', 'Generating citations and assessing source quality');
    
    const verificationData = input.previousOutput;
    if (!verificationData || !verificationData.claims) {
      throw new Error('Missing verified claims from Phase 4');
    }

    // 1. Gather all raw evidence from the verified claims
    const allRawEvidence = [];
    verificationData.claims.forEach(claim => {
      if (claim.supportingEvidence) {
        allRawEvidence.push(...claim.supportingEvidence);
      }
      if (claim.contradictingEvidence) {
        allRawEvidence.push(...claim.contradictingEvidence);
      }
    });

    this.logExecution('execute', `Collected ${allRawEvidence.length} raw evidence snippets from claims`);

    // 2. Extract & Normalize Metadata
    this.logExecution('execute', 'Extracting metadata from evidence');
    const enrichedSources = allRawEvidence.map(ev => {
      const enriched = MetadataExtractor.extract(ev);
      enriched.originalEvidenceId = ev.id || null;
      return enriched;
    });

    // 3. Deduplicate
    this.logExecution('execute', 'Deduplicating sources');
    const uniqueSources = DuplicateDetector.deduplicate(enrichedSources);
    this.logExecution('execute', `Found ${uniqueSources.length} unique sources`);

    // 4. Evaluate & Format Citations
    this.logExecution('execute', 'Evaluating quality, calculating trust scores, and formatting citations');
    const finalCitations = uniqueSources.map(source => {
      // Quality
      const category = SourceQualityEngine.categorize(source);
      source.sourceCategory = category;

      // Trust Evaluation
      const trust = TrustEvaluationEngine.evaluate(source, category);
      source.trustScore = trust.score;
      source.credibilityLevel = trust.level;
      source.trustRationale = trust.rationale;

      // Format
      source.formats = CitationFormatter.format(source);

      return source;
    });

    // 5. Save Citation Session to DB
    let citationSessionId = null;
    try {
      const session = new CitationSession({
        workflowId: input.workflowId || '000000000000000000000000',
        verificationSessionId: verificationData.verificationSessionId,
        ownerId: input.userId || '000000000000000000000000',
        citations: finalCitations
      });
      const saved = await session.save();
      citationSessionId = saved._id;
      this.logExecution('execute', `Citation Session saved to DB: ${citationSessionId}`);
    } catch (err) {
      Logger.error('CitationAgent', 'Failed to save CitationSession to DB', err);
    }

    return {
      citationSessionId,
      citations: finalCitations,
      summary: {
        totalCitations: finalCitations.length,
        averageTrust: finalCitations.length > 0 
          ? finalCitations.reduce((acc, curr) => acc + curr.trustScore, 0) / finalCitations.length 
          : 0
      }
    };
  }
}

module.exports = CitationAgent;
