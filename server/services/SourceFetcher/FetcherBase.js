const Logger = require('../../logs/Logger');

/**
 * Base class for all external Source Fetchers
 */
class FetcherBase {
  constructor(providerName) {
    if (this.constructor === FetcherBase) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.providerName = providerName;
  }

  /**
   * Executes a search for the given query. Must handle rate limits and errors internally.
   * @param {string} query 
   * @returns {Promise<Array<Object>>} Array of normalized sources
   */
  async search(query) {
    try {
      Logger.info(`Fetcher:${this.providerName}`, `Starting search for query: "${query}"`);
      const rawData = await this.fetchData(query);
      return this.normalize(rawData);
    } catch (error) {
      Logger.error(`Fetcher:${this.providerName}`, `Search failed for query: "${query}"`, error);
      // Return empty array instead of throwing to allow parallel fetching to continue
      return [];
    }
  }

  /**
   * Actual implementation to call the external API
   * @param {string} query 
   */
  async fetchData(query) {
    throw new Error("Method 'fetchData()' must be implemented.");
  }

  /**
   * Normalize the provider-specific output into the standard format
   * Standard format: { title, author, summary, url, year, source, publisher, sourceType, retrievedTime }
   */
  normalize(rawData) {
    throw new Error("Method 'normalize()' must be implemented.");
  }
}

module.exports = FetcherBase;
