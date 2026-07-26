const { GoogleGenerativeAI } = require('@google/generative-ai');
const Logger = require('../../logs/Logger');

class ClaimExtractor {
  constructor() {
    this.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  /**
   * Extracts verifiable claims from the research output.
   * @param {Array<Object>} sources Array of normalized sources
   * @returns {Promise<Array<string>>} Array of raw claim strings
   */
  async extractClaims(sources) {
    if (!sources || sources.length === 0) return [];

    try {
      // Create a combined text of summaries to feed into Gemini
      const combinedText = sources.map(s => s.summary).join('\n\n');
      
      const prompt = `
You are an expert Claim Extraction Agent. Your task is to identify and extract ONLY factual, verifiable claims from the provided text.

RULES:
- Separate opinions, assumptions, predictions, and subjective statements. DO NOT include them.
- Extract ONLY concrete factual statements (e.g. "WHO declared COVID-19 a pandemic in March 2020.").
- Return exactly a JSON array of strings. No markdown, no explanations. Just the JSON array.
- Extract up to 10 of the most significant claims.

TEXT:
${combinedText.substring(0, 15000)} // Limit to roughly 15k chars to fit context window easily
      `.trim();

      const model = this.ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const response = await model.generateContent(prompt);

      let responseText = response.response.text();
      if (responseText.startsWith('```json')) {
        responseText = responseText.substring(7, responseText.length - 3).trim();
      } else if (responseText.startsWith('```')) {
        responseText = responseText.substring(3, responseText.length - 3).trim();
      }

      const claims = JSON.parse(responseText);
      
      // Fallback if AI returned something weird
      if (!Array.isArray(claims)) return [];
      return claims;

    } catch (error) {
      Logger.error('ClaimExtractor', 'Failed to extract claims via Gemini', error);
      // Fallback to naive sentence splitting if AI fails (e.g. invalid API key)
      const firstSourceSummary = sources[0].summary || '';
      const naiveClaims = firstSourceSummary.split('. ').filter(s => s.length > 20).slice(0, 3);
      return naiveClaims;
    }
  }
}

module.exports = new ClaimExtractor();
