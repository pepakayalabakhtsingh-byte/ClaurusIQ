import axios from 'axios';

const AUTH_TOKEN_STORAGE_KEY = 'claurusiq_auth_token';

// Determine the API base URL
export const getAPIBaseURL = () => {
  // For development/local
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api/v1';
  }

  // For production - use the environment variable or fallback to Render
  const envURL = import.meta.env.VITE_API_BASE_URL;
  if (envURL && envURL.trim()) {
    const normalized = envURL.trim().replace(/\/$/, '');
    return normalized.endsWith('/api/v1') ? normalized : `${normalized}/api/v1`;
  }

  // Fallback to Render production URL
  return 'https://claurusiq.onrender.com/api/v1';
};

export const getAuthToken = () => {
  try {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token) => {
  if (!token) return;
  try {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } catch {
    // no-op in non-browser environments
  }
};

export const clearAuthToken = () => {
  try {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    // no-op in non-browser environments
  }
};

export const buildAPIUrl = (path = '') => `${getAPIBaseURL()}${path.startsWith('/') ? path : `/${path}`}`;

const api = axios.create({
  baseURL: getAPIBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status;
    normalizedError.code = error.response?.data?.code;
    normalizedError.response = error.response;
    normalizedError.raw = error;

    // If 401, could trigger logout
    if (error.response?.status === 401) {
      // Let the auth context handle this
    }

    return Promise.reject(normalizedError);
  }
);

export default api;