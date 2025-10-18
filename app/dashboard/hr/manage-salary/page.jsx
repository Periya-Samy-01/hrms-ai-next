"use client";

import { useState, useEffect } from "react";

const ManageSalaryPage = () => {
  // State for the form inputs
  const [employeeId, setEmployeeId] = useState("");
  const [baseSalary, setBaseSalary] = useState("");
  const [payFrequency, setPayFrequency] = useState("Monthly");

  // State for data fetched from the API
  const [users, setUsers] = useState([]);
  const [structures, setStructures] = useState([]);

  // State for UI feedback
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch users for the dropdown
        const usersRes = await fetch("/api/users", { credentials: "include" });
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        const usersData = await usersRes.json();
        setUsers(usersData);

        // Fetch existing salary structures
        const structuresRes = await fetch("/api/compensation/salary-structure", { credentials: "include" });
        if (!structuresRes.ok) throw new Error("Failed to fetch salary structures");
        const structuresData = await structuresRes.json();
        setStructures(structuresData);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/compensation/salary-structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: employeeId, baseSalary, payFrequency }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create structure");
      }

      setStructures([...structures, data]);
      setSuccessMessage("Salary structure created successfully!");
      // Reset form
      setEmployeeId("");
      setBaseSalary("");
      setPayFrequency("Monthly");

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Manage Salary Structures</h2>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Create New Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="employee" className="block text-sm font-medium text-gray-700">Employee</label>
            <select
              id="employee"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            >
              <option value="">Select an Employee</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Base Salary (Annual)</label>
            <input
              type="number"
              id="salary"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 60000"
              required
            />
          </div>
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Pay Frequency</label>
            <select
              id="frequency"
              value={payFrequency}
              onChange={(e) => setPayFrequency(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option>Monthly</option>
              <option>Bi-Weekly</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isSubmitting ? "Creating..." : "Create Structure"}
          </button>
        </div>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-4">Existing Salary Structures</h3>
        {isLoading ? (
          <p>Loading structures...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Salary</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {structures
                  .filter(structure => structure.employeeId) // Filter out structures with null employeeId
                  .map(structure => (
                  <tr key={structure._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{structure.employeeId.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{structure.employeeId.profile.jobTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Intl.NumberFormat().format(structure.baseSalary)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{structure.payFrequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default ManageSalaryPage;
