/**
 * IntentDetector — Deterministic keyword/pattern-based intent classifier.
 * Categorizes user messages into one of 13 intent types so downstream
 * engines know which data to retrieve and how to format the response.
 */
class IntentDetector {
  static INTENTS = {
    ASK_ABOUT_REPORT: 'ask_about_report',
    EXPLAIN_FINDING: 'explain_finding',
    COMPARE_CLAIMS: 'compare_claims',
    SUMMARIZE_RESEARCH: 'summarize_research',
    SHOW_SOURCES: 'show_sources',
    EXPLAIN_CITATION: 'explain_citation',
    EXPLAIN_RELIABILITY: 'explain_reliability',
    EXPLAIN_CONSENSUS: 'explain_consensus',
    FOLLOW_UP: 'follow_up',
    GENERAL_RESEARCH: 'general_research',
    EXPORT_REQUEST: 'export_request',
    CLARIFICATION: 'clarification',
    UNKNOWN: 'unknown',
  };

  static PATTERNS = [
    { intent: 'ask_about_report',    keywords: ['report', 'executive summary', 'findings report', 'generated report'] },
    { intent: 'explain_finding',     keywords: ['explain', 'why', 'how', 'what does', 'tell me about', 'finding', 'insight'] },
    { intent: 'compare_claims',      keywords: ['compare', 'difference', 'versus', 'vs', 'contrast'] },
    { intent: 'summarize_research',  keywords: ['summarize', 'summary', 'overview', 'brief', 'tldr', 'recap'] },
    { intent: 'show_sources',        keywords: ['sources', 'references', 'who said', 'where from', 'publishers', 'authors'] },
    { intent: 'explain_citation',    keywords: ['citation', 'cite', 'reference format', 'bibliography'] },
    { intent: 'explain_reliability', keywords: ['reliability', 'trust', 'score', 'how reliable', 'bias', 'objectivity'] },
    { intent: 'explain_consensus',   keywords: ['consensus', 'agreement', 'disagree', 'conflicting', 'contradiction'] },
    { intent: 'export_request',      keywords: ['export', 'download', 'pdf', 'docx', 'powerpoint', 'csv'] },
    { intent: 'clarification',       keywords: ['what do you mean', 'clarify', 'not sure', 'confused'] },
    { intent: 'follow_up',           keywords: ['more', 'also', 'and', 'what about', 'tell me more', 'go on', 'continue', 'expand'] },
  ];

  /**
   * Detects the intent of a user message.
   * @param {string} message - The user's raw message text.
   * @param {Object} context - The current conversation context (for follow-up detection).
   * @returns {{ intent: string, confidence: number }}
   */
  static detect(message, context = {}) {
    if (!message || typeof message !== 'string') {
      return { intent: this.INTENTS.UNKNOWN, confidence: 0 };
    }

    const lower = message.toLowerCase().trim();

    // Short messages with existing context are likely follow-ups
    if (lower.length < 15 && context.activeTopic) {
      const followUpWords = ['yes', 'no', 'sure', 'ok', 'more', 'why', 'how', 'and'];
      if (followUpWords.some(w => lower.startsWith(w))) {
        return { intent: this.INTENTS.FOLLOW_UP, confidence: 0.8 };
      }
    }

    // Score each pattern
    let bestMatch = { intent: this.INTENTS.GENERAL_RESEARCH, confidence: 0.3 };

    for (const pattern of this.PATTERNS) {
      let matchCount = 0;
      for (const keyword of pattern.keywords) {
        if (lower.includes(keyword)) {
          matchCount++;
        }
      }
      if (matchCount > 0) {
        const confidence = Math.min(0.5 + matchCount * 0.2, 1.0);
        if (confidence > bestMatch.confidence) {
          bestMatch = { intent: pattern.intent, confidence };
        }
      }
    }

    return bestMatch;
  }
}

module.exports = IntentDetector;
