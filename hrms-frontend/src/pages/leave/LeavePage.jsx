import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchLeaves, approveLeave, rejectLeave } from '../../store/slices/leaveSlice';
import { formatDate, getStatusBadgeClass, isAdminOrHR } from '../../utils/helpers';
import { MdAdd, MdCheck, MdClose, MdFilterList } from 'react-icons/md';
import LeaveForm from '../../components/leave/LeaveForm';
import api from '../../services/api';

const LeavePage = () => {
  const dispatch = useDispatch();
  const { data: leaves, isLoading } = useSelector((s) => s.leaves);
  const { user } = useSelector((s) => s.auth);
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    const params = statusFilter ? { status: statusFilter } : {};
    dispatch(fetchLeaves(params));
  }, [dispatch, statusFilter]);

  useEffect(() => {
    if (user?.employeeId) {
      api.get(`/api/leaves/balance/${user.employeeId}`)
        .then(r => setBalances(r.data))
        .catch(() => {});
    }
  }, [user]);

  const handleApprove = async (id) => {
    try {
      await dispatch(approveLeave(id)).unwrap();
      toast.success('Leave approved');
    } catch (err) {
      toast.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await dispatch(rejectLeave(id)).unwrap();
      toast.success('Leave rejected');
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage leave requests and approvals</p>
        </div>
        {user?.employeeId && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 self-start">
            <MdAdd size={20} /> Apply Leave
          </button>
        )}
      </div>

      {/* Leave Balance */}
      {balances.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {balances.map((b) => (
            <div key={b.id} className="card p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{b.leaveType}</p>
              <p className="text-2xl font-bold text-blue-600">{b.remainingLeaves}</p>
              <p className="text-xs text-gray-400">of {b.totalLeaves} days</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <MdFilterList className="text-gray-400" size={20} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-48"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Employee</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">From</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">To</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Days</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Reason</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                {isAdminOrHR(user) && (
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="8" className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-10 text-gray-400">No leave requests found</td></tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {leave.employee?.firstName} {leave.employee?.lastName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge-blue">{leave.leaveType}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(leave.fromDate)}</td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(leave.toDate)}</td>
                    <td className="py-3 px-4 text-gray-600 text-center">{leave.numberOfDays}</td>
                    <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{leave.reason}</td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadgeClass(leave.status)}>{leave.status}</span>
                    </td>
                    {isAdminOrHR(user) && (
                      <td className="py-3 px-4">
                        {leave.status === 'PENDING' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(leave.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <MdCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(leave.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <MdClose size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <LeaveForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default LeavePage;
