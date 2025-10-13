'use client';
import { useState } from 'react';

const EditRoleModal = ({ user, onClose, onSave }) => {
  const [newRole, setNewRole] = useState(user.role);

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-2xl mb-4">Edit Role for {user.name}</h2>
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="bg-gray-700 text-white rounded-lg p-2 w-full mb-4"
        >
          <option value="admin">Admin</option>
          <option value="hr">HR</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
            Cancel
          </button>
          <button onClick={() => onSave(user._id, newRole)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const UserManagementTable = ({ users, refreshUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        await refreshUsers();
        handleCloseModal();
      } else {
        console.error('Failed to update role');
      }
    } catch (error) {
      console.error('Failed to update role', error);
    }
  };

  const handleResetPassword = async (user) => {
    if (window.confirm(`Are you sure you want to reset the password for ${user.name}?`)) {
      try {
        const response = await fetch(`/api/users/${user._id}/reset-password`, {
          method: 'POST',
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Failed to reset password', error);
        alert('An error occurred while resetting the password.');
      }
    }
  };

  const filteredUsers = users
    .filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(user => roleFilter === 'All' || user.role === roleFilter);

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">User Management</h2>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="bg-gray-800 text-white rounded-lg p-2 w-1/3"
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className="bg-gray-800 text-white rounded-lg p-2"
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select>
      </div>
      <table className="min-w-full bg-gray-900 text-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-700 text-left">Name</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left">Email</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left">Role</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b border-gray-800">{user.name}</td>
              <td className="py-2 px-4 border-b border-gray-800">{user.email}</td>
              <td className="py-2 px-4 border-b border-gray-800">{user.role}</td>
              <td className="py-2 px-4 border-b border-gray-800">
                <button onClick={() => handleEditClick(user)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">
                  Edit Role
                </button>
                <button onClick={() => handleResetPassword(user)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                  Reset Password
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && <EditRoleModal user={selectedUser} onClose={handleCloseModal} onSave={handleSaveRole} />}
    </div>
  );
};

export default UserManagementTable;