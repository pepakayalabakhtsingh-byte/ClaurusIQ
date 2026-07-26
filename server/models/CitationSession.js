const mongoose = require('mongoose');

const CitationSchema = new mongoose.Schema({
  originalEvidenceId: { type: String }, // Optional link back to a specific evidence block
  title: { type: String, required: true },
  author: { type: String, default: 'Unknown Author' },
  publisher: { type: String, default: 'Unknown Publisher' },
  year: { type: String, default: 'Unknown Year' },
  url: { type: String },
  doi: { type: String },
  sourceCategory: { type: String, default: 'Unknown' },
  trustScore: { type: Number, min: 0, max: 100, default: 0 },
  credibilityLevel: { 
    type: String, 
    enum: ['Excellent', 'Very High', 'High', 'Medium', 'Low', 'Very Low', 'Unknown'],
    default: 'Unknown'
  },
  trustRationale: { type: String },
  formats: {
    apa: { type: String },
    mla: { type: String },
    ieee: { type: String },
    chicago: { type: String },
    harvard: { type: String },
    bibtex: { type: String },
    ris: { type: String }
  }
});

const CitationSessionSchema = new mongoose.Schema({
  workflowId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Workflow',
    required: true 
  },
  verificationSessionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'VerificationSession'
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  citations: [CitationSchema],
  createdAt: { type: Date, default: Date.now }
});

CitationSessionSchema.index({ workflowId: 1, createdAt: -1 });

module.exports = mongoose.model('CitationSession', CitationSessionSchema);
