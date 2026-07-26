const ConversationSession = require('../models/ConversationSession');
const IntentDetector = require('../services/ChatEngine/IntentDetector');
const ContextManager = require('../services/ChatEngine/ContextManager');
const ResearchRetriever = require('../services/ChatEngine/ResearchRetriever');
const ReasoningEngine = require('../services/ChatEngine/ReasoningEngine');
const ResponseGenerator = require('../services/ChatEngine/ResponseGenerator');

/**
 * POST /api/chat/message
 * Process a user message and return an evidence-aware response.
 */
exports.sendMessage = async (req, res) => {
  const startTime = Date.now();
  try {
    const { conversationId, message, style } = req.body;
    const userId = req.user._id;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
    }

    // 1. Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await ConversationSession.findOne({ _id: conversationId, ownerId: userId });
      if (!conversation) {
        return res.status(404).json({ success: false, error: 'Conversation not found.' });
      }
    } else {
      conversation = new ConversationSession({
        ownerId: userId,
        title: message.substring(0, 60),
      });
    }

    // 2. Get context
    const context = ContextManager.getContext(conversation._id.toString());
    if (style) ContextManager.setStyle(conversation._id.toString(), style);

    // 3. Detect intent
    const { intent, confidence: intentConfidence } = IntentDetector.detect(message, context);

    // 4. Retrieve research data
    let workflow = null;
    let researchData = { verification: null, citation: null, reliability: null, report: null };

    const Workflow = require('../models/Workflow');
    if (context.activeWorkflowId) {
      workflow = await Workflow.findById(context.activeWorkflowId);
      if (workflow) {
        researchData = await ResearchRetriever.getFullContext(workflow._id);
      }
    } else {
      workflow = await ResearchRetriever.getLatestWorkflow(userId);
      if (workflow) {
        researchData = await ResearchRetriever.getFullContext(workflow._id);
        ContextManager.updateContext(conversation._id.toString(), {
          activeWorkflowId: workflow._id,
          activeTopic: workflow.query,
        });
      }
    }

    // 5. Build reasoning chain
    const reasoning = ReasoningEngine.buildReasoning(intent, researchData, workflow);

    // 6. Generate response
    const currentStyle = ContextManager.getContext(conversation._id.toString()).style;
    const responseData = await ResponseGenerator.generate(message, reasoning, currentStyle);

    const processingTimeMs = Date.now() - startTime;

    // 7. Save messages
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    conversation.messages.push({
      role: 'assistant',
      content: responseData.text,
      metadata: {
        isEvidenceBased: responseData.isEvidenceBased,
        confidence: responseData.confidence,
        consensusLevel: responseData.consensusLevel,
        sources: responseData.sources,
        reasoningTrace: responseData.reasoningTrace,
        suggestedQuestions: responseData.suggestedQuestions,
        processingTimeMs,
      },
      timestamp: new Date(),
    });

    if (conversation.activeWorkflowId === undefined && workflow) {
      conversation.activeWorkflowId = workflow._id;
    }

    await conversation.save();

    // 8. Update context
    ContextManager.updateContext(conversation._id.toString(), {
      activeTopic: reasoning.topic,
    });

    res.status(200).json({
      success: true,
      data: {
        conversationId: conversation._id,
        response: {
          text: responseData.text,
          isEvidenceBased: responseData.isEvidenceBased,
          confidence: responseData.confidence,
          consensusLevel: responseData.consensusLevel,
          sources: responseData.sources,
          suggestedQuestions: responseData.suggestedQuestions,
          reasoningTrace: responseData.reasoningTrace,
        },
        processingTimeMs,
      },
    });
  } catch (error) {
    console.error('Chat sendMessage error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/chat/history
 */
exports.getHistory = async (req, res) => {
  try {
    const conversations = await ConversationSession.find({ ownerId: req.user._id })
      .select('title isPinned createdAt updatedAt messages')
      .sort({ updatedAt: -1 })
      .limit(50);

    // Return minimal data — just title, date, and last message preview
    const data = conversations.map(c => ({
      _id: c._id,
      title: c.title,
      isPinned: c.isPinned,
      lastMessage: c.messages.length > 0 ? c.messages[c.messages.length - 1].content.substring(0, 80) : '',
      messageCount: c.messages.length,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/chat/:id
 */
exports.getConversation = async (req, res) => {
  try {
    const conversation = await ConversationSession.findOne({
      _id: req.params.id,
      ownerId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found.' });
    }

    res.status(200).json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * DELETE /api/chat/:id
 */
exports.deleteConversation = async (req, res) => {
  try {
    const conversation = await ConversationSession.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found.' });
    }

    ContextManager.clearContext(req.params.id);
    res.status(200).json({ success: true, message: 'Conversation deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
