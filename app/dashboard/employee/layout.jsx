import AIAssistant from '../../components/AIAssistant';

export default function EmployeeLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-8">
        <main>{children}</main>
        <AIAssistant />
      </div>
    </div>
  );
}