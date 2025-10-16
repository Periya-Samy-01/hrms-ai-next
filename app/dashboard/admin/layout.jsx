import Sidebar from '../../components/Sidebar';
import AdminDashboardHeader from '../../components/dashboard/AdminDashboardHeader';

export default function AdminLayout({ children }) {
  return (
    <div className="flex bg-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AdminDashboardHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}