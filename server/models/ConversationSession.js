const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  metadata: {
    isEvidenceBased: { type: Boolean, default: false },
    confidence: Number,
    consensusLevel: String,
    sources: [{
      title: String,
      trustScore: Number,
    }],
    reasoningTrace: {
      topic: String,
      intent: String,
      evidenceCount: Number,
      citationCount: Number,
      reliabilityScore: Number,
    },
    suggestedQuestions: [String],
    processingTimeMs: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ConversationSessionSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    default: 'New Conversation',
  },
  messages: [MessageSchema],
  activeWorkflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow',
  },
  bookmarks: [{
    type: { type: String }, // 'claim', 'source', 'report'
    referenceId: String,
    label: String,
    createdAt: { type: Date, default: Date.now },
  }],
  notes: [{
    content: String,
    createdAt: { type: Date, default: Date.now },
  }],
  isPinned: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('ConversationSession', ConversationSessionSchema);
