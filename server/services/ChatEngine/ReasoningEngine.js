/**
 * ReasoningEngine — Assembles retrieved evidence, citations, reliability
 * scores, and consensus into a structured reasoning chain BEFORE generating
 * any user-facing response. Every response carries a `reasoningTrace`.
 */
class ReasoningEngine {
  /**
   * Builds a reasoning chain from the retrieved research data.
   * @param {string} intent - The detected intent.
   * @param {Object} researchData - Output from ResearchRetriever.getFullContext().
   * @param {Object} workflow - The workflow document.
   * @returns {Object} Structured reasoning chain.
   */
  static buildReasoning(intent, researchData, workflow) {
    const { verification, citation, reliability, report, documents } = researchData;

    const reasoning = {
      topic: workflow ? workflow.query : 'Unknown',
      intent,
      evidenceAvailable: !!verification,
      citationsAvailable: !!citation,
      reliabilityAvailable: !!reliability,
      reportAvailable: !!report,
      evidence: [],
      citations: [],
      reliabilityScore: null,
      consensusLevel: null,
      recommendations: [],
      gaps: [],
    };

    // Extract evidence
    if (verification && verification.claims) {
      reasoning.evidence = verification.claims.slice(0, 10).map(c => ({
        claim: c.text || c.claim,
        status: c.status,
        confidence: c.confidenceScore || 0,
        supportCount: (c.supportingEvidence || []).length,
        contradictCount: (c.contradictingEvidence || []).length,
      }));
    }

    // Extract citations
    if (citation && citation.citations) {
      reasoning.citations = citation.citations.slice(0, 10).map(c => ({
        title: c.title,
        source: c.source,
        trustScore: c.trustScore || 0,
        url: c.url,
      }));
    }

    // Extract reliability
    if (reliability) {
      reasoning.reliabilityScore = reliability.reliability ? reliability.reliability.score : null;
      reasoning.consensusLevel = reliability.consensus ? reliability.consensus.level : null;
    }

    // Extract report intelligence
    if (report) {
      reasoning.recommendations = report.recommendations || [];
      reasoning.gaps = report.researchGaps || [];
    }

    // Extract documents
    reasoning.documents = [];
    if (documents && documents.length > 0) {
      reasoning.documentsAvailable = true;
      reasoning.documents = documents.map(d => ({
        title: d.metadata.title,
        summary: d.summaries ? d.summaries.executive : 'No summary available',
        entities: d.entities ? d.entities.slice(0, 5).map(e => e.name) : []
      }));
    }

    return reasoning;
  }
}

module.exports = ReasoningEngine;
