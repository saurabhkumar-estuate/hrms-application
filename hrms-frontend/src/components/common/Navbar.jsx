import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { MdNotifications, MdKeyboardArrowDown, MdPerson, MdLogout } from 'react-icons/md';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800">
          HRMS Portal
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <MdNotifications size={22} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-800">{user?.fullName || user?.email}</p>
              <p className="text-xs text-gray-500">{user?.role?.replace('_', ' ')}</p>
            </div>
            <MdKeyboardArrowDown size={18} className="text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <MdPerson size={18} />
                  My Profile
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <MdLogout size={18} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
