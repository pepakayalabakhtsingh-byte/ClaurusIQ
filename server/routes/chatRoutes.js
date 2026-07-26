const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const chatController = require('../controllers/chatController');

router.use(authenticateUser);

router.post('/message', chatController.sendMessage);
router.get('/history', chatController.getHistory);

module.exports = router;
