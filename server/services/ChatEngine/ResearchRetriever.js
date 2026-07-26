/**
 * ResearchRetriever — Queries all ClaurusIQ session models to pull
 * relevant evidence, citations, reliability, and reports for the chat.
 */
const Workflow = require('../../models/Workflow');
const VerificationSession = require('../../models/VerificationSession');
const CitationSession = require('../../models/CitationSession');
const ReliabilitySession = require('../../models/ReliabilitySession');
const ReportSession = require('../../models/ReportSession');
const DocumentSession = require('../../models/DocumentSession');

class ResearchRetriever {
  /**
   * Retrieves the most recent completed workflow for a user.
   */
  static async getLatestWorkflow(userId) {
    return Workflow.findOne({ user: userId, status: 'completed' }).sort({ createdAt: -1 });
  }

  /**
   * Retrieves all completed workflows for a user.
   */
  static async getAllWorkflows(userId) {
    return Workflow.find({ user: userId, status: 'completed' }).sort({ createdAt: -1 }).limit(20);
  }

  /**
   * Retrieves the full evidence package for a specific workflow.
   */
  static async getFullContext(workflowId) {
    const [verification, citation, reliability, report, documents] = await Promise.all([
      VerificationSession.findOne({ workflowId }).sort({ createdAt: -1 }),
      CitationSession.findOne({ workflowId }).sort({ createdAt: -1 }),
      ReliabilitySession.findOne({ workflowId }).sort({ createdAt: -1 }),
      ReportSession.findOne({ workflowId }).sort({ createdAt: -1 }),
      DocumentSession.find({ workflowId }).sort({ createdAt: -1 })
    ]);

    return { verification, citation, reliability, report, documents };
  }

  /**
   * Searches across workflows by query text.
   */
  static async searchWorkflows(userId, searchTerm) {
    // Escape regex special characters to prevent ReDoS (SEC-001)
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    return Workflow.find({
      user: userId,
      query: { $regex: escapedTerm, $options: 'i' },
    }).sort({ createdAt: -1 }).limit(10);
  }
}

module.exports = ResearchRetriever;
