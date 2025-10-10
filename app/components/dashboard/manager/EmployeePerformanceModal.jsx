"use client";
import React, { useState, useEffect } from 'react';

const EmployeePerformanceModal = ({ employee, onClose, onAction }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = async () => {
    if (!employee?._id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/team/${employee._id}/goals`);
      if (!res.ok) {
        throw new Error('Failed to fetch performance goals');
      }
      const data = await res.json();
      setGoals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [employee]);

  const handleAction = async (goalId, status) => {
    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error('Failed to update goal status');
      }

      // Refresh goals to show the updated status
      fetchGoals();
      if(onAction) onAction();

    } catch (err) {
      console.error("Failed to process goal action:", err);
      alert(`Error: ${err.message}`);
    }
  };

  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-2xl font-bold">Performance Goals for {employee.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>

        {loading && <p>Loading goals...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <div key={goal._id} className="p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-bold text-lg">{goal.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                  <p className="text-sm"><strong>Status:</strong> <span className={`font-semibold ${
                      goal.status === 'Active' ? 'text-green-600' :
                      goal.status === 'Needs Revision' ? 'text-yellow-600' :
                      goal.status === 'Completed' ? 'text-blue-600' :
                      'text-gray-500'
                    }`}>{goal.status}</span></p>

                  {goal.status === 'Pending Approval' && (
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleAction(goal._id, 'Active')}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(goal._id, 'Needs Revision')}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                      >
                        Request Revision
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No performance goals found for this employee.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePerformanceModal;