"use client";
import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

const EmployeePerformanceModal = ({ employee, onClose, onAction }) => {
  const [activeTab, setActiveTab] = useState('goals');

  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-2xl font-bold">Performance & Skills for {employee.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button onClick={() => setActiveTab('goals')} className={`px-3 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'goals' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Performance Goals
            </button>
            <button onClick={() => setActiveTab('skills')} className={`px-3 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'skills' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Skills Profile
            </button>
          </nav>
        </div>

        <div className="py-4">
          {activeTab === 'goals' && <GoalsTab employee={employee} onAction={onAction} />}
          {activeTab === 'skills' && <SkillsTab employee={employee} />}
        </div>
      </div>
    </div>
  );
};

const GoalsTab = ({ employee, onAction }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = async () => {
    if (!employee?._id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/team/${employee._id}/goals`);
      if (!res.ok) throw new Error('Failed to fetch performance goals');
      const data = await res.json();
      setGoals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [employee]);

  const handleAction = async (goalId, status) => {
    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update goal status');
      fetchGoals();
      if (onAction) onAction();
    } catch (err) {
      console.error("Failed to process goal action:", err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Loading goals...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {goals.length > 0 ? (
        goals.map((goal) => (
          <div key={goal._id} className="p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-bold text-lg">{goal.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
            <p className="text-sm"><strong>Status:</strong> <span className={`font-semibold ${goal.status === 'Active' ? 'text-green-600' : goal.status === 'Needs Revision' ? 'text-yellow-600' : goal.status === 'Completed' ? 'text-blue-600' : 'text-gray-500'}`}>{goal.status}</span></p>
            {goal.status === 'Pending Approval' && (
              <div className="flex space-x-2 mt-4">
                <button onClick={() => handleAction(goal._id, 'Active')} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Approve</button>
                <button onClick={() => handleAction(goal._id, 'Needs Revision')} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">Request Revision</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No performance goals found for this employee.</p>
      )}
    </div>
  );
};

const SkillsTab = ({ employee }) => {
  const [skillDrift, setSkillDrift] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [proficiency, setProficiency] = useState('Beginner');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!employee?._id) return;
    setLoading(true);
    try {
      const [driftRes, skillsRes] = await Promise.all([
        fetch(`/api/analytics/skill-drift/${employee._id}`),
        fetch('/api/skills')
      ]);
      if (!driftRes.ok) throw new Error('Failed to fetch skill drift data.');
      if (!skillsRes.ok) throw new Error('Failed to fetch skills.');
      const driftData = await driftRes.json();
      const skillsData = await skillsRes.json();
      setSkillDrift(Array.isArray(driftData) ? driftData : []);
      setSkills(Array.isArray(skillsData) ? skillsData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [employee]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!selectedSkill) {
      alert('Please select a skill.');
      return;
    }
    try {
      const res = await fetch('/api/employee-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employee._id,
          skillId: selectedSkill,
          currentProficiency: proficiency,
        }),
      });
      if (!res.ok) throw new Error('Failed to add skill.');
      fetchData(); // Refresh data
      setSelectedSkill('');
      setProficiency('Beginner');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Loading skills profile...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const proficiencyToValue = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4, 'N/A': 0 };
  const chartData = skillDrift.map(d => ({
    skill: d.skill,
    required: proficiencyToValue[d.requiredProficiency],
    current: proficiencyToValue[d.currentProficiency],
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-xl font-bold mb-4">Skill Gap Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis angle={30} domain={[0, 4]} tickCount={5} />
            <Radar name="Required" dataKey="required" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Radar name="Current" dataKey="current" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Manage Skills</h3>
        <form onSubmit={handleAddSkill} className="bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <label htmlFor="skill-select" className="block text-sm font-medium text-gray-700 mb-1">Add Skill</label>
            <select
              id="skill-select"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select a skill</option>
              {skills.map(skill => (
                <option key={skill._id} value={skill._id}>{skill.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="proficiency-select" className="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
            <select
              id="proficiency-select"
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Add/Update Skill</button>
        </form>
        <div className="mt-6">
          <h4 className="font-bold mb-2">Current Skills</h4>
          <ul className="space-y-2">
            {skillDrift.filter(d => d.currentProficiency !== 'N/A').map(d => (
              <li key={d.skill} className="flex justify-between p-2 bg-gray-100 rounded-md">
                <span>{d.skill}</span>
                <span className="font-semibold">{d.currentProficiency}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeePerformanceModal;