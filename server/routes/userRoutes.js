const express = require('express');
const router = express.Router();
const {
  updateProfile,
  changePassword,
  updatePreferences,
} = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth');

router.use(authenticateUser); // All routes below are protected

router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.put('/preferences', updatePreferences);

module.exports = router;
