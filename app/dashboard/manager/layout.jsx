import ManagerDashboardHeader from '../../components/dashboard/ManagerDashboardHeader';

export default function ManagerLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-8">
        <ManagerDashboardHeader />
        <main>{children}</main>
      </div>
    </div>
  );
}