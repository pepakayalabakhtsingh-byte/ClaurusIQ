const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');

// Only Admins can access these routes
router.use(authenticateUser, authorizeAdmin);

router.get('/health', adminController.getSystemHealth);
router.get('/stats', adminController.getStats);

module.exports = router;
