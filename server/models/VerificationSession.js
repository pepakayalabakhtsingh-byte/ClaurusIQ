const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
  text: { type: String, required: true },
  source: { type: String, required: true },
  url: { type: String },
  author: { type: String },
  publication: { type: String },
  date: { type: String },
  provider: { type: String }
});

const ClaimSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Historical Fact', 'Scientific Claim', 'Medical Claim', 'Statistical Claim', 'Legal Claim', 'Financial Claim', 'Technological Claim', 'Political Claim', 'General Knowledge', 'Unknown'],
    default: 'Unknown'
  },
  status: {
    type: String,
    enum: ['Verified', 'Likely Verified', 'Partially Verified', 'Conflicting Evidence', 'Insufficient Evidence', 'Unable to Verify', 'Pending'],
    default: 'Pending'
  },
  confidenceScore: { type: Number, min: 0, max: 100, default: 0 },
  supportingEvidence: [EvidenceSchema],
  contradictingEvidence: [EvidenceSchema],
  rationale: { type: String }
});

const VerificationSessionSchema = new mongoose.Schema({
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
  claims: [ClaimSchema],
  status: {
    type: String,
    enum: ['idle', 'running', 'completed', 'failed'],
    default: 'idle'
  },
  verificationTime: { type: Number }, // in milliseconds
  createdAt: { type: Date, default: Date.now }
});

VerificationSessionSchema.index({ workflowId: 1, createdAt: -1 });

module.exports = mongoose.model('VerificationSession', VerificationSessionSchema);
