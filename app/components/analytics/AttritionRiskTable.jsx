"use client";

import { useState, useMemo } from 'react';

const AttritionRiskTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'riskScore', direction: 'descending' });

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getRiskColor = (score) => {
    if (score > 75) return 'text-red-600 font-bold';
    if (score > 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Attrition Risk List</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('riskScore')}
            >
              Risk Score {sortConfig.key === 'riskScore' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contributing Factors</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((item) => (
            <tr key={item.employeeId}>
              <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
              <td className={`px-6 py-4 whitespace-nowrap ${getRiskColor(item.riskScore)}`}>{item.riskScore}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.contributingFactors.map(factor => (
                  <span key={factor} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 mr-2">
                    {factor}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttritionRiskTable;
