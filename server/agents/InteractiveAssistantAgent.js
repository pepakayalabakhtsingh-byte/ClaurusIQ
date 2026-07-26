const BaseAgent = require('./BaseAgent');
const ConversationSession = require('../models/ConversationSession');
const Logger = require('../logs/Logger');

class InteractiveAssistantAgent extends BaseAgent {
  constructor() {
    super('InteractiveAssistantAgent');
  }

  async execute(input) {
    this.logExecution('execute', 'Creating conversational context for follow-up Q&A');

    const StateStore = require('../workflowState/StateStore');
    const workflow = await StateStore.getWorkflow(input.workflowId);

    if (!workflow) {
      throw new Error('Workflow not found');
    }

    // Build a summary of the research to seed the conversation context
    const verificationAgent = workflow.agents.find(a => a.agentName === 'EvidenceVerificationAgent');
    const reportAgent = workflow.agents.find(a => a.agentName === 'ReportGenerationAgent');

    const claimsSummary = verificationAgent?.output?.claims
      ? verificationAgent.output.claims.map(c => `- ${c.text} [${c.status}, ${c.confidenceScore}%]`).join('\n')
      : 'No claims verified yet.';

    const reportSummary = reportAgent?.output?.summary || 'No report generated yet.';

    // Generate contextual suggested questions based on the research
    const suggestedQuestions = [
      `Summarize the key findings about "${workflow.query}"`,
      'What were the most reliable sources found?',
      'Were there any conflicting claims in the evidence?',
      'What are the research gaps identified?',
      'What recommendations were made?',
    ];

    // Create a ConversationSession linked to this workflow
    let conversationId = null;
    try {
      const conversation = new ConversationSession({
        ownerId: input.userId,
        title: `Research: ${workflow.query.substring(0, 60)}`,
        activeWorkflowId: workflow._id,
        messages: [
          {
            role: 'assistant',
            content: `I've completed analyzing your research on "${workflow.query}". Here's what I found:\n\n**Verified Claims:**\n${claimsSummary}\n\n**Summary:**\n${reportSummary}\n\nFeel free to ask me any follow-up questions about the research findings, sources, or methodology.`,
            metadata: {
              isEvidenceBased: true,
              confidence: 95,
              suggestedQuestions,
            },
            timestamp: new Date(),
          },
        ],
      });

      await conversation.save();
      conversationId = conversation._id;
      this.logExecution('execute', `ConversationSession created: ${conversationId}`);
    } catch (err) {
      Logger.error('InteractiveAssistantAgent', 'Failed to create ConversationSession', err);
    }

    return {
      status: 'Ready',
      conversationId,
      suggestedQuestions,
    };
  }
}

module.exports = InteractiveAssistantAgent;
