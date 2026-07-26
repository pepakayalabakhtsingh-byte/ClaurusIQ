/**
 * ResponseGenerator — Formats the reasoning chain into a human-readable
 * response with confidence indicators, supporting sources, and suggested
 * follow-up questions.
 *
 * Uses Gemini Flash when available, otherwise falls back to deterministic
 * template-based generation.
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');

class ResponseGenerator {
  /**
   * Generates a response using the reasoning chain.
   * @param {string} userMessage - The raw user message.
   * @param {Object} reasoning - Output from ReasoningEngine.buildReasoning().
   * @param {string} style - Conversation style (executive|academic|technical|simple).
   * @returns {Object} { text, isEvidenceBased, confidence, sources, suggestedQuestions }
   */
  static async generate(userMessage, reasoning, style = 'executive') {
    const isEvidenceBased = reasoning.evidenceAvailable || reasoning.documentsAvailable;
    let text = '';
    let confidence = null;
    let sources = [];

    if (isEvidenceBased) {
      text = await this._generateWithEvidence(userMessage, reasoning, style);
      confidence = reasoning.reliabilityScore;
      sources = reasoning.citations.slice(0, 5).map(c => ({
        title: c.title,
        trustScore: c.trustScore,
      }));
    } else {
      text = `I don't have any verified research data for this topic yet. To get evidence-based answers, please run a research workflow first from the Research page.\n\nI can only provide reliable answers based on ClaurusIQ's verified research outputs.`;
    }

    // Generate suggested follow-up questions
    const suggestedQuestions = this._generateSuggestions(reasoning);

    return {
      text,
      isEvidenceBased,
      confidence,
      consensusLevel: reasoning.consensusLevel,
      sources,
      suggestedQuestions,
      reasoningTrace: {
        topic: reasoning.topic,
        intent: reasoning.intent,
        evidenceCount: reasoning.evidence.length,
        citationCount: reasoning.citations.length,
        reliabilityScore: reasoning.reliabilityScore,
      },
    };
  }

  /**
   * Generates a response using Gemini with the evidence context.
   */
  static async _generateWithEvidence(userMessage, reasoning, style) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const styleInstructions = {
        executive: 'Write in professional executive business language. Be concise and action-oriented.',
        academic: 'Write in formal academic language with proper scholarly tone.',
        technical: 'Write in precise technical language with specific details.',
        simple: 'Write in simple, easy-to-understand language suitable for a general audience.',
      };

      const evidenceSummary = reasoning.evidence.map((e, i) =>
        `${i + 1}. Claim: "${e.claim}" — Status: ${e.status}, Confidence: ${e.confidence}, Supporting: ${e.supportCount}, Contradicting: ${e.contradictCount}`
      ).join('\n');

      const citationSummary = reasoning.citations.map((c, i) =>
        `[${i + 1}] ${c.title} (Trust: ${c.trustScore}/100)`
      ).join('\n');

      const prompt = `You are ClaurusIQ's AI Research Assistant. Answer the user's question using ONLY the verified evidence below. Never fabricate evidence or citations. If the evidence doesn't cover the question, say so explicitly.

${styleInstructions[style] || styleInstructions.executive}

Research Topic: ${reasoning.topic}
Reliability Score: ${reasoning.reliabilityScore || 'N/A'}/100
Consensus: ${reasoning.consensusLevel || 'N/A'}

Verified Evidence:
${evidenceSummary || 'No claims extracted.'}

Citations:
${citationSummary || 'No citations available.'}

Recommendations:
${reasoning.recommendations.map(r => `- [${r.priority}] ${r.recommendation}`).join('\n') || 'None.'}

Research Gaps:
${reasoning.gaps.map(g => `- ${g.type}: ${g.description}`).join('\n') || 'None detected.'}

Uploaded Documents:
${reasoning.documentsAvailable ? reasoning.documents.map((d, i) => `Document ${i+1}: ${d.title}\nSummary: ${d.summary}\nEntities: ${d.entities.join(', ')}`).join('\n\n') : 'No documents uploaded.'}

User Question: ${userMessage}

Important: Base your answer strictly on the evidence above. Include reference numbers [1], [2] etc. when citing sources.`;

      const timeoutMs = 10000;
      let text = '';
      const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'];
      
      for (let i = 0; i < modelsToTry.length; i++) {
        const modelName = modelsToTry[i];
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await Promise.race([
            model.generateContent(prompt),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini API timeout')), timeoutMs))
          ]);
          text = result.response.text();
          break; // Success!
        } catch (err) {
          console.warn(`ResponseGenerator Model ${modelName} failed: ${err.message}. Trying fallback...`);
          if (i === modelsToTry.length - 1) {
            throw err; // All models failed
          }
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      return text;
    } catch (error) {
      console.error('ResponseGenerator Gemini error:', error.message);
      return this._fallbackResponse(reasoning);
    }
  }

  /**
   * Deterministic fallback if LLM is unavailable.
   */
  static _fallbackResponse(reasoning) {
    let response = `**Research Topic:** ${reasoning.topic}\n\n`;

    if (reasoning.evidence.length > 0) {
      response += `**Key Findings (${reasoning.evidence.length} claims analyzed):**\n`;
      reasoning.evidence.slice(0, 5).forEach((e, i) => {
        response += `${i + 1}. ${e.claim} — *${e.status}* (Confidence: ${e.confidence})\n`;
      });
    }

    if (reasoning.reliabilityScore !== null) {
      response += `\n**Reliability Score:** ${reasoning.reliabilityScore}/100`;
    }
    if (reasoning.consensusLevel) {
      response += `\n**Consensus Level:** ${reasoning.consensusLevel}`;
    }

    return response;
  }

  /**
   * Generates smart follow-up question suggestions.
   */
  static _generateSuggestions(reasoning) {
    const suggestions = [];

    if (reasoning.evidenceAvailable) {
      suggestions.push('Explain the strongest evidence');
      suggestions.push('Show all sources');
    }
    if (reasoning.reliabilityAvailable) {
      suggestions.push('How reliable is this research?');
    }
    if (reasoning.recommendations.length > 0) {
      suggestions.push('What are the recommendations?');
    }
    if (reasoning.gaps.length > 0) {
      suggestions.push('What research gaps were found?');
    }
    if (reasoning.evidence.some(e => e.contradictCount > 0)) {
      suggestions.push('Show contradicting evidence');
    }

    return suggestions.slice(0, 4);
  }
}

module.exports = ResponseGenerator;
