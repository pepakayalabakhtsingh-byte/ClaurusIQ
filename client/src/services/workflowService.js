import api from './api';

export const workflowService = {
  /**
   * Start a new workflow
   * @param {string} query 
   */
  startWorkflow: async (query) => {
    const response = await api.post('/workflow', { query });
    return response.data;
  },

  /**
   * Get all workflows for the current user
   */
  getWorkflows: async () => {
    const response = await api.get('/workflow');
    return response.data;
  },

  /**
   * Get a specific workflow
   * @param {string} id 
   */
  getWorkflow: async (id) => {
    const response = await api.get(`/workflow/${id}`);
    return response.data;
  },

  /**
   * Perform an action on a workflow
   * @param {string} id 
   * @param {string} action 'pause', 'resume', 'cancel'
   */
  performAction: async (id, action) => {
    const response = await api.post(`/workflow/${id}/action`, { action });
    return response.data;
  },

  /**
   * Initialize a Server-Sent Events (SSE) connection to listen for updates
   * @param {string} id 
   * @param {function} onMessage callback for generic messages
   * @param {function} onError callback for connection errors
   */
  subscribeToWorkflow: (id, onMessage, onError) => {
    const eventSource = new EventSource(`/api/v1/workflow/${id}/stream`, {
      withCredentials: true
    });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) onMessage(data);
      } catch (err) {
        console.error('Failed to parse SSE message', err);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      if (onError) onError(error);
      eventSource.close();
    };

    return eventSource; // Returns the instance so caller can close it when unmounting
  },

  /**
   * Generates a new explanation for a workflow at a specific depth
   * @param {string} id 
   * @param {string} depth 'Quick', 'Detailed', 'Research'
   */
  generateExplanation: async (id, depth) => {
    const response = await api.post(`/workflow/${id}/explain`, { depth });
    return response.data;
  }
};
