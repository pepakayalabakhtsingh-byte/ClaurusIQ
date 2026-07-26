const BaseAgent = require('./BaseAgent');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Logger = require('../logs/Logger');

class ResearchAgent extends BaseAgent {
  constructor() {
    super('ResearchAgent');
    if (!process.env.GEMINI_API_KEY) {
      Logger.warn('ResearchAgent', 'GEMINI_API_KEY is missing. Agent will fail if executed.');
    }
    this.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async execute(input) {
    this.logExecution('execute', 'Analyzing topic and generating research plan', { query: input.userQuery });
    
    try {
      const prompt = `
You are a Principal AI Research Architect. Analyze the following user query and output a highly structured JSON research strategy.

User Query: "${input.userQuery}"

Your task is to understand the query and return ONLY a valid JSON object matching the following structure:
{
  "topic": "The main topic identified",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "entities": ["Entity 1", "Entity 2"],
  "researchGoal": "A concise sentence describing the goal",
  "expandedQueries": [
    "A highly optimized search query 1",
    "A highly optimized search query 2",
    "A highly optimized search query 3"
  ],
  "expectedSources": 10,
  "searchOrder": ["provider1", "provider2"],
  "status": "PLAN_GENERATED"
}

Do not include markdown blocks like \`\`\`json. Return raw JSON. Provide exactly 3 highly optimized expanded queries for external search engines.
      `.trim();

      const model = this.ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const response = await model.generateContent(prompt);

      let responseText = response.response.text();
      if (responseText.startsWith('```json')) {
        responseText = responseText.substring(7, responseText.length - 3).trim();
      } else if (responseText.startsWith('```')) {
        responseText = responseText.substring(3, responseText.length - 3).trim();
      }

      const plan = JSON.parse(responseText);
      this.logExecution('execute', 'Research plan generated successfully', plan);
      return plan;
    } catch (error) {
      Logger.error('ResearchAgent', 'Failed to generate research plan via Gemini, falling back to basic strategy', error);
      
      // Fallback Strategy so workflow can continue and test SourceDiscoveryAgent
      const fallbackPlan = {
        topic: input.userQuery,
        keywords: input.userQuery.split(' ').filter(w => w.length > 3),
        entities: [],
        researchGoal: "Perform general search for the query",
        expandedQueries: [
          input.userQuery,
          input.userQuery + " research",
          input.userQuery + " analysis"
        ],
        expectedSources: 5,
        searchOrder: ["Tavily", "SemanticScholar", "CORE", "NewsAPI", "Crossref"],
        status: "FALLBACK_PLAN_GENERATED"
      };

      this.logExecution('execute', 'Fallback research plan generated', fallbackPlan);
      return fallbackPlan;
    }
  }
}

module.exports = ResearchAgent;
