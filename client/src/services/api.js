import axios from 'axios';

// Determine the API base URL
const getAPIBaseURL = () => {
  // For development/local
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api/v1';
  }

  // For production - use the environment variable or fallback to Render
  const envURL = import.meta.env.VITE_API_BASE_URL;
  if (envURL && envURL.trim()) {
    return envURL;
  }

  // Fallback to Render production URL
  return 'https://claurusiq.onrender.com/api/v1';
};

const api = axios.create({
  baseURL: getAPIBaseURL(),
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
