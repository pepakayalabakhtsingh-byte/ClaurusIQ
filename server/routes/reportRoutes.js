const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

router.use(authenticateUser);

router.get('/workflow/:workflowId', reportController.getReportByWorkflowId);
router.post('/workflow/:workflowId/export/:format', reportController.exportReport);

module.exports = router;
