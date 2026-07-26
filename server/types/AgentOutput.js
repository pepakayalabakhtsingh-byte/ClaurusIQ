/**
 * Standard Agent Output Object
 * Returned by every agent's execute() method.
 */
class AgentOutput {
  /**
   * @param {Object} params
   * @param {string} params.agentName - The name of the executing agent
   * @param {string} params.status - 'success', 'failure', or 'partial'
   * @param {number} params.executionTimeMs - Total time taken in milliseconds
   * @param {Object} params.data - The actual output payload
   * @param {Array<string>} params.logs - Execution logs
   * @param {Object} params.metadata - Additional output metadata
   * @param {string|null} params.error - Error message if failed
   */
  constructor({ agentName, status, executionTimeMs, data = {}, logs = [], metadata = {}, error = null }) {
    this.agentName = agentName;
    this.status = status;
    this.executionTimeMs = executionTimeMs;
    this.data = data;
    this.logs = logs;
    this.metadata = metadata;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }
}

module.exports = AgentOutput;
