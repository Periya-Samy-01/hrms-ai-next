'use client';

import { useState } from 'react';
import AddNewEmployeeModal from './AddNewEmployeeModal';
import PostAnnouncementModal from './PostAnnouncementModal';

const QuickActions = () => {
  const [isAddEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
  const [isPostAnnouncementModalOpen, setPostAnnouncementModalOpen] = useState(false);

  const handleAddNewEmployee = async (employeeData) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add employee');
      }

      setAddEmployeeModalOpen(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handlePostAnnouncement = async (announcementData) => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(announcementData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to post announcement');
      }

      setPostAnnouncementModalOpen(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-700">Quick Actions</h2>
        <button
          onClick={() => setAddEmployeeModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add New Employee
        </button>
        <button
          onClick={() => setPostAnnouncementModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Post Announcement
        </button>
      </div>
      <AddNewEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onClose={() => setAddEmployeeModalOpen(false)}
        onAddEmployee={handleAddNewEmployee}
      />
      <PostAnnouncementModal
        isOpen={isPostAnnouncementModalOpen}
        onClose={() => setPostAnnouncementModalOpen(false)}
        onPostAnnouncement={handlePostAnnouncement}
      />
    </>
  );
};

export default QuickActions;