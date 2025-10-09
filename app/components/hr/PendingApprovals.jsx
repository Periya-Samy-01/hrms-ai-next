'use client';

const approvals = [
  { id: 1, type: 'Leave Request', applicant: 'Kevin Malone' },
  { id: 2, type: 'Expense Claim', applicant: 'Oscar Martinez' },
  { id: 3, type: 'Timesheet', applicant: 'Angela Martin' },
];

const PendingApprovals = () => {
  const handleReview = (approvalId) => {
    console.log(`Reviewing approval request ID: ${approvalId}`);
    // In a real application, this would open a detailed view of the request
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Pending HR Approvals</h2>
      <ul className="space-y-4">
        {approvals.map(approval => (
          <li key={approval.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
            <div>
              <p className="font-semibold">{approval.type}</p>
              <p className="text-sm text-gray-600">Applicant: {approval.applicant}</p>
            </div>
            <button
              onClick={() => handleReview(approval.id)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-3 rounded-lg text-sm"
            >
              Review
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingApprovals;