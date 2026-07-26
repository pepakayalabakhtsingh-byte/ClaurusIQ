const AgentOutput = require('../types/AgentOutput');
const Logger = require('../logs/Logger');

class BaseAgent {
  constructor(name) {
    if (this.constructor === BaseAgent) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.name = name;
  }

  async initialize(input) {
    this.logExecution('initialize', 'Initializing agent with input');
    this.validateInput(input);
  }

  validateInput(input) {
    if (!input || !input.workflowId) {
      throw new Error(`[${this.name}] Invalid input: missing workflowId`);
    }
    // Subclasses can override for specific validation
  }

  /**
   * The main logic of the agent. Must be implemented by subclasses.
   * @param {AgentInput} input 
   * @returns {Promise<any>} The payload data
   */
  async execute(input) {
    throw new Error("Method 'execute()' must be implemented.");
  }

  validateOutput(outputData) {
    if (!outputData) {
      throw new Error(`[${this.name}] Output validation failed: Empty output`);
    }
    // Subclasses can override
  }

  logExecution(step, message, data = {}) {
    Logger.info(this.name, `[${step}] ${message}`, data);
  }

  handleError(error) {
    Logger.error(this.name, 'Execution failed', error);
    return error;
  }

  async cleanup() {
    this.logExecution('cleanup', 'Cleaning up agent resources');
  }

  /**
   * Orchestrates the agent lifecycle
   */
  async run(input) {
    const startTime = Date.now();
    let status = 'success';
    let data = null;
    let errorMsg = null;

    try {
      await this.initialize(input);
      data = await this.execute(input);
      this.validateOutput(data);
    } catch (error) {
      status = 'failure';
      errorMsg = this.handleError(error).message;
    } finally {
      await this.cleanup();
    }

    const executionTimeMs = Date.now() - startTime;

    return new AgentOutput({
      agentName: this.name,
      status,
      executionTimeMs,
      data: data || {},
      logs: [`Agent ${this.name} finished with status: ${status}`],
      error: errorMsg
    });
  }
}

module.exports = BaseAgent;
