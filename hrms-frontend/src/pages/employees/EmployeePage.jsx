import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchEmployees, deleteEmployee } from '../../store/slices/employeeSlice';
import EmployeeForm from '../../components/employee/EmployeeForm';
import { formatDate, getStatusBadgeClass, isAdminOrHR } from '../../utils/helpers';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdPerson } from 'react-icons/md';
import employeeService from '../../services/employeeService';

const EmployeePage = () => {
  const dispatch = useDispatch();
  const { data: employees, totalPages, currentPage, isLoading } = useSelector((s) => s.employees);
  const { user } = useSelector((s) => s.auth);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    employeeService.getDepartments().then(setDepartments).catch(() => {});
  }, []);

  useEffect(() => {
    dispatch(fetchEmployees({ search, department, page, size: 10 }));
  }, [dispatch, search, department, page]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this employee?')) {
      try {
        await dispatch(deleteEmployee(id)).unwrap();
        toast.success('Employee deactivated successfully');
        dispatch(fetchEmployees({ search, department, page, size: 10 }));
      } catch (err) {
        toast.error(err);
      }
    }
  };

  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedEmployee(null);
    dispatch(fetchEmployees({ search, department, page, size: 10 }));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your organization's workforce</p>
        </div>
        {isAdminOrHR(user) && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
            <MdAdd size={20} />
            Add Employee
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
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
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Department</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Designation</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Joining Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                {isAdminOrHR(user) && (
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-400">
                    <MdPerson size={48} className="mx-auto mb-2 opacity-30" />
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                          {emp.firstName?.[0]}{emp.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-gray-500">{emp.employeeCode} · {emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{emp.department}</td>
                    <td className="py-3 px-4 text-gray-600">{emp.designation}</td>
                    <td className="py-3 px-4 text-gray-500">{formatDate(emp.joiningDate)}</td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadgeClass(emp.status)}>{emp.status}</span>
                    </td>
                    {isAdminOrHR(user) && (
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(emp)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <MdEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <MdDelete size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Employee Form Modal */}
      {showForm && (
        <EmployeeForm
          employee={selectedEmployee}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default EmployeePage;
