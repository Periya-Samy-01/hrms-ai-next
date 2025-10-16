"use client";

import NotificationBell from '../NotificationBell';

const ManagerDashboardHeader = () => {
  return (
    <header className="mb-8 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800">Manager Dashboard</h1>
      <div className="flex items-center space-x-4">
        <NotificationBell />
      </div>
    </header>
  );
};

export default ManagerDashboardHeader;