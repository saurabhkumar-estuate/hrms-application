import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import api from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import { MdPeople, MdEventNote, MdPayment, MdAccessTime } from 'react-icons/md';

const COLORS = ['#2563EB', '#16A34A', '#D97706', '#DC2626', '#7C3AED'];

const ReportsPage = () => {
  const [headcount, setHeadcount] = useState({});
  const [leaveSummary, setLeaveSummary] = useState({});
  const [payrollSummary, setPayrollSummary] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [hc, ls, ps] = await Promise.all([
          api.get('/api/reports/headcount'),
          api.get('/api/reports/leave-summary'),
          api.get('/api/reports/payroll-summary'),
        ]);
        setHeadcount(hc.data);
        setLeaveSummary(ls.data);
        setPayrollSummary(ps.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const deptData = Object.entries(headcount.byDepartment || {}).map(([name, value]) => ({ name, value }));

  const leaveChartData = [
    { name: 'Pending', value: leaveSummary.pending || 0, fill: '#D97706' },
    { name: 'Approved', value: leaveSummary.approved || 0, fill: '#16A34A' },
    { name: 'Rejected', value: leaveSummary.rejected || 0, fill: '#DC2626' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Insights and statistics about your organization</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <MdPeople size={24} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{headcount.total || 0}</p>
          <p className="text-sm text-gray-500">Total Headcount</p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <MdPeople size={24} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{headcount.active || 0}</p>
          <p className="text-sm text-gray-500">Active Employees</p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <MdEventNote size={24} className="text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{leaveSummary.total || 0}</p>
          <p className="text-sm text-gray-500">Total Leave Requests</p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <MdPayment size={24} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{payrollSummary.totalProcessed || 0}</p>
          <p className="text-sm text-gray-500">Payrolls Processed</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Department Distribution */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Department Distribution</h3>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" name="Employees" radius={[4, 4, 0, 0]}>
                  {deptData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              No department data available
            </div>
          )}
        </div>

        {/* Leave Summary */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Leave Request Summary</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leaveChartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {leaveChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leave Stats Table */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Leave Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <p className="text-3xl font-bold text-yellow-600">{leaveSummary.pending || 0}</p>
            <p className="text-sm text-yellow-700 mt-1">Pending</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-3xl font-bold text-green-600">{leaveSummary.approved || 0}</p>
            <p className="text-sm text-green-700 mt-1">Approved</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <p className="text-3xl font-bold text-red-600">{leaveSummary.rejected || 0}</p>
            <p className="text-sm text-red-700 mt-1">Rejected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
