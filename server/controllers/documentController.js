const DocumentSession = require('../models/DocumentSession');
const ParserFactory = require('../services/DocumentEngine/ParserFactory');
const IntelligenceProcessor = require('../services/DocumentEngine/IntelligenceProcessor');
const ComparisonEngine = require('../services/DocumentEngine/ComparisonEngine');
const fs = require('fs');
const Logger = require('../logs/Logger');

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { file } = req;
    
    // 1. Create DB entry in 'parsing' state
    const docSession = await DocumentSession.create({
      ownerId: req.user.id,
      metadata: {
        title: file.originalname,
        originalFilename: file.originalname,
        format: file.mimetype,
        fileSize: file.size,
      },
      status: 'parsing',
      storagePath: file.path
    });

    // Run processing async (background) to avoid blocking the response for large files
    processDocumentAsync(docSession, file).catch(err => {
      Logger.error('documentController', `Background processing failed for ${file.originalname}`, err);
    });

    res.status(202).json({
      success: true,
      documentId: docSession._id,
      message: 'Document uploaded and processing started.'
    });

  } catch (error) {
    Logger.error('documentController', 'Upload failed', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

async function processDocumentAsync(docSession, file) {
  try {
    // 2. Parse text
    const rawText = await ParserFactory.parseFile(file);
    
    docSession.content = { rawText };
    docSession.status = 'extracting';
    await docSession.save();

    // 3. Extract Intelligence using Gemini
    const intelligence = await IntelligenceProcessor.processDocument(rawText, file.originalname);

    // 4. Update session
    docSession.metadata = { ...docSession.metadata, ...intelligence.metadata };
    docSession.entities = intelligence.entities;
    docSession.claims = intelligence.claims;
    docSession.summaries = intelligence.summaries;
    docSession.knowledge = intelligence.knowledge;
    docSession.insights = intelligence.insights;
    docSession.status = 'completed';

    await docSession.save();
    
    // Clean up file after extraction to save space
    fs.unlinkSync(file.path);
  } catch (error) {
    docSession.status = 'failed';
    docSession.error = error.message;
    await docSession.save();
  }
}

exports.getDocuments = async (req, res) => {
  try {
    const docs = await DocumentSession.find({ ownerId: req.user.id }).sort({ createdAt: -1 }).select('-content.rawText');
    res.status(200).json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDocumentById = async (req, res) => {
  res.status(200).json({ success: true, data: req.resource });
};

exports.deleteDocument = async (req, res) => {
  try {
    const doc = req.resource;
    await DocumentSession.findByIdAndDelete(doc._id);
    
    if (doc.storagePath && fs.existsSync(doc.storagePath)) {
      fs.unlinkSync(doc.storagePath);
    }
    
    res.status(200).json({ success: true, message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.compareDocuments = async (req, res) => {
  try {
    const { documentIds } = req.body;
    if (!documentIds || documentIds.length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide at least 2 document IDs' });
    }

    const docs = await DocumentSession.find({ _id: { $in: documentIds }, ownerId: req.user.id });
    if (docs.length !== documentIds.length) {
      return res.status(404).json({ success: false, message: 'One or more documents not found or unauthorized' });
    }

    const comparison = await ComparisonEngine.compareDocuments(docs);
    res.status(200).json({ success: true, data: comparison });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
