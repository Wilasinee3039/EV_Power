import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100';

  return (
    <>
      <nav className="md:hidden border-b border-gray-200 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
          <Link
            to="/dashboard"
            className={`px-4 py-2 rounded-lg transition font-semibold whitespace-nowrap shrink-0 ${isActive('/dashboard')}`}
          >
            📊 Dashboard
          </Link>
          <Link
            to="/leads"
            className={`px-4 py-2 rounded-lg transition font-semibold whitespace-nowrap shrink-0 ${isActive('/leads')}`}
          >
            📋 Leads
          </Link>
          </div>
        </div>
      </nav>

      <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen">
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className={`block px-4 py-2 rounded transition ${isActive('/dashboard')}`}
              >
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/leads"
                className={`block px-4 py-2 rounded transition ${isActive('/leads')}`}
              >
                📋 Leads
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
