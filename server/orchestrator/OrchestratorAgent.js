const StateStore = require('../workflowState/StateStore');
const AgentInput = require('../types/AgentInput');
const Logger = require('../logs/Logger');

// Dynamic imports to avoid circular dependencies
const agents = {
  ResearchAgent: require('../agents/ResearchAgent'),
  SourceDiscoveryAgent: require('../agents/SourceDiscoveryAgent'),
  EvidenceVerificationAgent: require('../agents/EvidenceVerificationAgent'),
  CitationAgent: require('../agents/CitationAgent'),
  ReliabilityAgent: require('../agents/ReliabilityAgent'),
  ReportGenerationAgent: require('../agents/ReportGenerationAgent'),
  InteractiveAssistantAgent: require('../agents/InteractiveAssistantAgent'),
};

class OrchestratorAgent {
  constructor(workflowId, sessionId) {
    this.workflowId = workflowId;
    this.sessionId = sessionId;
    this.isPaused = false;
    this.isCancelled = false;
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  cancel() {
    this.isCancelled = true;
  }

  async executeSequence() {
    try {
      const workflow = await StateStore.getWorkflow(this.workflowId);
      if (!workflow) throw new Error('Workflow not found');

      Logger.info('OrchestratorAgent', `Starting orchestration for workflow ${this.workflowId}`);

      let previousOutput = {};

      for (let i = workflow.currentAgentIndex; i < workflow.agents.length; i++) {
        // Check for interruption
        if (this.isCancelled) {
          Logger.info('OrchestratorAgent', `Workflow ${this.workflowId} cancelled`);
          return;
        }

        // Wait if paused
        while (this.isPaused) {
          if (this.isCancelled) return;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const agentMetadata = workflow.agents[i];
        const AgentClass = agents[agentMetadata.agentName];
        
        if (!AgentClass) {
          throw new Error(`Unknown agent: ${agentMetadata.agentName}`);
        }

        const agent = new AgentClass();

        // Update status to running
        await StateStore.updateAgentStatus(this.workflowId, i, {
          status: 'running',
          startTime: new Date()
        });
        
        // Update workflow currentAgentIndex
        workflow.currentAgentIndex = i;
        await workflow.save();

        const input = new AgentInput({
          workflowId: this.workflowId,
          userId: workflow.ownerId,
          sessionId: this.sessionId,
          userQuery: workflow.query,
          previousOutput,
          metadata: { stepIndex: i }
        });

        // Save input to DB
        await StateStore.updateAgentStatus(this.workflowId, i, { input: input });

        // Execute Agent
        const output = await agent.run(input);

        // Update Agent State with Output
        await StateStore.updateAgentStatus(this.workflowId, i, {
          status: output.status === 'success' ? 'completed' : 'failed',
          endTime: new Date(),
          executionTimeMs: output.executionTimeMs,
          output: output.data,
          logs: output.logs,
          error: output.error
        });

        if (output.status !== 'success') {
          // Break sequence on failure
          await StateStore.updateWorkflowStatus(this.workflowId, 'failed');
          return;
        }

        // Pass output to next agent
        previousOutput = output.data;
        
        // Final agent -> update workflow final report
        if (i === workflow.agents.length - 1) {
          workflow.finalReport = output.data;
          await workflow.save();
        }
      }

      await StateStore.updateWorkflowStatus(this.workflowId, 'completed');
      Logger.info('OrchestratorAgent', `Workflow ${this.workflowId} completed successfully`);

    } catch (error) {
      Logger.error('OrchestratorAgent', `Orchestration error in workflow ${this.workflowId}`, error);
      await StateStore.updateWorkflowStatus(this.workflowId, 'failed');
    }
  }
}

module.exports = OrchestratorAgent;
