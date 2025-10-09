const newHires = [
  { id: 1, name: 'Creed Bratton', role: 'Quality Assurance', progress: 75 },
  { id: 2, name: 'Erin Hannon', role: 'Receptionist', progress: 50 },
  { id: 3, name: 'Gabe Lewis', role: 'Coordinator', progress: 25 },
];

const OnboardingTracker = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Onboarding Tracker</h2>
      <div className="space-y-4">
        {newHires.map(hire => (
          <div key={hire.id}>
            <div className="flex justify-between mb-1">
              <p className="font-semibold">{hire.name}</p>
              <p className="text-sm text-gray-600">{hire.role}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${hire.progress}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-500 mt-1">{hire.progress}% Complete</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnboardingTracker;