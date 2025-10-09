import React from 'react';

const ManagerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-8">Manager Dashboard</h1>
      <div className="flex space-x-8">
        {/* Main Content */}
        <main className="w-2/3">
          {/* Pending Approvals Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Pending Approvals</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <ul className="space-y-4">
                <li className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">Time Off Request: John Doe</p>
                    <p className="text-sm text-gray-600">Dates: 2025-11-10 to 2025-11-12</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Approve</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Deny</button>
                  </div>
                </li>
                <li className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">Expense Report: Jane Smith</p>
                    <p className="text-sm text-gray-600">Amount: $150</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Approve</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Deny</button>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* My Team Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">My Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Team Member Card */}
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <img
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  alt="Team Member"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold">John Doe</h3>
                <p className="text-gray-600">Software Engineer</p>
              </div>
              {/* Team Member Card */}
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <img
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704e"
                  alt="Team Member"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold">Jane Smith</h3>
                <p className="text-gray-600">Product Manager</p>
              </div>
              {/* Team Member Card */}
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <img
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704f"
                  alt="Team Member"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold">Peter Jones</h3>
                <p className="text-gray-600">UX Designer</p>
              </div>
              {/* Team Member Card */}
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <img
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704g"
                  alt="Team Member"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold">Mary Johnson</h3>
                <p className="text-gray-600">QA Tester</p>
              </div>
            </div>
          </section>
        </main>

        {/* Right Sidebar */}
        <aside className="w-1/3">
          {/* Team Leave Calendar */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Team Leave Calendar</h3>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="font-bold">{day}</div>
              ))}
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className={`p-2 rounded-full ${[10, 11, 12].includes(i + 1) ? 'bg-blue-500 text-white' : ''}`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Team Goal Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Team Goal Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Project Alpha</span>
                  <span className="text-sm font-medium text-gray-700">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Q4 OKRs</span>
                  <span className="text-sm font-medium text-gray-700">50%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Hiring Targets</span>
                  <span className="text-sm font-medium text-gray-700">90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ManagerDashboard;