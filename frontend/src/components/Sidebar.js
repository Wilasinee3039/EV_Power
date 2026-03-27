import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100';

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
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
  );
};

export default Sidebar;
