"use client";

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceTrendsChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Performance Trends: Overtime vs. Attrition Risk</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="overtimeHours" name="Overtime Hours" unit="h" />
          <YAxis type="number" dataKey="riskScore" name="Attrition Risk Score" unit="%" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Employee Risk" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceTrendsChart;
