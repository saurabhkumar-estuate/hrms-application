import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import attendanceService from '../../services/attendanceService';
import { formatDate, getStatusBadgeClass } from '../../utils/helpers';
import { MdAccessTime, MdLogin, MdLogout } from 'react-icons/md';

const AttendancePage = () => {
  const { user } = useSelector((s) => s.auth);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [myAttendance, setMyAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const today = await attendanceService.getToday();
      setTodayAttendance(today);

      if (user?.employeeId) {
        const now = new Date();
        const monthly = await attendanceService.getMonthly(
          user.employeeId,
          now.getMonth() + 1,
          now.getFullYear()
        );
        setMyAttendance(monthly);

        // Check if already checked in today
        const todayRecord = today.find(a => a.employee?.id === user.employeeId);
        if (todayRecord?.checkIn) setCheckedIn(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleCheckIn = async () => {
    try {
      await attendanceService.checkIn(user.employeeId);
      toast.success('Checked in successfully!');
      setCheckedIn(true);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceService.checkOut(user.employeeId);
      toast.success('Checked out successfully!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-out failed');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-500 text-sm mt-0.5">Track and manage attendance records</p>
      </div>

      {/* Self Service */}
      {user?.employeeId && (
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Today's Self Service</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCheckIn}
              disabled={checkedIn}
              className="btn-success flex items-center gap-2 disabled:opacity-50"
            >
              <MdLogin size={18} />
              Check In
            </button>
            <button
              onClick={handleCheckOut}
              className="btn-danger flex items-center gap-2"
            >
              <MdLogout size={18} />
              Check Out
            </button>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      )}

      {/* Today's Attendance */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Today's Attendance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Employee</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Check In</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Check Out</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Hours</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : todayAttendance.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-400">No attendance records for today</td></tr>
              ) : (
                todayAttendance.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {a.employee?.firstName} {a.employee?.lastName}
                      <p className="text-xs text-gray-500">{a.employee?.employeeCode}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{a.checkIn || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{a.checkOut || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{a.workingHours ? `${a.workingHours}h` : '-'}</td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadgeClass(a.status)}>{a.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* My Monthly Attendance */}
      {myAttendance.length > 0 && (
        <div className="card p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">My Monthly Attendance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Check In</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Check Out</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Hours</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myAttendance.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{formatDate(a.date)}</td>
                    <td className="py-3 px-4 text-gray-600">{a.checkIn || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{a.checkOut || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{a.workingHours ? `${a.workingHours}h` : '-'}</td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadgeClass(a.status)}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
