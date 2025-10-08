'use client';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Admin', value: 1 },
  { name: 'HR', value: 1 },
  { name: 'Manager', value: 1 },
  { name: 'Employee', value: 2 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RoleDistributionChart = () => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg" style={{ height: '400px' }}>
      <h2 className="text-xl font-semibold text-white mb-4">User Role Distribution</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#333', border: 'none' }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend wrapperStyle={{ color: '#fff' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RoleDistributionChart;