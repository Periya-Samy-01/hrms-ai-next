"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const EmployeeDirectoryPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading employees...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Employee Directory</h1>
      </header>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {employees.map((employee) => (
            <li key={employee._id} className="p-4 hover:bg-gray-50 transition-colors">
              <Link href={`/dashboard/hr/directory/${employee._id}`}>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {/* Placeholder for photo */}
                    <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-gray-900 truncate">{employee.name}</p>
                    <p className="text-sm text-gray-500 truncate">{employee.profile?.jobTitle || 'N/A'}</p>
                  </div>
                  <div>
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployeeDirectoryPage;