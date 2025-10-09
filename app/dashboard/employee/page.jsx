import React from 'react';

const EmployeeDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, Alex!</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* My Profile Card */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <img
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              alt="Employee"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-bold">Alex Doe</h2>
            <p className="text-gray-600">Senior Software Engineer</p>
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
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="text-blue-500"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="75, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">15</span>
                  </div>
                </div>
                <p className="mt-2 text-gray-600">Annual</p>
              </div>
              <div className="text-center">
                <div className="relative w-24 h-24">
                   <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="text-green-500"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="90, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">9</span>
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
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold">Annual Performance Review Cycle</h3>
                <p className="text-sm text-gray-600">The annual performance review cycle is starting next week. Please complete your self-assessment by October 15th.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold">Open Enrollment for Health Insurance</h3>
                <p className="text-sm text-gray-600">Open enrollment for 2026 health insurance plans is now open. The deadline to enroll is November 20th.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold">Holiday Schedule</h3>
                <p className="text-sm text-gray-600">The office will be closed for Thanksgiving on November 27th and 28th.</p>
              </div>
            </div>
          </div>

          {/* My Performance Goals */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">My Performance Goals</h2>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <span>Launch Project Phoenix</span>
                <span className="text-green-500 font-bold">Completed</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Improve API response time by 15%</span>
                <span className="text-yellow-500 font-bold">In Progress</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Complete Security Training</span>
                <span className="text-gray-500 font-bold">Not Started</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;