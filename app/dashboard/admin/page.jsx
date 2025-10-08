import KpiCard from '../../components/KpiCard';
import UserManagementTable from '../../components/UserManagementTable';
import RoleDistributionChart from '../../components/RoleDistributionChart';

const AdminDashboard = () => {
  const kpiData = [
    { title: 'Total Users', value: '1,234' },
    { title: 'Active Sessions', value: '56' },
    { title: 'Database Status', value: 'Online', status: 'Online' },
    { title: 'API Health', value: 'Online', status: 'Online' },
  ];

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">System Administrator Dashboard</h1>
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