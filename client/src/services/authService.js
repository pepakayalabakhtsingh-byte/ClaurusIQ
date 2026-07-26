import api, { clearAuthToken, setAuthToken } from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } finally {
      clearAuthToken();
    }
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.put('/users/password', data);
    return response.data;
  },

  updatePreferences: async (data) => {
    const response = await api.put('/users/preferences', data);
    return response.data;
  },
};
