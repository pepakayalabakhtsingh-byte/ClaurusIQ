const User = require('../models/User');
const Workflow = require('../models/Workflow');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const config = require('../config/config');
const os = require('os');

exports.getSystemHealth = async (req, res, next) => {
  try {
    const memoryUsage = process.memoryUsage();
    
    res.status(200).json({
      success: true,
      data: {
        status: 'Operational',
        uptime: process.uptime(),
        environment: config.env,
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
        },
        cpu: os.cpus()[0].model,
        platform: os.platform()
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalWorkflows, totalLogs] = await Promise.all([
      User.countDocuments(),
      Workflow.countDocuments(),
      AuditLog.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: totalUsers,
        workflows: totalWorkflows,
        logs: totalLogs
      }
    });
  } catch (error) {
    next(error);
  }
};
