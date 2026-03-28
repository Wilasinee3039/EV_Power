import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="min-w-0 w-full sm:w-auto self-start translate-y-6 sm:translate-y-0 text-left">
            <h1 className="text-xl sm:text-2xl font-bold leading-tight break-words">🌿 EV Power CRM</h1>
            <p className="text-emerald-100 text-sm">Energy Solutions Management</p>
          </div>
          {user && (
            <div className="w-full sm:w-auto flex flex-wrap items-center justify-end gap-2 sm:gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm">{user.fullName || user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-700 hover:bg-red-800 px-3 sm:px-4 py-2 rounded transition font-semibold whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
