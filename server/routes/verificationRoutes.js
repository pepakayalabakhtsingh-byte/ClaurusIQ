const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const { authenticateUser } = require('../middleware/auth');

router.use(authenticateUser);

router.get('/history', verificationController.getVerificationHistory);
router.get('/session/:id', verificationController.getVerificationSession);
router.delete('/session/:id', verificationController.deleteVerificationSession);

module.exports = router;
