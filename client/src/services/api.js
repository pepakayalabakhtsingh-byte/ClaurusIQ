import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error || error.message || 'Something went wrong';

    // If 401, could trigger logout
    if (error.response?.status === 401) {
      // Let the auth context handle this
    }

    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;
