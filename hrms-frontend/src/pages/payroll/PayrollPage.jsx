import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import payrollService from '../../services/payrollService';
import { formatCurrency, getStatusBadgeClass, getMonthName, isAdminOrHR } from '../../utils/helpers';
import { MdFileDownload, MdPlayArrow, MdReceipt } from 'react-icons/md';

const PayrollPage = () => {
  const { user } = useSelector((s) => s.auth);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [payrolls, setPayrolls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchPayrolls = async () => {
    setIsLoading(true);
    try {
      const data = await payrollService.getAll(month, year);
      setPayrolls(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPayrolls(); }, [month, year]);

  const handleGenerate = async () => {
    if (!window.confirm(`Generate payroll for ${getMonthName(month)} ${year}?`)) return;
    setIsGenerating(true);
    try {
      await payrollService.generate(month, year);
      toast.success('Payroll generated successfully!');
      fetchPayrolls();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate payroll');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (payroll) => {
    try {
      const blob = await payrollService.download(payroll.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip_${payroll.employee?.employeeCode}_${payroll.month}_${payroll.year}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Payslip downloaded!');
    } catch (err) {
      toast.error('Failed to download payslip');
    }
  };

  const totalGross = payrolls.reduce((sum, p) => sum + (p.grossSalary || 0), 0);
  const totalNet = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
  const totalDeductions = payrolls.reduce((sum, p) => sum + (p.totalDeductions || 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage employee salary and payslips</p>
        </div>
        {isAdminOrHR(user) && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary flex items-center gap-2 self-start"
          >
            <MdPlayArrow size={20} />
            {isGenerating ? 'Generating...' : 'Run Payroll'}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex gap-3">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="input-field w-40">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="input-field w-28">
            {[2022, 2023, 2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      {payrolls.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card bg-blue-50 border-blue-100">
            <p className="text-sm text-blue-600 font-medium">Total Gross</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(totalGross)}</p>
          </div>
          <div className="card bg-red-50 border-red-100">
            <p className="text-sm text-red-600 font-medium">Total Deductions</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{formatCurrency(totalDeductions)}</p>
          </div>
          <div className="card bg-green-50 border-green-100">
            <p className="text-sm text-green-600 font-medium">Total Net Salary</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(totalNet)}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Employee</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Gross</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Deductions</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Net Salary</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : payrolls.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-400">
                    <MdReceipt size={48} className="mx-auto mb-2 opacity-30" />
                    No payroll data for {getMonthName(month)} {year}
                    {isAdminOrHR(user) && (
                      <p className="text-xs mt-1">Click "Run Payroll" to generate</p>
                    )}
                  </td>
                </tr>
              ) : (
                payrolls.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800">
                        {p.employee?.firstName} {p.employee?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{p.employee?.employeeCode} · {p.employee?.department}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{formatCurrency(p.grossSalary)}</td>
                    <td className="py-3 px-4 text-red-600">{formatCurrency(p.totalDeductions)}</td>
                    <td className="py-3 px-4 text-green-700 font-bold">{formatCurrency(p.netSalary)}</td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadgeClass(p.status)}>{p.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDownload(p)}
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        <MdFileDownload size={16} />
                        Payslip
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;
