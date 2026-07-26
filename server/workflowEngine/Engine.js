const StateStore = require('../workflowState/StateStore');
const OrchestratorAgent = require('../orchestrator/OrchestratorAgent');
const Logger = require('../logs/Logger');

class WorkflowEngine {
  constructor() {
    this.activeWorkflows = new Map(); // Maps workflowId -> Execution Promise / Controller
  }

  /**
   * Defines the standard sequence of agents for a research workflow.
   */
  static getStandardAgentSequence() {
    return [
      'ResearchAgent',
      'SourceDiscoveryAgent',
      'EvidenceVerificationAgent',
      'CitationAgent',
      'ReliabilityAgent',
      'ReportGenerationAgent',
      'InteractiveAssistantAgent'
    ];
  }

  async startWorkflow(userId, sessionId, query) {
    try {
      const agentList = WorkflowEngine.getStandardAgentSequence();
      const workflow = await StateStore.createWorkflow(userId, query, agentList);
      
      // Update state to running
      await StateStore.updateWorkflowStatus(workflow._id, 'running');
      
      // Start orchestration asynchronously
      const orchestrator = new OrchestratorAgent(workflow._id, sessionId);
      const executionPromise = orchestrator.executeSequence().catch(err => {
        Logger.error('WorkflowEngine', `Workflow ${workflow._id} failed fatally`, err);
        StateStore.updateWorkflowStatus(workflow._id, 'failed');
      });

      this.activeWorkflows.set(workflow._id.toString(), {
        orchestrator,
        promise: executionPromise
      });

      return workflow;
    } catch (error) {
      Logger.error('WorkflowEngine', 'Failed to start workflow', error);
      throw error;
    }
  }

  async pauseWorkflow(workflowId) {
    const workflow = await StateStore.getWorkflow(workflowId);
    if (!workflow || workflow.status !== 'running') {
      throw new Error('Can only pause a running workflow');
    }
    
    const active = this.activeWorkflows.get(workflowId.toString());
    if (active && active.orchestrator) {
      active.orchestrator.pause();
    }
    
    return await StateStore.updateWorkflowStatus(workflowId, 'paused');
  }

  async resumeWorkflow(workflowId) {
    const workflow = await StateStore.getWorkflow(workflowId);
    if (!workflow || workflow.status !== 'paused') {
      throw new Error('Can only resume a paused workflow');
    }
    
    const active = this.activeWorkflows.get(workflowId.toString());
    if (active && active.orchestrator) {
      active.orchestrator.resume();
    } else {
      // If it wasn't in memory (e.g., server restarted), we'd need to rehydrate it.
      // For this phase, we assume memory holds it or we recreate the Orchestrator.
      const orchestrator = new OrchestratorAgent(workflowId, workflow.sessionId || 'resume-session');
      const executionPromise = orchestrator.executeSequence();
      this.activeWorkflows.set(workflowId.toString(), { orchestrator, promise: executionPromise });
    }
    
    return await StateStore.updateWorkflowStatus(workflowId, 'running');
  }

  async cancelWorkflow(workflowId) {
    const workflow = await StateStore.getWorkflow(workflowId);
    if (!workflow || ['completed', 'failed', 'cancelled'].includes(workflow.status)) {
      throw new Error('Workflow already finished');
    }
    
    const active = this.activeWorkflows.get(workflowId.toString());
    if (active && active.orchestrator) {
      active.orchestrator.cancel();
      this.activeWorkflows.delete(workflowId.toString());
    }
    
    return await StateStore.updateWorkflowStatus(workflowId, 'cancelled');
  }
}

// Export singleton
module.exports = new WorkflowEngine();
