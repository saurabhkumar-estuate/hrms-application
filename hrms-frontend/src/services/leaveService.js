import api from './api';

const leaveService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/leaves', { params });
    return response.data;
  },

  getByEmployee: async (employeeId) => {
    const response = await api.get(`/api/leaves/employee/${employeeId}`);
    return response.data;
  },

  getBalance: async (employeeId) => {
    const response = await api.get(`/api/leaves/balance/${employeeId}`);
    return response.data;
  },

  apply: async (data) => {
    const response = await api.post('/api/leaves/apply', data);
    return response.data;
  },

  approve: async (id) => {
    const response = await api.put(`/api/leaves/${id}/approve`);
    return response.data;
  },

  reject: async (id) => {
    const response = await api.put(`/api/leaves/${id}/reject`);
    return response.data;
  },
};

export default leaveService;
