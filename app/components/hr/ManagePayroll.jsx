"use client";

import { useState } from "react";

const ManagePayroll = () => {
  const [payPeriodStartDate, setPayPeriodStartDate] = useState("");
  const [payPeriodEndDate, setPayPeriodEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRunPayroll = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/payroll/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ payPeriodStartDate, payPeriodEndDate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Manage Payroll</h2>
      <form onSubmit={handleRunPayroll}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Initiate New Payroll Run
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pay Period Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={payPeriodStartDate}
              onChange={(e) => setPayPeriodStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pay Period End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={payPeriodEndDate}
              onChange={(e) => setPayPeriodEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>
        <div className="flex flex-col items-start">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Payslips"}
          </button>
          <p className="mt-2 text-sm text-gray-600">
            Warning: This action will generate new payslips for all eligible
            employees and cannot be undone.
          </p>
        </div>
        {message && (
          <div
            className={`mt-4 text-sm ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </section>
  );
};

export default ManagePayroll;
