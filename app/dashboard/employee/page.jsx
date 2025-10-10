"use client";
import React, { useState, useEffect } from 'react';
import AddGoalModal from '../../components/dashboard/employee/AddGoalModal';

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
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

  const fetchGoals = async (userId) => {
    if (userId) {
      try {
        const res = await fetch(`/api/goals?employeeId=${userId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch goals');
        }
        const result = await res.json();
        setGoals(result);
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (data?.user?._id) {
      fetchGoals(data.user._id);
    }
  }, [data]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Failed to logout', error);
      alert('Logout failed. Please try again.');
    }
  };

  const handleAddGoal = async (newGoal) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newGoal, employeeId: data.user._id, managerId: data.user.manager }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add goal');
      }

      await fetchGoals(data.user._id); // Refetch goals to show the new one
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  const { user, announcements } = data;

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
        <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Performance Goals</h2>
              <div className="relative group">
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={!user.manager}
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add New Goal
                </button>
                {!user.manager && (
                  <span className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-black text-white text-xs rounded py-1 px-2">
                    You must have a manager assigned to add a goal.
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal._id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">{goal.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        goal.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : goal.status === "Active"
                          ? "bg-blue-100 text-blue-800"
                          : goal.status === "Pending Approval"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {goal.status}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddGoal={handleAddGoal}
      />
    </>
  );
};

export default EmployeeDashboard;