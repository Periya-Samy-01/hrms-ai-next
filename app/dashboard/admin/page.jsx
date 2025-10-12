"use client";
import { useRouter } from "next/navigation";
import KpiCard from '../../components/KpiCard';
import UserManagementTable from '../../components/UserManagementTable';
import RoleDistributionChart from '../../components/RoleDistributionChart';

const AdminDashboard = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const kpiData = [
    { title: 'Total Users', value: '1,234' },
    { title: 'Active Sessions', value: '56' },
    { title: 'Database Status', value: 'Online', status: 'Online' },
    { title: 'API Health', value: 'Online', status: 'Online' },
  ];

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Administrator Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <KpiCard key={index} title={kpi.title} value={kpi.value} status={kpi.status} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserManagementTable />
        </div>
        <div>
          <RoleDistributionChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;