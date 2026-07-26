const mongoose = require('mongoose');

const DocumentSessionSchema = new mongoose.Schema({
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  workflowId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Workflow'
  },
  metadata: {
    title: { type: String, required: true },
    originalFilename: { type: String },
    author: { type: String },
    format: { type: String },
    language: { type: String },
    fileSize: { type: Number }, // in bytes
    pageCount: { type: Number },
    uploadDate: { type: Date, default: Date.now },
  },
  content: {
    rawText: { type: String },
    sections: [{
      heading: String,
      text: String,
      pageNumber: Number,
    }]
  },
  entities: [{
    type: { type: String, enum: ['Person', 'Organization', 'Location', 'Technology', 'Date', 'Event', 'Other'] },
    name: { type: String },
    mentions: { type: Number, default: 1 }
  }],
  claims: [{
    text: { type: String },
    category: { type: String },
    location: {
      page: Number,
      paragraph: Number,
      context: String
    }
  }],
  summaries: {
    executive: { type: String },
    technical: { type: String },
    bullets: [{ type: String }]
  },
  knowledge: {
    topics: [{ type: String }],
    definitions: [{ term: String, definition: String }],
    timeline: [{ date: String, event: String }]
  },
  insights: {
    findings: [{ type: String }],
    gaps: [{ type: String }],
    recommendations: [{ type: String }]
  },
  status: {
    type: String,
    enum: ['uploaded', 'parsing', 'extracting', 'completed', 'failed'],
    default: 'uploaded'
  },
  error: { type: String },
  storagePath: { type: String }
}, {
  timestamps: true
});

DocumentSessionSchema.index({ ownerId: 1, createdAt: -1 });

module.exports = mongoose.model('DocumentSession', DocumentSessionSchema);
