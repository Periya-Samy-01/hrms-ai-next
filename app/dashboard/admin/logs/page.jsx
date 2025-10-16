"use client";

import { useState, useEffect } from 'react';

const AuditLogPage = () => {
    const [auditLog, setAuditLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuditLog = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/audit-log', {
                    credentials: 'include',
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Failed to fetch audit log');
                }

                const data = await res.json();
                setAuditLog(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAuditLog();
    }, []);

    if (loading) {
        return <div className="text-center mt-8">Loading audit log...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">System Audit Log</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 border-b">Timestamp</th>
                            <th className="py-2 px-4 border-b">Actor</th>
                            <th className="py-2 px-4 border-b">Action</th>
                            <th className="py-2 px-4 border-b">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditLog.map((event) => (
                            <tr key={event._id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{new Date(event.timestamp).toLocaleString()}</td>
                                <td className="py-2 px-4 border-b">{event.actorId?.name || 'System'}</td>
                                <td className="py-2 px-4 border-b">{event.actionType}</td>
                                <td className="py-2 px-4 border-b">{JSON.stringify(event.details)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogPage;