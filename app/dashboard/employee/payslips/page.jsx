"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const PayslipsPage = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        const res = await fetch('/api/payslips', { credentials: 'include' });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch payslips');
        }
        const data = await res.json();
        setPayslips(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayslips();
  }, []);

  const toggleExpansion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderBreakdown = (breakdown) => {
    if (!breakdown) return <p className="text-gray-500">No detailed breakdown available.</p>;

    const earnings = breakdown.earnings || {};
    const deductions = breakdown.deductions || {};

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {/* Earnings Column */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Earnings</h4>
          <ul className="space-y-1">
            {Object.entries(earnings).map(([key, value]) => (
              <li key={key} className="flex justify-between">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-medium text-gray-800">${value.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Deductions Column */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Deductions</h4>
          <ul className="space-y-1">
            {Object.entries(deductions).map(([key, value]) => (
              <li key={key} className="flex justify-between">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-medium text-gray-800">-${value.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-center">
        Loading payslips...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Payslips</h1>
        <Link href="/dashboard/employee" className="text-indigo-600 hover:text-indigo-800">
          &larr; Back to Dashboard
        </Link>
      </header>

      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {payslips.length > 0 ? (
            payslips.map((payslip) => (
              <li key={payslip._id} className="p-4 sm:p-6">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpansion(payslip._id)}>
                  <div>
                    <p className="font-semibold text-indigo-600">
                      Pay Period: {formatDate(payslip.payPeriodStartDate)} - {formatDate(payslip.payPeriodEndDate)}
                    </p>
                    <p className="text-gray-600">
                      Net Pay: <span className="font-bold text-green-600">${payslip.netPay.toFixed(2)}</span>
                    </p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                      expandedId === payslip._id ? 'rotate-180' : ''
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {expandedId === payslip._id && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Payslip Details</h3>
                        <p className="text-sm text-gray-500">Gross: ${payslip.grossEarnings.toFixed(2)} | Deductions: -${payslip.deductions.toFixed(2)}</p>
                      </div>
                      <button className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-sm hover:bg-gray-300 transition-colors text-sm">
                        Download as PDF
                      </button>
                    </div>
                    {renderBreakdown(payslip.breakdown)}
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="p-6 text-center text-gray-500">
              You do not have any payslips yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PayslipsPage;
