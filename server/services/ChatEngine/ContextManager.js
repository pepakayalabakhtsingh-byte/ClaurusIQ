/**
 * ContextManager — Maintains sliding-window conversation context
 * across unlimited follow-up messages.
 */
class ContextManager {
  constructor() {
    // In-memory cache keyed by conversationId
    this.contexts = new Map();
  }

  /**
   * Gets or creates the context for a conversation.
   */
  getContext(conversationId) {
    if (!this.contexts.has(conversationId)) {
      this.contexts.set(conversationId, {
        activeTopic: null,
        activeWorkflowId: null,
        referencedClaims: [],
        referencedSources: [],
        referencedReports: [],
        conversationGoals: [],
        messageCount: 0,
        style: 'executive', // default conversation style
      });
    }
    return this.contexts.get(conversationId);
  }

  /**
   * Updates context after processing a message.
   */
  updateContext(conversationId, updates) {
    const ctx = this.getContext(conversationId);
    Object.assign(ctx, updates);
    ctx.messageCount++;
    this.contexts.set(conversationId, ctx);
    return ctx;
  }

  /**
   * Sets the conversation style.
   */
  setStyle(conversationId, style) {
    const validStyles = ['executive', 'academic', 'technical', 'simple'];
    const ctx = this.getContext(conversationId);
    ctx.style = validStyles.includes(style) ? style : 'executive';
    return ctx;
  }

  /**
   * Clears context for a conversation.
   */
  clearContext(conversationId) {
    this.contexts.delete(conversationId);
  }
}

// Singleton
module.exports = new ContextManager();
