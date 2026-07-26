const Workflow = require('../models/Workflow');
const workflowEmitter = require('../events/WorkflowEmitter');
const Logger = require('../logs/Logger');

/**
 * Manages the persistence and state transitions of Workflows.
 * Broadcasts events via WorkflowEmitter when state changes.
 */
class StateStore {
  /**
   * Initializes a new workflow in the DB and returns it
   */
  static async createWorkflow(userId, query, agentList) {
    const agents = agentList.map(name => ({ agentName: name, status: 'idle' }));
    
    const workflow = new Workflow({
      ownerId: userId,
      query,
      status: 'idle',
      agents
    });

    await workflow.save();
    Logger.info('StateStore', `Created workflow ${workflow._id} for user ${userId}`);
    return workflow;
  }

  static async getWorkflow(workflowId) {
    return await Workflow.findById(workflowId);
  }

  static async updateWorkflowStatus(workflowId, status) {
    const workflow = await Workflow.findByIdAndUpdate(workflowId, { status }, { new: true });
    
    let eventName;
    switch(status) {
      case 'running': eventName = workflowEmitter.EVENTS.WORKFLOW_STARTED; break;
      case 'completed': eventName = workflowEmitter.EVENTS.WORKFLOW_COMPLETED; break;
      case 'failed': eventName = workflowEmitter.EVENTS.WORKFLOW_FAILED; break;
      case 'paused': eventName = workflowEmitter.EVENTS.WORKFLOW_PAUSED; break;
      case 'cancelled': eventName = workflowEmitter.EVENTS.WORKFLOW_CANCELLED; break;
    }
    
    if (eventName) {
      workflowEmitter.emit(eventName, workflow);
    }
    
    return workflow;
  }

  static async updateAgentStatus(workflowId, agentIndex, updates) {
    const updateQuery = {};
    for (const [key, value] of Object.entries(updates)) {
      updateQuery[`agents.${agentIndex}.${key}`] = value;
    }

    // First update the agent status
    let workflow = await Workflow.findByIdAndUpdate(
      workflowId,
      { $set: updateQuery },
      { new: true }
    );

    if (!workflow) throw new Error('Workflow not found');

    // Auto-calculate progress
    const completedAgents = workflow.agents.filter(a => a.status === 'completed').length;
    workflow.progress = Math.round((completedAgents / workflow.agents.length) * 100);

    // Save the progress
    await workflow.save();

    // Emit agent specific events
    if (updates.status === 'running') {
      workflowEmitter.emit(workflowEmitter.EVENTS.AGENT_STARTED, { workflow, agentIndex });
    } else if (updates.status === 'completed') {
      workflowEmitter.emit(workflowEmitter.EVENTS.AGENT_COMPLETED, { workflow, agentIndex });
    } else if (updates.status === 'failed') {
      workflowEmitter.emit(workflowEmitter.EVENTS.AGENT_FAILED, { workflow, agentIndex });
    }
    
    workflowEmitter.emit(workflowEmitter.EVENTS.PROGRESS_UPDATED, workflow);
    
    return workflow;
  }
}

module.exports = StateStore;
