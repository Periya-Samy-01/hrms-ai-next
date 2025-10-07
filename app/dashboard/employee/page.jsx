const EmployeeDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
      <p className="mb-8">Welcome, Employee!</p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Your Information</h2>
        <p>Details about your profile and tasks will be displayed here.</p>
      </div>
    </div>
  );
};

export default EmployeeDashboard;