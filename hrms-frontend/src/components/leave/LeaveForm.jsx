import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { applyLeave } from '../../store/slices/leaveSlice';
import { MdClose } from 'react-icons/md';

const LeaveForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const fromDate = watch('fromDate');

  const onSubmit = async (data) => {
    if (!user?.employeeId) {
      toast.error('Employee ID not found. Please contact HR.');
      return;
    }
    try {
      await dispatch(applyLeave({ ...data, employeeId: user.employeeId })).unwrap();
      toast.success('Leave applied successfully');
      onClose();
    } catch (err) {
      toast.error(err || 'Failed to apply leave');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Apply for Leave</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <MdClose size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type *</label>
            <select className="input-field" {...register('leaveType', { required: 'Leave type is required' })}>
              <option value="">Select Type</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="ANNUAL">Annual Leave</option>
              <option value="MATERNITY">Maternity Leave</option>
              <option value="PATERNITY">Paternity Leave</option>
            </select>
            {errors.leaveType && <p className="text-xs text-red-500 mt-1">{errors.leaveType.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date *</label>
              <input type="date" className="input-field" {...register('fromDate', { required: 'From date required' })} />
              {errors.fromDate && <p className="text-xs text-red-500 mt-1">{errors.fromDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date *</label>
              <input type="date" min={fromDate} className="input-field" {...register('toDate', { required: 'To date required' })} />
              {errors.toDate && <p className="text-xs text-red-500 mt-1">{errors.toDate.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
            <textarea
              rows={3}
              className="input-field resize-none"
              placeholder="Please provide a reason for your leave..."
              {...register('reason', { required: 'Reason is required' })}
            />
            {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {isSubmitting ? 'Submitting...' : 'Apply Leave'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveForm;
