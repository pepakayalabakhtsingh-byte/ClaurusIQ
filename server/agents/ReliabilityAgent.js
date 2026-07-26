const BaseAgent = require('./BaseAgent');
const ReliabilityEngine = require('../services/ReliabilityEngine/ReliabilityEngine');
const ReliabilitySession = require('../models/ReliabilitySession');
const StateStore = require('../workflowState/StateStore');
const Logger = require('../logs/Logger');

class ReliabilityAgent extends BaseAgent {
  constructor() {
    super('ReliabilityAgent');
  }

  async execute(input) {
    this.logExecution('execute', 'Analyzing bias, diversity, consensus, and computing final reliability');
    
    // We need output from both EvidenceVerificationAgent and CitationAgent
    // The input.previousOutput is from CitationAgent
    const citationData = input.previousOutput;
    if (!citationData || !citationData.citations) {
      throw new Error('Missing citations data from Phase 5');
    }

    // We also need verificationData, let's fetch it from StateStore or rely on citationData.verificationSessionId
    // Because we're in the orchestrator, we can actually fetch the workflow to get previous agent outputs
    const workflow = await StateStore.getWorkflow(input.workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    // Find VerificationAgent output
    const verificationAgentStep = workflow.agents.find(a => a.agentName === 'EvidenceVerificationAgent');
    const verificationData = verificationAgentStep && verificationAgentStep.output ? verificationAgentStep.output : { claims: [] };

    // 1. Run the Reliability Engine
    const analysis = await ReliabilityEngine.analyze(workflow, verificationData, citationData);
    
    this.logExecution('execute', `Reliability computed: ${analysis.reliability.score}/100 (${analysis.reliability.level})`);
    this.logExecution('execute', `Consensus level: ${analysis.consensus.level} (${analysis.consensus.agreementPercentage}%)`);

    // 2. Save ReliabilitySession to DB
    let reliabilitySessionId = null;
    try {
      const session = new ReliabilitySession({
        workflowId: input.workflowId || '000000000000000000000000',
        ownerId: input.userId || '000000000000000000000000',
        bias: analysis.bias,
        diversity: analysis.diversity,
        consensus: analysis.consensus,
        reliability: analysis.reliability,
        explanation: analysis.explanation,
        trace: analysis.trace
      });
      const saved = await session.save();
      reliabilitySessionId = saved._id;
      this.logExecution('execute', `Reliability Session saved to DB: ${reliabilitySessionId}`);
    } catch (err) {
      Logger.error('ReliabilityAgent', 'Failed to save ReliabilitySession to DB', err);
    }

    return {
      reliabilitySessionId,
      ...analysis
    };
  }
}

module.exports = ReliabilityAgent;
