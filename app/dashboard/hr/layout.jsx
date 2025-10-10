import DashboardHeader from '../../components/hr/DashboardHeader';

export default function HRLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-8">
        <DashboardHeader />
        <main>{children}</main>
      </div>
    </div>
  );
}