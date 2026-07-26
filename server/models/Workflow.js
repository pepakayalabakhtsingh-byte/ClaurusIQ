const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  agentName: { type: String, required: true },
  status: { type: String, enum: ['idle', 'queued', 'running', 'waiting', 'completed', 'failed', 'cancelled'], default: 'idle' },
  startTime: { type: Date },
  endTime: { type: Date },
  executionTimeMs: { type: Number, default: 0 },
  input: { type: mongoose.Schema.Types.Mixed },
  output: { type: mongoose.Schema.Types.Mixed },
  logs: [{ type: String }],
  error: { type: String }
});

const workflowSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  query: { type: String, required: true },
  status: { type: String, enum: ['idle', 'running', 'paused', 'completed', 'failed', 'cancelled'], default: 'idle' },
  progress: { type: Number, default: 0 },
  agents: [agentSchema],
  currentAgentIndex: { type: Number, default: 0 },
  finalReport: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

// Update the updatedAt timestamp before saving
workflowSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Workflow', workflowSchema);
