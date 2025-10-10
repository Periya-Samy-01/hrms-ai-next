import QuickActions from '../../components/hr/QuickActions';
import RecruitmentFunnel from '../../components/hr/RecruitmentFunnel';
import OnboardingTracker from '../../components/hr/OnboardingTracker';
import PendingApprovals from '../../components/hr/PendingApprovals';

const HRDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">HR Professional Dashboard</h1>
        </header>

        {/* Quick Actions Bar */}
        <div className="mb-8">
          <QuickActions />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="w-full lg:w-2/3">
            {/* Recruitment Funnel */}
            <section className="mb-8">
               <RecruitmentFunnel />
            </section>

            {/* Onboarding Tracker */}
            <section>
              <OnboardingTracker />
            </section>
          </main>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-1/3">
            {/* Pending HR Approvals */}
            <PendingApprovals />
          </aside>
        </div>

        <footer className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">More Options</h2>
            <div className="flex space-x-4">
                <a href="/dashboard/hr/directory" className="text-blue-500 hover:underline">Employee Directory</a>
                <a href="#" className="text-blue-500 hover:underline">HR Reports</a>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default HRDashboard;