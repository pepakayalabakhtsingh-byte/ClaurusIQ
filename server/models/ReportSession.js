const mongoose = require('mongoose');

const ReportSessionSchema = new mongoose.Schema({
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  executiveSummary: {
    objective: String,
    scope: String,
    methodology: String,
    conclusion: String,
    futureResearch: String
  },
  keyFindings: {
    topDiscoveries: Array,
    totalAnalyzed: Number
  },
  recommendations: [{
    category: String,
    priority: String,
    recommendation: String,
    why: String,
    confidence: String
  }],
  researchGaps: [{
    type: { type: String },
    description: String
  }],
  explanation: {
    type: String,
    default: ''
  },
  depth: {
    type: String,
    enum: ['Quick', 'Detailed', 'Research'],
    default: 'Detailed'
  },
  version: {
    type: Number,
    default: 1
  },
  exports: [{
    format: String,
    timestamp: Date,
    success: Boolean
  }]
}, { timestamps: true });

ReportSessionSchema.index({ workflowId: 1, createdAt: -1 });

module.exports = mongoose.model('ReportSession', ReportSessionSchema);
