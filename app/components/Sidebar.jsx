import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul>
          <li>
            <Link href="/dashboard/admin" className="block p-2 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/dashboard/admin/users" className="block p-2 rounded hover:bg-gray-700">
              Users
            </Link>
          </li>
          <li>
            <Link href="/dashboard/admin/settings" className="block p-2 rounded hover:bg-gray-700">
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;