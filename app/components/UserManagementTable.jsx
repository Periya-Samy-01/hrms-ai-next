'use client';
import { useState } from 'react';

const users = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'HR' },
  { id: 3, name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'Manager' },
  { id: 4, name: 'Alice Johnson', email: 'alice.j@example.com', role: 'Employee' },
  { id: 5, name: 'Bob Brown', email: 'bob.b@example.com', role: 'Employee' },
];

const UserManagementTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

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
            <tr key={user.id}>
              <td className="py-2 px-4 border-b border-gray-800">{user.name}</td>
              <td className="py-2 px-4 border-b border-gray-800">{user.email}</td>
              <td className="py-2 px-4 border-b border-gray-800">{user.role}</td>
              <td className="py-2 px-4 border-b border-gray-800">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">
                  Edit Role
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                  Reset Password
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementTable;