import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MdDashboard,
  MdPeople,
  MdEventNote,
  MdAccessTime,
  MdPayment,
  MdBarChart,
  MdSettings,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: MdDashboard },
  { path: '/employees', label: 'Employees', icon: MdPeople },
  { path: '/leave', label: 'Leave', icon: MdEventNote },
  { path: '/attendance', label: 'Attendance', icon: MdAccessTime },
  { path: '/payroll', label: 'Payroll', icon: MdPayment },
  { path: '/reports', label: 'Reports', icon: MdBarChart },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div
      className={`flex flex-col h-full bg-slate-800 text-white transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700">
        {!collapsed && (
          <div>
            <span className="text-xl font-bold text-white">HRMS</span>
            <p className="text-xs text-slate-400 mt-0.5">HR Management</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-auto"
        >
          {collapsed ? <MdChevronRight size={20} /> : <MdChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <Icon size={20} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.fullName || user?.email}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
