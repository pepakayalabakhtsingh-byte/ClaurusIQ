const EventEmitter = require('events');

/**
 * Centralized Event Bus for Workflow Execution.
 * Orchestrator and Engine emit events here.
 * SSE controllers listen to these events to push updates to the frontend.
 */
class WorkflowEmitter extends EventEmitter {
  constructor() {
    super();
    // Increase max listeners since many workflows can run concurrently
    this.setMaxListeners(100);
  }
}

// Export a singleton instance
const workflowEmitter = new WorkflowEmitter();

// Standard Event Names
workflowEmitter.EVENTS = {
  WORKFLOW_STARTED: 'WORKFLOW_STARTED',
  WORKFLOW_COMPLETED: 'WORKFLOW_COMPLETED',
  WORKFLOW_FAILED: 'WORKFLOW_FAILED',
  WORKFLOW_CANCELLED: 'WORKFLOW_CANCELLED',
  WORKFLOW_PAUSED: 'WORKFLOW_PAUSED',
  WORKFLOW_RESUMED: 'WORKFLOW_RESUMED',
  
  AGENT_STARTED: 'AGENT_STARTED',
  AGENT_COMPLETED: 'AGENT_COMPLETED',
  AGENT_FAILED: 'AGENT_FAILED',
  
  PROGRESS_UPDATED: 'PROGRESS_UPDATED'
};

module.exports = workflowEmitter;
