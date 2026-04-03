import api from './api';

const attendanceService = {
  checkIn: async (employeeId) => {
    const response = await api.post('/api/attendance/checkin', { employeeId });
    return response.data;
  },

  checkOut: async (employeeId) => {
    const response = await api.post('/api/attendance/checkout', { employeeId });
    return response.data;
  },

  getByEmployee: async (employeeId) => {
    const response = await api.get(`/api/attendance/employee/${employeeId}`);
    return response.data;
  },

  getToday: async () => {
    const response = await api.get('/api/attendance/today');
    return response.data;
  },

  getMonthly: async (employeeId, month, year) => {
    const response = await api.get(`/api/attendance/monthly/${employeeId}`, {
      params: { month, year }
    });
    return response.data;
  },
};

export default attendanceService;
