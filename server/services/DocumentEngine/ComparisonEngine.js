const { GoogleGenerativeAI } = require('@google/generative-ai');
const Logger = require('../../logs/Logger');

class ComparisonEngine {
  /**
   * Compares multiple documents and identifies agreements, contradictions, and unique insights.
   * @param {Array<Object>} documents - Array of DocumentSession objects
   * @returns {Promise<Object>} Comparison result
   */
  static async compareDocuments(documents) {
    if (!documents || documents.length < 2) {
      throw new Error('At least two documents are required for comparison');
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      // Build context from documents
      const docsContext = documents.map((doc, idx) => {
        return `Document ${idx + 1} (${doc.metadata.title || 'Untitled'}):
Summaries: ${JSON.stringify(doc.summaries)}
Claims: ${JSON.stringify(doc.claims.map(c => c.text))}`;
      }).join('\n\n---\n\n');

      const prompt = `You are an expert Intelligence Analyst. Compare the following documents.
Identify areas of agreement, direct contradictions, and unique insights only found in specific documents.
Format your response as a valid JSON object matching this structure:

{
  "agreements": [
    { "topic": "Topic Name", "description": "What they agree on" }
  ],
  "contradictions": [
    { "topic": "Topic Name", "doc1_stance": "Stance in Doc 1", "doc2_stance": "Stance in Doc 2", "severity": "High|Medium|Low" }
  ],
  "uniqueInsights": [
    { "document": "Document Name/Number", "insight": "The unique insight" }
  ],
  "missingInformation": [
    "Information missing from all documents"
  ],
  "overallSimilarityScore": 85
}

Documents to compare:
${docsContext}
`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      });
      
      const responseText = result.response.text();
      return JSON.parse(responseText);

    } catch (error) {
      Logger.error('ComparisonEngine', 'Failed to compare documents', error);
      throw new Error(`Document comparison failed: ${error.message}`);
    }
  }
}

module.exports = ComparisonEngine;
