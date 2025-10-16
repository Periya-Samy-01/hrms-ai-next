"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import KpiCard from '../../components/KpiCard';
import UserManagementTable from '../../components/UserManagementTable';
import RoleDistributionChart from '../../components/RoleDistributionChart';

const AdminDashboard = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const kpiData = [
    { title: 'Total Users', value: users.length },
    { title: 'Active Sessions', value: '56' },
    { title: 'Database Status', value: 'Online', status: 'Online' },
    { title: 'API Health', value: 'Online', status: 'Online' },
  ];

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Administrator Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <KpiCard key={index} title={kpi.title} value={kpi.value} status={kpi.status} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserManagementTable users={users} refreshUsers={fetchUsers} />
        </div>
        <div>
          <RoleDistributionChart users={users} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;