"use client";

import { useState, useEffect } from 'react';

const CompensationForm = ({ employeeId }) => {
  const [formData, setFormData] = useState({
    baseSalary: '',
    payFrequency: 'Monthly',
    effectiveDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCompensation = async () => {
      try {
        const res = await fetch(`/api/compensation/${employeeId}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            baseSalary: data.baseSalary,
            payFrequency: data.payFrequency,
            effectiveDate: data.effectiveDate ? new Date(data.effectiveDate).toISOString().split('T')[0] : '',
          });
        } else if (res.status === 404) {
          // No existing data, fine to proceed with an empty form
        } else {
          throw new Error('Failed to fetch compensation data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompensation();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/compensation/${employeeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save compensation');
      }

      setSuccess('Compensation details saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !success) {
    return <div>Loading compensation details...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Manage Compensation</h2>
      {error && <div className="mb-4 text-red-500 bg-red-100 p-3 rounded">{error}</div>}
      {success && <div className="mb-4 text-green-500 bg-green-100 p-3 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="baseSalary" className="block text-sm font-medium text-gray-700">Base Salary</label>
          <input
            type="number"
            name="baseSalary"
            id="baseSalary"
            value={formData.baseSalary}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="payFrequency" className="block text-sm font-medium text-gray-700">Pay Frequency</label>
          <select
            name="payFrequency"
            id="payFrequency"
            value={formData.payFrequency}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option>Monthly</option>
            <option>Bi-Weekly</option>
          </select>
        </div>
        <div>
          <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700">Effective Date</label>
          <input
            type="date"
            name="effectiveDate"
            id="effectiveDate"
            value={formData.effectiveDate}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Compensation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompensationForm;