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
        <div className="rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold leading-tight break-words">🌿 EV Power CRM</h1>
            <p className="text-emerald-100 text-sm">Energy Solutions Management</p>
          </div>
          {user && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 sm:justify-end">
              <div className="text-left sm:text-right min-w-0">
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
