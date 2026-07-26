const mongoose = require('mongoose');

const ReliabilitySessionSchema = new mongoose.Schema({
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
  bias: {
    level: String,
    score: Number,
    style: String,
    indicators: {
      emotional: Number,
      subjective: Number,
      sensational: Number
    }
  },
  diversity: {
    score: Number,
    level: String,
    independentSources: Number,
    publishers: Number,
    categories: Number
  },
  consensus: {
    score: Number,
    level: String,
    agreementPercentage: Number,
    metrics: {
      supporting: Number,
      contradicting: Number,
      neutral: Number
    }
  },
  reliability: {
    score: Number,
    level: String,
    breakdown: {
      evidenceQualityContribution: Number,
      sourceDiversityContribution: Number,
      consensusContribution: Number,
      citationQualityContribution: Number,
      objectivityContribution: Number
    },
    metrics: {
      evidenceQuality: Number,
      researchQuality: Number,
      citationQuality: Number
    }
  },
  explanation: {
    reason: String,
    supportingFactors: [String],
    weaknesses: [String],
    missingInformation: [String],
    recommendation: String
  },
  trace: {
    type: Object
  }
}, {
  timestamps: true
});

ReliabilitySessionSchema.index({ workflowId: 1, createdAt: -1 });

module.exports = mongoose.model('ReliabilitySession', ReliabilitySessionSchema);
