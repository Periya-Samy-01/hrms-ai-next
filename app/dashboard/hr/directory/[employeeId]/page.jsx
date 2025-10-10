"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import CompensationForm from '@/app/components/hr/CompensationForm';

// Helper to get user role from JWT in cookies
const getUserRoleFromCookie = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch (e) {
    console.error('Failed to parse JWT:', e);
    return null;
  }
};


const EmployeeProfilePage = () => {
  const params = useParams();
  const { employeeId } = params;
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [activeTab, setActiveTab] = useState('Personal Info');

  useEffect(() => {
    // This effect runs only on the client side to get the user role
    const role = getUserRoleFromCookie();
    setUserRole(role);
    if (role === 'admin' || role === 'hr') {
      setActiveTab('Compensation');
    }
  }, []);

  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${employeeId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch employee data');
        }
        const data = await res.json();
        setEmployee(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const renderTabs = () => {
    const isAuthorized = userRole === 'admin' || userRole === 'hr';
    const tabs = [
      { name: 'Personal Info', show: true },
      { name: 'Compensation', show: isAuthorized },
      { name: 'Leave', show: true },
    ];

    return (
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.filter(tab => tab.show).map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`${
                activeTab === tab.name
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    );
  };

  const renderTabContent = () => {
    const isAuthorized = userRole === 'admin' || userRole === 'hr';

    switch (activeTab) {
      case 'Compensation':
        return isAuthorized ? <CompensationForm employeeId={employeeId} /> : <p>You are not authorized to view this content.</p>;
      case 'Personal Info':
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-500">Email</p>
                <p className="text-gray-800">{employee.email}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Role</p>
                <p className="text-gray-800 capitalize">{employee.role}</p>
              </div>
            </div>
          </div>
        );
      case 'Leave':
        return <div className="bg-white shadow-md rounded-lg p-6"><h2 className="text-2xl font-semibold text-gray-700">Leave Information</h2><p>Leave details will be displayed here.</p></div>;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  if (!employee) {
    return <div className="text-center p-8">Employee not found.</div>;
  }

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{employee.name}</h1>
        <p className="text-xl text-gray-600">{employee.profile?.jobTitle}</p>
      </header>

      <div className="mt-8">
        {renderTabs()}
        <div className="pt-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfilePage;