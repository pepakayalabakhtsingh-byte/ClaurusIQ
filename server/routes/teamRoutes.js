const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticateUser } = require('../middleware/auth');

router.use(authenticateUser);

router.route('/')
  .post(teamController.createTeam)
  .get(teamController.getMyTeams);

router.route('/:id/members')
  .post(teamController.addMember);

module.exports = router;
