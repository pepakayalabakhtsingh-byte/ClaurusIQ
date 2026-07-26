/**
 * Standard Agent Input Object
 * Passed into every agent's execute() method.
 */
class AgentInput {
  /**
   * @param {Object} params
   * @param {string} params.workflowId - Unique ID of the executing workflow
   * @param {string} params.userId - Unique ID of the user executing the workflow
   * @param {string} params.sessionId - Unique ID of the current session
   * @param {string} params.userQuery - The original user query/topic
   * @param {Object} params.previousOutput - Output from the previous agent in the pipeline
   * @param {Object} params.metadata - Any additional execution context
   */
  constructor({ workflowId, userId, sessionId, userQuery, previousOutput = {}, metadata = {} }) {
    this.workflowId = workflowId;
    this.userId = userId;
    this.sessionId = sessionId;
    this.userQuery = userQuery;
    this.previousOutput = previousOutput;
    this.metadata = metadata;
    this.timestamp = new Date().toISOString();
  }
}

module.exports = AgentInput;
