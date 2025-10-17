import Sidebar from '../../components/Sidebar';
import AIAssistant from '../../components/AIAssistant';

export default function AdminLayout({ children }) {
  return (
    <div className="flex bg-gray-800">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
      <AIAssistant />
    </div>
  );
}