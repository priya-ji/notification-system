import axios from 'axios';

// Vite exposes client-side variables through import.meta.env, not process.env.
// Leave this as /api by default so Vite's development proxy forwards requests
// to the Django server without a browser CORS dependency.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
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
