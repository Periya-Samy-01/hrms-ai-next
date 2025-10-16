import EmployeeDashboardHeader from '../../components/dashboard/EmployeeDashboardHeader';

export default function EmployeeLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-8">
        <EmployeeDashboardHeader />
        <main>{children}</main>
      </div>
    </div>
  );
}