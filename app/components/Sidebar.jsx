import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-8">Admin Menu</h2>
      <nav>
        <ul>
          <li className="mb-4">
            <Link href="/dashboard/admin" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/dashboard/admin/settings" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <span className="ml-3">Company Settings</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/dashboard/admin/logs" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <span className="ml-3">Audit Logs</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;