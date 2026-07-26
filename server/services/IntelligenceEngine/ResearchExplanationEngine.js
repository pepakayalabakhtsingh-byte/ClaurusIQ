const { GoogleGenerativeAI } = require('@google/generative-ai');
const Logger = require('../../logs/Logger');

class ResearchExplanationEngine {
  /**
   * Generates a comprehensive research explanation based on collected data and depth.
   */
  static async generate(workflow, verificationData, citationData, reliabilityData, depth = 'Detailed') {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      // Build context strings
      const query = workflow.query || 'Unknown Topic';
      const claims = verificationData.claims || [];
      const citations = citationData.citations || [];
      const rel = reliabilityData.reliability ? reliabilityData.reliability.score : 'N/A';
      const consensus = reliabilityData.consensus ? reliabilityData.consensus.level : 'N/A';

      const evidenceSummary = claims.map((e, i) =>
        `${i + 1}. Claim: "${e.text || e.claim}" (Status: ${e.status}, Confidence: ${e.confidenceScore})`
      ).join('\n');

      const citationSummary = citations.map((c, i) =>
        `[${i + 1}] ${c.title} - ${c.source} (Trust: ${c.trustScore}) - URL: ${c.url}`
      ).join('\n');

      let wordCountTarget = '';
      if (depth === 'Quick') {
        wordCountTarget = 'Aim for 800-1200 words. Be highly concise but cover all structural points briefly.';
      } else if (depth === 'Detailed') {
        wordCountTarget = 'Aim for 1200-2500 words. Provide a thorough, well-explained analysis.';
      } else if (depth === 'Research') {
        wordCountTarget = 'Aim for 2500-5000+ words. Provide a highly detailed, academic-level comprehensive analysis with extensive synthesis.';
      }

      const prompt = `You are a Principal AI Architect and Senior Research Scientist for ClaurusIQ. 
Your task is to generate a comprehensive AI-generated research explanation for the user's query: "${query}".

Response Depth Selected: ${depth}
${wordCountTarget}

Use the following verified data:
Reliability Score: ${rel}/100
Consensus Level: ${consensus}

Verified Evidence:
${evidenceSummary || 'No specific claims extracted.'}

Sources & Citations:
${citationSummary || 'No citations available.'}

OUTPUT STRUCTURE REQUIREMENTS:
Your explanation MUST include the following 14 sections (use exactly these headings in Markdown):
1. Direct Answer (A concise answer addressing the user's question directly)
2. Detailed Explanation (In-depth step-by-step breakdown)
3. How It Works (Underlying mechanisms, cause-and-effect)
4. Historical Background (Origin, milestones if relevant)
5. Current Research (Recent developments, emerging trends)
6. Advantages (Benefits and utility)
7. Limitations (Weaknesses, trade-offs, constraints)
8. Real World Applications (Practical industry examples)
9. Examples (Meaningful examples, use tables if appropriate)
10. Comparison (Compare with alternatives)
11. Key Takeaways (Bullet points summarizing the most important points)
12. Supporting Evidence (Group evidence by claim, show confidence)
13. Sources (List the provided citations [1], [2], etc., DOIs, URLs)
14. Reliability (Mention the Reliability Score, Consensus, Bias, Transparency based on the provided data)

QUALITY REQUIREMENTS:
- Synthesize the collected information. DO NOT just copy-paste.
- Maintain an academic, neutral, evidence-based tone.
- Use Headings (H2/H3), Bullet Lists, Numbered Lists, and Tables where appropriate to improve readability.
- Highlight important terms in bold.
- Use reference numbers [1], [2] inline to cite the sources provided.

Generate the full markdown response now.`;

      // Set a longer timeout for Research depth
      const timeoutMs = depth === 'Research' ? 60000 : 30000;
      
      Logger.info('ResearchExplanationEngine', `Starting generation for query "${query}" with depth "${depth}"`);

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
          Logger.info('ResearchExplanationEngine', `Generation complete with ${modelName}. Length: ${text.length} chars.`);
          break; // Success!
        } catch (err) {
          Logger.warn('ResearchExplanationEngine', `Model ${modelName} failed: ${err.message}. Trying fallback if available...`);
          if (i === modelsToTry.length - 1) {
            throw err; // All models failed
          }
          // Brief delay before trying the next model
          await new Promise(r => setTimeout(r, 2000));
        }
      }

      return text;
    } catch (error) {
      Logger.error('ResearchExplanationEngine', 'Failed to generate explanation after all fallbacks', error);
      return `*Error generating the detailed explanation: Rate limit exceeded or API unavailable. Please try again shortly.*\n\n(Technical Details: ${error.message})`;
    }
  }
}

module.exports = ResearchExplanationEngine;
