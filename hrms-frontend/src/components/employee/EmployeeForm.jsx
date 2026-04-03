import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createEmployee, updateEmployee } from '../../store/slices/employeeSlice';
import { MdClose } from 'react-icons/md';

const EmployeeForm = ({ employee, onClose }) => {
  const dispatch = useDispatch();
  const isEditing = !!employee;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: employee ? {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      designation: employee.designation,
      salary: employee.salary,
      joiningDate: employee.joiningDate,
      gender: employee.gender,
      workLocation: employee.workLocation,
      employmentType: employee.employmentType,
      reportingTo: employee.reportingTo,
    } : {}
  });

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await dispatch(updateEmployee({ id: employee.id, data })).unwrap();
        toast.success('Employee updated successfully');
      } else {
        await dispatch(createEmployee(data)).unwrap();
        toast.success('Employee created successfully');
      }
      onClose();
    } catch (err) {
      toast.error(err || 'Failed to save employee');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MdClose size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input className="input-field" {...register('firstName', { required: 'First name is required' })} />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input className="input-field" {...register('lastName', { required: 'Last name is required' })} />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" className="input-field" {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input className="input-field" {...register('phone')} />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <input className="input-field" {...register('department', { required: 'Department is required' })} />
              {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
              <input className="input-field" {...register('designation', { required: 'Designation is required' })} />
              {errors.designation && <p className="text-xs text-red-500 mt-1">{errors.designation.message}</p>}
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary (Monthly)</label>
              <input type="number" className="input-field" {...register('salary')} />
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
              <input type="date" className="input-field" {...register('joiningDate')} />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select className="input-field" {...register('gender')}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Work Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
              <input className="input-field" {...register('workLocation')} />
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
              <select className="input-field" {...register('employmentType')}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>

            {/* Reporting To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reporting To</label>
              <input className="input-field" {...register('reportingTo')} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
