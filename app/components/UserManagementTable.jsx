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

const ChangePasswordModal = ({ user, onClose, onSave }) => {
  const [newPassword, setNewPassword] = useState('');

  if (!user) return null;

  const handleSave = () => {
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    onSave(user._id, newPassword);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-2xl mb-4">Change Password for {user.name}</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="bg-gray-700 text-white rounded-lg p-2 w-full mb-4"
        />
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleChangePasswordClick = (user) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsPasswordModalOpen(false);
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

  const handleSavePassword = async (userId, newPassword) => {
    try {
      const response = await fetch(`/api/users/${userId}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        handleCloseModal();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Failed to change password', error);
      alert('An error occurred while changing the password.');
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
                <button onClick={() => handleChangePasswordClick(user)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                  Change Password
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditModalOpen && <EditRoleModal user={selectedUser} onClose={handleCloseModal} onSave={handleSaveRole} />}
      {isPasswordModalOpen && <ChangePasswordModal user={selectedUser} onClose={handleCloseModal} onSave={handleSavePassword} />}
    </div>
  );
};

export default UserManagementTable;