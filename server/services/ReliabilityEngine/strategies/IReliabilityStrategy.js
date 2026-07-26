/**
 * Interface/Base class for Reliability Strategies.
 * All future ML/LLM models must implement this interface to be interchangeable.
 */
class IReliabilityStrategy {
  /**
   * Computes the reliability breakdown based on the provided metrics.
   * @param {Object} metrics - Extracted metrics (bias, diversity, consensus, etc.)
   * @returns {Object} Reliability breakdown
   */
  computeReliability(metrics) {
    throw new Error('Method "computeReliability" must be implemented.');
  }
}

module.exports = IReliabilityStrategy;
