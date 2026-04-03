import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { MdPeople, MdEventNote, MdAccessTime, MdPayment, MdTrendingUp } from 'react-icons/md';
import api from '../../services/api';
import { formatCurrency } from '../../utils/helpers';

const COLORS = ['#2563EB', '#16A34A', '#D97706', '#DC2626', '#7C3AED'];

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingLeaves: 0,
    todayAttendance: 0,
  });
  const [deptData, setDeptData] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [headcount, leaveSummary, todayAttendance, leaves] = await Promise.all([
          api.get('/api/reports/headcount'),
          api.get('/api/reports/leave-summary'),
          api.get('/api/attendance/today'),
          api.get('/api/leaves', { params: { status: 'PENDING' } }),
        ]);

        setStats({
          totalEmployees: headcount.data.total || 0,
          activeEmployees: headcount.data.active || 0,
          pendingLeaves: leaveSummary.data.pending || 0,
          todayAttendance: todayAttendance.data.length || 0,
        });

        const deptObj = headcount.data.byDepartment || {};
        setDeptData(
          Object.entries(deptObj).map(([name, value]) => ({ name, value }))
        );

        setRecentLeaves((leaves.data || []).slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const attendanceChartData = [
    { name: 'Mon', present: 18, absent: 2, late: 3 },
    { name: 'Tue', present: 20, absent: 1, late: 2 },
    { name: 'Wed', present: 17, absent: 3, late: 4 },
    { name: 'Thu', present: 21, absent: 1, late: 1 },
    { name: 'Fri', present: 19, absent: 2, late: 2 },
  ];

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: MdPeople,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+2 this month',
    },
    {
      title: 'Active Employees',
      value: stats.activeEmployees,
      icon: MdTrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: 'Currently active',
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: MdEventNote,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      change: 'Awaiting approval',
    },
    {
      title: "Today's Attendance",
      value: stats.todayAttendance,
      icon: MdAccessTime,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: 'Checked in today',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, {user?.fullName || user?.email}! Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.title} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                <p className={`text-xs mt-1 ${card.textColor}`}>{card.change}</p>
              </div>
              <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                <card.icon size={24} className={card.textColor} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Attendance Bar Chart */}
        <div className="card lg:col-span-2">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Weekly Attendance Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#16A34A" radius={[4, 4, 0, 0]} name="Present" />
              <Bar dataKey="late" fill="#D97706" radius={[4, 4, 0, 0]} name="Late" />
              <Bar dataKey="absent" fill="#DC2626" radius={[4, 4, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Pie Chart */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Department Distribution</h3>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              No department data
            </div>
          )}
        </div>
      </div>

      {/* Recent Leave Requests */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">Recent Leave Requests</h3>
          <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
            View all
          </span>
        </div>
        {recentLeaves.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeaves.map((leave) => (
                  <tr key={leave.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-medium text-gray-800">
                      {leave.employee?.firstName} {leave.employee?.lastName}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">{leave.leaveType}</td>
                    <td className="py-2.5 px-3 text-gray-600">{leave.numberOfDays} day(s)</td>
                    <td className="py-2.5 px-3">
                      <span className="badge-yellow">{leave.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 text-sm">
            No pending leave requests
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
