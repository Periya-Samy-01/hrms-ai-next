"use client";

import NotificationBell from '../NotificationBell';

const EmployeeDashboardHeader = () => {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Failed to logout', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <header className="mb-8 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>
      <div className="flex items-center space-x-4">
        <NotificationBell />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default EmployeeDashboardHeader;