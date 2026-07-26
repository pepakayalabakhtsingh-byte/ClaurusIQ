const { GoogleGenerativeAI } = require('@google/generative-ai');
const Logger = require('../../logs/Logger');

class ClaimClassifier {
  constructor() {
    this.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.categories = [
      'Historical Fact', 'Scientific Claim', 'Medical Claim', 
      'Statistical Claim', 'Legal Claim', 'Financial Claim', 
      'Technological Claim', 'Political Claim', 'General Knowledge'
    ];
  }

  /**
   * Classifies an array of claims.
   * @param {Array<string>} claims 
   * @returns {Promise<Array<Object>>} Array of { text: string, category: string }
   */
  async classifyClaims(claims) {
    if (!claims || claims.length === 0) return [];

    try {
      const prompt = `
You are an expert Claim Classification Agent.
Categorize each of the following claims into EXACTLY ONE of these categories:
[${this.categories.join(', ')}]

CLAIMS:
${JSON.stringify(claims)}

Return ONLY a JSON array of objects with "text" and "category" keys. No markdown.
      `.trim();

      const model = this.ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const response = await model.generateContent(prompt);

      let responseText = response.response.text();
      if (responseText.startsWith('```json')) {
        responseText = responseText.substring(7, responseText.length - 3).trim();
      } else if (responseText.startsWith('```')) {
        responseText = responseText.substring(3, responseText.length - 3).trim();
      }

      const classified = JSON.parse(responseText);
      return classified;

    } catch (error) {
      Logger.error('ClaimClassifier', 'Failed to classify claims via Gemini', error);
      // Fallback: rule-based classification based on keywords
      return claims.map(claim => {
        let category = 'General Knowledge';
        const lowerClaim = claim.toLowerCase();
        
        if (lowerClaim.match(/\d+%|\d+ percent|increased by|decreased by/)) category = 'Statistical Claim';
        else if (lowerClaim.match(/quantum|algorithm|software|technology|AI|computer/)) category = 'Technological Claim';
        else if (lowerClaim.match(/disease|treatment|health|patient|virus/)) category = 'Medical Claim';
        else if (lowerClaim.match(/revenue|market|economy|dollars|financial/)) category = 'Financial Claim';
        else if (lowerClaim.match(/century|war|empire|discovered in/)) category = 'Historical Fact';
        
        return { text: claim, category };
      });
    }
  }
}

module.exports = new ClaimClassifier();
