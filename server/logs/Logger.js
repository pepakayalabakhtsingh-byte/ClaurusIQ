/**
 * Centralized logging system for workflows and agents.
 * In a real environment, this would integrate with Winston, DataDog, etc.
 */
class Logger {
  static info(context, message, data = {}) {
    this._log('INFO', context, message, data);
  }

  static warn(context, message, data = {}) {
    this._log('WARN', context, message, data);
  }

  static error(context, message, error = null, data = {}) {
    this._log('ERROR', context, message, { ...data, error: error?.message || error, stack: error?.stack });
  }

  static _log(level, context, message, data) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context,
      message,
      data
    };
    
    // In dev mode, print to console
    if (process.env.NODE_ENV !== 'test') {
      const colors = {
        INFO: '\x1b[36m', // Cyan
        WARN: '\x1b[33m', // Yellow
        ERROR: '\x1b[31m' // Red
      };
      const reset = '\x1b[0m';
      console.log(`${colors[level]}[${timestamp}] [${level}] [${context}]${reset} ${message}`);
      if (Object.keys(data).length > 0) {
        console.dir(data, { depth: null, colors: true });
      }
    }
    
    // TODO: Persist log entry to MongoDB or external logging service
  }
}

module.exports = Logger;
