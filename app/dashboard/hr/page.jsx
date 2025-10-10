import QuickActions from '../../components/hr/QuickActions';
import RecruitmentFunnel from '../../components/hr/RecruitmentFunnel';
import OnboardingTracker from '../../components/hr/OnboardingTracker';
import PendingApprovals from '../../components/hr/PendingApprovals';
import HRLayout from './layout';

const HRDashboard = () => {
  return (
    <HRLayout>
      <div className="mb-8">
        <QuickActions />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="w-full lg:w-2/3">
          <section className="mb-8">
            <RecruitmentFunnel />
          </section>
          <section>
            <OnboardingTracker />
          </section>
        </main>
        <aside className="w-full lg:w-1/3">
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
    </HRLayout>
  );
};

export default HRDashboard;