import api from './api';

const payrollService = {
  generate: async (month, year) => {
    const response = await api.post(`/api/payroll/generate/${month}/${year}`);
    return response.data;
  },

  getByEmployee: async (employeeId) => {
    const response = await api.get(`/api/payroll/employee/${employeeId}`);
    return response.data;
  },

  getAll: async (month, year) => {
    const response = await api.get(`/api/payroll/all/${month}/${year}`);
    return response.data;
  },

  getPayslip: async (id) => {
    const response = await api.get(`/api/payroll/payslip/${id}`);
    return response.data;
  },

  download: async (id) => {
    const response = await api.get(`/api/payroll/download/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default payrollService;
