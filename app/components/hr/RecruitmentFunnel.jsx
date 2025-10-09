const candidates = {
  applied: [
    { id: 1, name: 'Michael Scott', role: 'Regional Manager' },
    { id: 2, name: 'Dwight Schrute', role: 'Assistant to the Regional Manager' },
  ],
  interviewing: [
    { id: 3, name: 'Jim Halpert', role: 'Sales Representative' },
    { id: 4, name: 'Pam Beesly', role: 'Receptionist' },
  ],
  offer: [
    { id: 5, name: 'Andy Bernard', role: 'Sales Director' },
  ],
};

const RecruitmentFunnel = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recruitment Funnel</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Applied Column */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold text-gray-700 mb-3">Applied ({candidates.applied.length})</h3>
          <div className="space-y-3">
            {candidates.applied.map(candidate => (
              <div key={candidate.id} className="bg-white p-3 rounded-md shadow">
                <p className="font-semibold">{candidate.name}</p>
                <p className="text-sm text-gray-600">{candidate.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interviewing Column */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold text-gray-700 mb-3">Interviewing ({candidates.interviewing.length})</h3>
          <div className="space-y-3">
            {candidates.interviewing.map(candidate => (
              <div key={candidate.id} className="bg-white p-3 rounded-md shadow">
                <p className="font-semibold">{candidate.name}</p>
                <p className="text-sm text-gray-600">{candidate.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Offer Column */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold text-gray-700 mb-3">Offer ({candidates.offer.length})</h3>
          <div className="space-y-3">
            {candidates.offer.map(candidate => (
              <div key={candidate.id} className="bg-white p-3 rounded-md shadow">
                <p className="font-semibold">{candidate.name}</p>
                <p className="text-sm text-gray-600">{candidate.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentFunnel;