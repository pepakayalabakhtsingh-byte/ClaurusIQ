const Logger = require('../logs/Logger');

class GlobalErrorManager {
  static handleAgentError(agentName, error, workflowId) {
    Logger.error(`GlobalErrorManager:${agentName}`, `Error executing agent in workflow ${workflowId}`, error);
    
    // Determine error type and return structured failure
    return {
      success: false,
      errorType: this._classifyError(error),
      message: error.message || 'An unknown error occurred',
      isRecoverable: this._isRecoverable(error)
    };
  }

  static _classifyError(error) {
    if (error.name === 'ValidationError') return 'VALIDATION_ERROR';
    if (error.name === 'TimeoutError') return 'TIMEOUT_ERROR';
    if (error.name === 'ApiError') return 'API_ERROR';
    return 'INTERNAL_ERROR';
  }

  static _isRecoverable(error) {
    // Timeout or temporary API failures are recoverable via retries
    const type = this._classifyError(error);
    return ['TIMEOUT_ERROR', 'API_ERROR'].includes(type);
  }
}

module.exports = GlobalErrorManager;
