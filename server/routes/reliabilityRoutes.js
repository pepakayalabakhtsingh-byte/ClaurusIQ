const express = require('express');
const router = express.Router();
const reliabilityController = require('../controllers/reliabilityController');
const { authenticateUser } = require('../middleware/auth');

router.use(authenticateUser);

router.get('/history', reliabilityController.getReliabilityHistory);
router.get('/session/:id', reliabilityController.getReliabilitySession);
router.delete('/session/:id', reliabilityController.deleteReliabilitySession);

module.exports = router;
