"use client";
import React, { useState, useEffect } from 'react';

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard/employee');
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  const { user, announcements } = data;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user.name}!</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* My Profile Card */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <img
              src={user.photoUrl}
              alt="Employee"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.jobTitle}</p>
          </div>

          {/* Leave Balance Widget */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Leave Balance</h2>
            <div className="flex justify-around">
              <div className="text-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="text-blue-500"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${(user.leaveBalances.annual / 20) * 100}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{user.leaveBalances.annual}</span>
                  </div>
                </div>
                <p className="mt-2 text-gray-600">Annual</p>
              </div>
              <div className="text-center">
                <div className="relative w-24 h-24">
                   <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="text-green-500"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${(user.leaveBalances.sick / 10) * 100}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{user.leaveBalances.sick}</span>
                  </div>
                </div>
                <p className="mt-2 text-gray-600">Sick</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button className="w-full bg-blue-500 text-white font-bold py-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors">
              Request Leave
            </button>
            <button className="w-full bg-green-500 text-white font-bold py-4 rounded-lg shadow-md hover:bg-green-600 transition-colors">
              View Payslips
            </button>
            <button className="w-full bg-yellow-500 text-white font-bold py-4 rounded-lg shadow-md hover:bg-yellow-600 transition-colors">
              Submit Feedback
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Company Announcements */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Company Announcements</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {announcements.map((announcement) => (
                <div key={announcement._id} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold">{announcement.title}</h3>
                  <p className="text-sm text-gray-600">{announcement.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* My Performance Goals */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">My Performance Goals</h2>
            <ul className="space-y-4">
              {user.performanceGoals.map((goal, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{goal.goal}</span>
                  <span className={`${
                    goal.status === "Completed" ? "text-green-500" :
                    goal.status === "In Progress" ? "text-yellow-500" :
                    "text-gray-500"
                  } font-bold`}>{goal.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;