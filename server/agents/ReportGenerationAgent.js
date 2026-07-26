const BaseAgent = require('./BaseAgent');
const IntelligenceEngine = require('../services/IntelligenceEngine/IntelligenceEngine');
const ResearchExplanationEngine = require('../services/IntelligenceEngine/ResearchExplanationEngine');
const StateStore = require('../workflowState/StateStore');
const ReportSession = require('../models/ReportSession');
const Logger = require('../logs/Logger');

class ReportGenerationAgent extends BaseAgent {
  constructor() {
    super('ReportGenerationAgent');
  }

  async execute(input) {
    this.logExecution('execute', 'ReportGenerationAgent started.');
    
    const workflow = await StateStore.getWorkflow(input.workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    // Retrieve required outputs from previous agents
    const verificationAgentStep = workflow.agents.find(a => a.agentName === 'EvidenceVerificationAgent');
    const citationAgentStep = workflow.agents.find(a => a.agentName === 'CitationAgent');
    const reliabilityAgentStep = workflow.agents.find(a => a.agentName === 'ReliabilityAgent');

    const verificationData = verificationAgentStep && verificationAgentStep.output ? verificationAgentStep.output : { claims: [] };
    const citationData = citationAgentStep && citationAgentStep.output ? citationAgentStep.output : { citations: [] };
    const reliabilityData = reliabilityAgentStep && reliabilityAgentStep.output ? reliabilityAgentStep.output : {};

    // Generate Heuristic Intelligence
    const reportData = IntelligenceEngine.generateReport(workflow, verificationData, citationData, reliabilityData);
    this.logExecution('execute', 'Executive Intelligence successfully generated.');

    // Generate LLM-based comprehensive explanation
    const defaultDepth = 'Detailed';
    const explanation = await ResearchExplanationEngine.generate(workflow, verificationData, citationData, reliabilityData, defaultDepth);
    this.logExecution('execute', 'Comprehensive explanation successfully generated.');

    // Save to Database
    let reportSessionId = null;
    try {
      const session = new ReportSession({
        workflowId: input.workflowId || '000000000000000000000000',
        ownerId: input.userId || '000000000000000000000000',
        ...reportData,
        explanation,
        depth: defaultDepth
      });
      const saved = await session.save();
      reportSessionId = saved._id;
      this.logExecution('execute', `ReportSession saved to DB: ${reportSessionId}`);
    } catch (err) {
      Logger.error('ReportGenerationAgent', 'Failed to save ReportSession to DB', err);
    }

    return {
      reportSessionId,
      summary: reportData.executiveSummary,
      recommendations: reportData.recommendations,
      explanation,
      depth: defaultDepth
    };
  }
}

module.exports = ReportGenerationAgent;
