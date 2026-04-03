import api from './api';

const employeeService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/employees', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/employees/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/employees', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/employees/${id}`, data);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/api/employees/${id}`);
    return response.data;
  },

  getDepartments: async () => {
    const response = await api.get('/api/employees/departments');
    return response.data;
  },
};

export default employeeService;
