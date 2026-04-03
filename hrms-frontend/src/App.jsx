import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/common/Layout';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import EmployeePage from './pages/employees/EmployeePage';
import LeavePage from './pages/leave/LeavePage';
import AttendancePage from './pages/attendance/AttendancePage';
import PayrollPage from './pages/payroll/PayrollPage';
import ReportsPage from './pages/reports/ReportsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<EmployeePage />} />
          <Route path="leave" element={<LeavePage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="payroll" element={<PayrollPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
