import Sidebar from '../../components/Sidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex bg-gray-800">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}