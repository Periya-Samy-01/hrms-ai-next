"use client";

import { useState, useEffect } from 'react';
import AttritionRiskTable from '../../../components/analytics/AttritionRiskTable';
import PerformanceTrendsChart from '../../../components/analytics/PerformanceTrendsChart';

const AnalyticsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics/attrition-risk', { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server.');
        }
        const result = await response.json();
        if (!Array.isArray(result)) {
          throw new Error('Invalid data format received from server.');
        }
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Analytics & Insights</h1>

      {loading && <div>Loading analytics data...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      {!loading && !error && data.length > 0 && (
        <>
          <AttritionRiskTable data={data} />
          <PerformanceTrendsChart data={data} />
        </>
      )}

      {!loading && !error && data.length === 0 && (
        <div>No analytics data available.</div>
      )}
    </div>
  );
};

export default AnalyticsPage;
