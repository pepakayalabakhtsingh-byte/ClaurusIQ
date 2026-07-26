const express = require('express');
const router = express.Router();
const { authenticateUser, validateResourceExists, validateOwnership } = require('../middleware/auth');
const DocumentSession = require('../models/DocumentSession');
const documentController = require('../controllers/documentController');
const upload = require('../services/DocumentEngine/FileUploader');

// Protect all document routes
router.use(authenticateUser);

router.post('/upload', upload.single('document'), documentController.uploadDocument);
router.get('/', documentController.getDocuments);
router.get('/:id', validateResourceExists(DocumentSession), validateOwnership, documentController.getDocumentById);
router.delete('/:id', validateResourceExists(DocumentSession), validateOwnership, documentController.deleteDocument);
router.post('/compare', documentController.compareDocuments);

module.exports = router;
