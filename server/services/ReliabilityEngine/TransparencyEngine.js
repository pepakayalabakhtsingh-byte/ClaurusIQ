const StateStore = require('../../workflowState/StateStore');

class TransparencyEngine {
  /**
   * Compiles the full reasoning trace for the user to inspect.
   * Pulls the comprehensive step-by-step history from StateStore.
   * @param {string} workflowId 
   */
  static async buildFullTrace(workflowId) {
    const workflow = await StateStore.getWorkflow(workflowId);
    if (!workflow) return {};

    const trace = {
      originalQuery: workflow.query,
      workflowStatus: workflow.status,
      executionSteps: []
    };

    // Map the agents' outputs into a replayable trace structure
    for (const agent of workflow.agents) {
      if (agent.status === 'completed') {
        trace.executionSteps.push({
          phase: agent.agentName,
          executionTimeMs: agent.executionTimeMs,
          outputSummary: agent.output ? Object.keys(agent.output) : 'No data',
          logsCount: agent.logs ? agent.logs.length : 0
        });
      }
    }

    return trace;
  }
}

module.exports = TransparencyEngine;
