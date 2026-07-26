const express = require('express');
const router = express.Router();
const citationController = require('../controllers/citationController');
const { authenticateUser } = require('../middleware/auth');

router.use(authenticateUser);

router.get('/history', citationController.getCitationHistory);
router.get('/session/:id', citationController.getCitationSession);
router.delete('/session/:id', citationController.deleteCitationSession);

module.exports = router;
