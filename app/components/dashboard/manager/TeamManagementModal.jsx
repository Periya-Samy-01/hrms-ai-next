"use client";
import React, { useState, useEffect } from 'react';

const TeamManagementModal = ({ onClose, teamMembers, onTeamUpdate }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        const res = await fetch('/api/manager/team-members');
        if (!res.ok) {
          throw new Error('Failed to fetch available users');
        }
        const data = await res.json();
        setAvailableUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddMember = async (userId) => {
    try {
      const res = await fetch('/api/manager/team-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Failed to add member');
      onTeamUpdate(); // Refresh the dashboard data
      onClose(); // Close the modal on success
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const res = await fetch('/api/manager/team-members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Failed to remove member');
      onTeamUpdate(); // Refresh the dashboard data
      onClose(); // Close the modal on success
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Team</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>

        <input
          type="text"
          placeholder="Search for users to add..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded-lg mb-4"
        />

        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-2">Available Users</h3>
            <ul className="space-y-2 h-64 overflow-y-auto">
              {filteredUsers.map(user => (
                <li key={user._id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span>{user.name} ({user.role})</span>
                  <button onClick={() => handleAddMember(user._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">+</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Current Team</h3>
            <ul className="space-y-2 h-64 overflow-y-auto">
              {teamMembers.map(member => (
                <li key={member._id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span>{member.name}</span>
                  <button onClick={() => handleRemoveMember(member._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">-</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-right mt-6">
          <button onClick={onClose} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">Done</button>
        </div>
      </div>
    </div>
  );
};

export default TeamManagementModal;