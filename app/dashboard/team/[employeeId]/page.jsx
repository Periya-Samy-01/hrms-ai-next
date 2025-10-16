"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const EmployeeDetailsPage = () => {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const { employeeId } = params;

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            if (!employeeId) return;

            try {
                setLoading(true);
                const res = await fetch(`/api/team/${employeeId}/details`, {
                    credentials: 'include',
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Failed to fetch employee details');
                }

                const data = await res.json();
                setEmployee(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeDetails();
    }, [employeeId]);

    if (loading) {
        return <div className="text-center mt-8">Loading employee details...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
    }

    if (!employee) {
        return <div className="text-center mt-8">No employee data found.</div>;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Employee Details</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-700">Personal Information</h2>
                    <p className="mt-2"><strong>Name:</strong> {employee.name}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Role:</strong> <span className="capitalize">{employee.role}</span></p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-700">Employment Information</h2>
                    <p className="mt-2"><strong>Joined On:</strong> {new Date(employee.createdAt).toLocaleDateString()}</p>
                    <p><strong>Team Size:</strong> {employee.team ? employee.team.length : 0}</p>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetailsPage;