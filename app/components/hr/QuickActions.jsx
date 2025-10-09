'use client';

const QuickActions = () => {
  const handleAddNewEmployee = () => {
    console.log('Opening form to add a new employee...');
    // In a real application, this would likely trigger a modal or navigate to a new page
  };

  const handlePostAnnouncement = () => {
    console.log('Opening form to post an announcement...');
    // This would open a text editor or a modal for the announcement
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
      <h2 className="text-lg font-semibold text-gray-700">Quick Actions</h2>
      <button
        onClick={handleAddNewEmployee}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
      >
        Add New Employee
      </button>
      <button
        onClick={handlePostAnnouncement}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
      >
        Post Announcement
      </button>
    </div>
  );
};

export default QuickActions;