'use client';
import { useState, useEffect } from 'react';

const PendingApprovals = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaveRequests = async () => {
    try {
      const res = await fetch('/api/leave');
      if (!res.ok) {
        throw new Error('Failed to fetch leave requests');
      }
      const data = await res.json();
      setLeaveRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleApproval = async (id, status) => {
    try {
      const res = await fetch(`/api/leave/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error('Failed to update leave request');
      }

      await fetchLeaveRequests();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Pending HR Approvals</h2>
      <ul className="space-y-4">
        {leaveRequests.map((request) => (
          <li key={request._id} className="p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Leave Request</p>
                <p className="text-sm text-gray-600">Applicant: {request.employee.name}</p>
                <p className="text-sm text-gray-600">
                  {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApproval(request._id, 'Approved')}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-lg text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproval(request._id, 'Rejected')}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{request.reason}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingApprovals;