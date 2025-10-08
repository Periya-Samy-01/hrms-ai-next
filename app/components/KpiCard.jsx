const KpiCard = ({ title, value, status }) => {
  const statusColor = status === 'Online' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-400 mb-2">{title}</h2>
      <p className={`text-3xl font-bold ${status ? statusColor : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
};

export default KpiCard;