const { Queue, Worker, QueueEvents } = require('bullmq');
const Redis = require('ioredis');
const config = require('../../config/config');
const logger = require('../../config/logger');

// Redis Connection
const connection = new Redis(config.redis.url, {
  maxRetriesPerRequest: null,
});

connection.on('error', (err) => {
  logger.error(`Redis connection error: ${err.message}`);
});

connection.on('connect', () => {
  logger.info('✅ Redis Connected');
});

// Define Queues
const QUEUES = {
  RESEARCH: 'research-queue',
  OCR: 'ocr-queue',
  REPORT: 'report-queue'
};

const queues = {};
const queueEvents = {};

// Initialize Queues
Object.values(QUEUES).forEach((queueName) => {
  queues[queueName] = new Queue(queueName, { connection });
  queueEvents[queueName] = new QueueEvents(queueName, { connection });

  queueEvents[queueName].on('completed', ({ jobId, returnvalue }) => {
    logger.info(`Job ${jobId} completed in ${queueName}`);
  });

  queueEvents[queueName].on('failed', ({ jobId, failedReason }) => {
    logger.error(`Job ${jobId} failed in ${queueName}: ${failedReason}`);
  });
});

/**
 * Adds a job to a specific queue
 * @param {string} queueName - Name of the queue (use QUEUES enum)
 * @param {string} jobName - Name of the job
 * @param {Object} data - Payload
 * @param {Object} options - BullMQ options (delay, attempts, etc)
 */
const addJob = async (queueName, jobName, data, options = {}) => {
  if (!queues[queueName]) throw new Error(`Queue ${queueName} does not exist`);
  
  const defaultOptions = {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: true,
    removeOnFail: false,
    ...options
  };

  return queues[queueName].add(jobName, data, defaultOptions);
};

module.exports = {
  connection,
  QUEUES,
  queues,
  addJob
};
