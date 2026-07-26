const express = require('express');
const { authenticateUser, validateResourceExists, validateOwnership } = require('../middleware/auth');
const Workflow = require('../models/Workflow');
const {
  startWorkflow,
  getWorkflows,
  getWorkflow,
  performAction,
  streamWorkflow
} = require('../controllers/workflowController');

const router = express.Router();

router.use(authenticateUser); // Ensure all workflow routes are authenticated

router.route('/')
  .post(startWorkflow)
  .get(getWorkflows);

router.route('/:id')
  .get(validateResourceExists(Workflow), validateOwnership, getWorkflow);

router.route('/:id/action')
  .post(validateResourceExists(Workflow), validateOwnership, performAction);

router.route('/:id/stream')
  .get(validateResourceExists(Workflow), validateOwnership, streamWorkflow);

router.route('/:id/explain')
  .post(validateResourceExists(Workflow), validateOwnership, require('../controllers/workflowController').generateExplanation);

module.exports = router;
