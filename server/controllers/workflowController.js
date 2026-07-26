const WorkflowEngine = require('../workflowEngine/Engine');
const StateStore = require('../workflowState/StateStore');
const workflowEmitter = require('../events/WorkflowEmitter');
const Logger = require('../logs/Logger');

exports.startWorkflow = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }
    if (query.length > 500) {
      return res.status(400).json({ success: false, message: 'Query must be less than 500 characters' });
    }

    const workflow = await WorkflowEngine.startWorkflow(req.user.id, req.sessionID || 'session-default', query);
    
    res.status(201).json({
      success: true,
      workflowId: workflow._id,
      message: 'Workflow started successfully'
    });
  } catch (error) {
    Logger.error('workflowController', 'Error starting workflow', error);
    res.status(500).json({ success: false, message: 'Failed to start workflow' });
  }
};

exports.getWorkflows = async (req, res) => {
  try {
    const WorkflowModel = require('../models/Workflow');
    const userWorkflows = await WorkflowModel.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: userWorkflows });
  } catch (error) {
    Logger.error('workflowController', 'Error getting workflows', error);
    res.status(500).json({ success: false, message: 'Failed to fetch workflows' });
  }
};

exports.getWorkflow = async (req, res) => {
  try {
    // Attempt to get live state from engine
    const liveWorkflow = await StateStore.getWorkflow(req.params.id);
    const workflow = liveWorkflow || req.resource;
    
    res.status(200).json({ success: true, data: workflow });
  } catch (error) {
    Logger.error('workflowController', 'Error getting workflow', error);
    res.status(500).json({ success: false, message: 'Failed to fetch workflow' });
  }
};

exports.performAction = async (req, res) => {
  try {
    const { action } = req.body;
    const workflowId = req.params.id;
    let workflow;

    switch (action) {
      case 'pause':
        workflow = await WorkflowEngine.pauseWorkflow(workflowId);
        break;
      case 'resume':
        workflow = await WorkflowEngine.resumeWorkflow(workflowId);
        break;
      case 'cancel':
        workflow = await WorkflowEngine.cancelWorkflow(workflowId);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    res.status(200).json({ success: true, data: workflow });
  } catch (error) {
    Logger.error('workflowController', `Error performing action ${req.body.action}`, error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Server-Sent Events (SSE) endpoint to stream real-time workflow state updates.
 */
exports.streamWorkflow = async (req, res) => {
  const workflowId = req.params.id;

  // Set necessary SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial connected message
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', workflowId })}\n\n`);

  // Event handler for state changes
  const handleStateChange = (workflow) => {
    if (workflow._id.toString() === workflowId) {
      res.write(`data: ${JSON.stringify({ type: 'STATE_UPDATE', workflow })}\n\n`);
    }
  };

  const handleProgress = (workflow) => {
    if (workflow._id.toString() === workflowId) {
      res.write(`data: ${JSON.stringify({ type: 'PROGRESS_UPDATE', workflow })}\n\n`);
    }
  };

  // Bind to emitter
  workflowEmitter.on(workflowEmitter.EVENTS.WORKFLOW_STARTED, handleStateChange);
  workflowEmitter.on(workflowEmitter.EVENTS.WORKFLOW_PAUSED, handleStateChange);
  workflowEmitter.on(workflowEmitter.EVENTS.WORKFLOW_RESUMED, handleStateChange);
  workflowEmitter.on(workflowEmitter.EVENTS.WORKFLOW_CANCELLED, handleStateChange);
  workflowEmitter.on(workflowEmitter.EVENTS.WORKFLOW_COMPLETED, handleStateChange);
  workflowEmitter.on(workflowEmitter.EVENTS.WORKFLOW_FAILED, handleStateChange);
  
  const handleAgentStarted = ({ workflow }) => handleStateChange(workflow);
  const handleAgentCompleted = ({ workflow }) => handleStateChange(workflow);
  const handleAgentFailed = ({ workflow }) => handleStateChange(workflow);

  workflowEmitter.on(workflowEmitter.EVENTS.AGENT_STARTED, handleAgentStarted);
  workflowEmitter.on(workflowEmitter.EVENTS.AGENT_COMPLETED, handleAgentCompleted);
  workflowEmitter.on(workflowEmitter.EVENTS.AGENT_FAILED, handleAgentFailed);
  workflowEmitter.on(workflowEmitter.EVENTS.PROGRESS_UPDATED, handleProgress);

  // Clean up on client disconnect
  req.on('close', () => {
    workflowEmitter.off(workflowEmitter.EVENTS.WORKFLOW_STARTED, handleStateChange);
    workflowEmitter.off(workflowEmitter.EVENTS.WORKFLOW_PAUSED, handleStateChange);
    workflowEmitter.off(workflowEmitter.EVENTS.WORKFLOW_RESUMED, handleStateChange);
    workflowEmitter.off(workflowEmitter.EVENTS.WORKFLOW_CANCELLED, handleStateChange);
    workflowEmitter.off(workflowEmitter.EVENTS.WORKFLOW_COMPLETED, handleStateChange);
    workflowEmitter.off(workflowEmitter.EVENTS.WORKFLOW_FAILED, handleStateChange);
    
    workflowEmitter.off(workflowEmitter.EVENTS.AGENT_STARTED, handleAgentStarted);
    workflowEmitter.off(workflowEmitter.EVENTS.AGENT_COMPLETED, handleAgentCompleted);
    workflowEmitter.off(workflowEmitter.EVENTS.AGENT_FAILED, handleAgentFailed);
    workflowEmitter.off(workflowEmitter.EVENTS.PROGRESS_UPDATED, handleProgress);
  });
};

exports.generateExplanation = async (req, res) => {
  try {
    const { depth } = req.body;
    const workflowId = req.params.id;
    
    if (!['Quick', 'Detailed', 'Research'].includes(depth)) {
      return res.status(400).json({ success: false, message: 'Invalid depth provided' });
    }

    const workflow = await StateStore.getWorkflow(workflowId);
    if (!workflow) {
      return res.status(404).json({ success: false, message: 'Workflow not found' });
    }

    const verificationAgentStep = workflow.agents.find(a => a.agentName === 'EvidenceVerificationAgent');
    const citationAgentStep = workflow.agents.find(a => a.agentName === 'CitationAgent');
    const reliabilityAgentStep = workflow.agents.find(a => a.agentName === 'ReliabilityAgent');

    const verificationData = verificationAgentStep && verificationAgentStep.output ? verificationAgentStep.output : { claims: [] };
    const citationData = citationAgentStep && citationAgentStep.output ? citationAgentStep.output : { citations: [] };
    const reliabilityData = reliabilityAgentStep && reliabilityAgentStep.output ? reliabilityAgentStep.output : {};

    const ResearchExplanationEngine = require('../services/IntelligenceEngine/ResearchExplanationEngine');
    const ReportSession = require('../models/ReportSession');

    // Run the engine for the new depth
    const explanation = await ResearchExplanationEngine.generate(workflow, verificationData, citationData, reliabilityData, depth);

    // Update ReportSession
    await ReportSession.findOneAndUpdate(
      { workflowId: workflow._id },
      { $set: { explanation, depth } }
    );

    // Also update the agent's output in the workflow model so the UI gets it instantly
    const reportAgentIndex = workflow.agents.findIndex(a => a.agentName === 'ReportGenerationAgent');
    if (reportAgentIndex !== -1) {
      await StateStore.updateAgentStatus(workflow._id, reportAgentIndex, {
        'output.explanation': explanation,
        'output.depth': depth,
        status: 'completed'
      });
    }

    res.status(200).json({ success: true, explanation, depth });
  } catch (error) {
    Logger.error('workflowController', 'Error generating explanation', error);
    res.status(500).json({ success: false, message: 'Failed to generate explanation' });
  }
};
