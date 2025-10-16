"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ManagerDashboard = () => {
  const [data, setData] = useState({ pendingApprovals: [], teamMembers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard/manager');
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprovalAction = async (id, status) => {
    try {
      const res = await fetch(`/api/approvals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error('Failed to update request');
      }

      // Refresh data to show updated list
      fetchData();
    } catch (err) {
      console.error("Failed to process approval:", err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  const { pendingApprovals, teamMembers } = data;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <div className="flex space-x-8">
        {/* Main Content */}
        <main className="w-2/3">
          {/* Pending Approvals Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Pending Approvals</h2>
            <div className="bg-white rounded-lg shadow p-6">
              {pendingApprovals?.length > 0 ? (
                <ul className="space-y-4">
                  {pendingApprovals.map((request) => (
                    <li key={request._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{request.type} Request: {request.requester?.name || 'Unknown User'}</p>
                        {request.type === 'Leave' && <p className="text-sm text-gray-600">Dates: {request.details?.startDate ? new Date(request.details.startDate).toLocaleDateString() : 'N/A'} to {request.details?.endDate ? new Date(request.details.endDate).toLocaleDateString() : 'N/A'}</p>}
                        {request.type === 'Expense' && <p className="text-sm text-gray-600">Amount: ${request.details?.amount || 'N/A'}</p>}
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleApprovalAction(request._id, 'Approved')} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Approve</button>
                        <button onClick={() => handleApprovalAction(request._id, 'Denied')} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Deny</button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pending approvals.</p>
              )}
            </div>
          </section>

          {/* My Team Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">My Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {teamMembers?.map((member) => (
                <Link href={`/dashboard/team/${member._id}`} key={member._id}>
                  <div
                    className="bg-white rounded-lg shadow p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={member.profile?.photoUrl || 'https://i.pravatar.cc/150'}
                      alt="Team Member"
                      className="w-24 h-24 rounded-full mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold">{member.name || 'Unknown User'}</h3>
                    <p className="text-gray-600">{member.profile?.jobTitle || 'No title'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        {/* Right Sidebar (Static as per current scope) */}
        <aside className="w-1/3">
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Team Leave Calendar</h3>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (<div key={`${day}-${index}`} className="font-bold">{day}</div>))}
              {Array.from({ length: 30 }, (_, i) => (<div key={i} className={`p-2 rounded-full`}>{i + 1}</div>))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Team Goal Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1"><span className="text-sm font-medium text-gray-700">Project Alpha</span><span className="text-sm font-medium text-gray-700">75%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between mb-1"><span className="text-sm font-medium text-gray-700">Q4 OKRs</span><span className="text-sm font-medium text-gray-700">50%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: '50%' }}></div></div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ManagerDashboard;