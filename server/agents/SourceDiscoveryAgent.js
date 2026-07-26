const BaseAgent = require('./BaseAgent');
const TavilyProvider = require('../services/SourceFetcher/TavilyProvider');
const SemanticScholarProvider = require('../services/SourceFetcher/SemanticScholarProvider');
const CrossrefProvider = require('../services/SourceFetcher/CrossrefProvider');
const NewsApiProvider = require('../services/SourceFetcher/NewsApiProvider');
const CoreProvider = require('../services/SourceFetcher/CoreProvider');
const SourceScoring = require('../services/SourceScoring');
const DuplicateDetector = require('../services/DuplicateDetector');
const Logger = require('../logs/Logger');

class SourceDiscoveryAgent extends BaseAgent {
  constructor() {
    super('SourceDiscoveryAgent');
    this.providers = [
      new TavilyProvider(),
      new SemanticScholarProvider(),
      new CrossrefProvider(),
      new NewsApiProvider(),
      new CoreProvider()
    ];
  }

  async execute(input) {
    this.logExecution('execute', 'Discovering sources using multiple providers');
    const researchPlan = input.previousOutput;
    
    if (!researchPlan || !researchPlan.expandedQueries) {
      throw new Error('Research plan missing expanded queries');
    }

    const queries = researchPlan.expandedQueries;
    let allSources = [];

    // Parallel fetch across all providers and all queries
    const fetchPromises = [];
    
    for (const provider of this.providers) {
      for (const query of queries) {
        fetchPromises.push(provider.search(query));
      }
    }

    const results = await Promise.allSettled(fetchPromises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        allSources = allSources.concat(result.value);
      }
    });

    this.logExecution('execute', `Retrieved ${allSources.length} raw sources`);

    // Score the sources
    const scoredSources = allSources.map(source => ({
      ...source,
      credibilityScore: SourceScoring.scoreSource(source)
    }));

    // Remove duplicates
    const uniqueSources = DuplicateDetector.deduplicate(scoredSources);
    
    // Sort by credibility score descending
    uniqueSources.sort((a, b) => b.credibilityScore - a.credibilityScore);

    this.logExecution('execute', `Final unique sources count: ${uniqueSources.length}`);

    // Break down by type for the output payload (to keep backward compatibility with Phase 2 layout, though we enrich it)
    const categorized = {
      books: uniqueSources.filter(s => s.sourceType.toLowerCase().includes('book')),
      researchPapers: uniqueSources.filter(s => s.sourceType.toLowerCase().includes('paper')),
      governmentWebsites: uniqueSources.filter(s => s.url.includes('.gov')),
      universities: uniqueSources.filter(s => s.url.includes('.edu')),
      news: uniqueSources.filter(s => s.sourceType.toLowerCase().includes('news')),
      officialOrganizations: uniqueSources.filter(s => s.url.includes('.org')),
      allProcessedSources: uniqueSources // This will be used by the frontend
    };

    return categorized;
  }
}

module.exports = SourceDiscoveryAgent;
