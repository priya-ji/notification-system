import axios from 'axios';

// Vite exposes client-side variables through import.meta.env, not process.env.
// In development, use the Vite proxy. In a deployed build, the API must point
// at the separately deployed Django service (for example, Render).
const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
const API_BASE_URL = configuredApiUrl || (import.meta.env.DEV ? '/api' : '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getApiErrorMessage = (error) => {
  if (!API_BASE_URL) {
    return 'API is not configured. Set VITE_API_URL to your deployed backend URL, including /api.';
  }

  const data = error.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (typeof data?.error === 'string') return data.error;
  if (typeof data?.detail === 'string') return data.detail;

  if (data && typeof data === 'object') {
    const messages = Object.entries(data)
      .flatMap(([field, value]) => {
        const text = Array.isArray(value) ? value.join(' ') : String(value);
        return field === 'non_field_errors' ? [text] : [`${field}: ${text}`];
      })
      .filter(Boolean);
    if (messages.length) return messages.join(' ');
  }

  if (error.response?.status === 404) {
    return 'API endpoint was not found. Check that VITE_API_URL points to the Django backend, including /api.';
  }

  return error.message || 'Request failed. Please try again.';
};

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (!API_BASE_URL) {
    return Promise.reject(new Error('API is not configured'));
  }

  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const triggerAPI = {
  getAll: () => api.get('/triggers/'),
  getOne: (id) => api.get(`/triggers/${id}/`),
  create: (data) => api.post('/triggers/', data),
  update: (id, data) => api.patch(`/triggers/${id}/`, data),
};

export const templateAPI = {
  getAll: () => api.get('/templates/'),
  getOne: (id) => api.get(`/templates/${id}/`),
  create: (data) => api.post('/templates/', data),
  update: (id, data) => api.patch(`/templates/${id}/`, data),
  testSend: (id, recipientInfo) => 
    api.post(`/templates/${id}/test_send/`, { recipient_info: recipientInfo }),
  toggle: (id) => api.post(`/templates/${id}/toggle/`),
};

export const logAPI = {
  getAll: () => api.get('/logs/'),
  getByTemplate: (templateId) => api.get(`/logs/?template_id=${templateId}`),
};

export const userAPI = {
  register: (username, password, email = '') =>
    api.post('/users/register/', { username, password, email }),
  login: (username, password, phoneNumber = '', email = '') =>
    api.post('/users/login/', {
      username,
      password,
      phone_number: phoneNumber,
      email,
    }),
  logout: (userId, phoneNumber = '', email = '') =>
    api.post('/users/logout/', {
      user_id: userId,
      phone_number: phoneNumber,
      email,
    }),
  getCurrentUser: () => api.get('/users/current_user/'),
};

export const adminAPI = {
  getTriggersTable: () => api.get('/admin/triggers_table/'),
};

export default api;
