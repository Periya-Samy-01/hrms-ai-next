"use client";

import { useState, useEffect } from 'react';

const RoleSkillRequirements = () => {
    const [roles, setRoles] = useState([]);
    const [skills, setSkills] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [roleSkills, setRoleSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [rolesRes, skillsRes] = await Promise.all([
                fetch('/api/role-skill-matrix'),
                fetch('/api/skills'),
            ]);
            const rolesData = await rolesRes.json();
            const skillsData = await skillsRes.json();
            setRoles(rolesData);
            setSkills(skillsData);
        } catch (err) {
            setError('Failed to fetch initial data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedRole) {
            const roleData = roles.find(r => r.roleName === selectedRole);
            setRoleSkills(roleData ? roleData.requiredSkills : []);
        } else {
            setRoleSkills([]);
        }
    }, [selectedRole, roles]);

    const handleAddSkill = () => {
        setRoleSkills([...roleSkills, { skillId: '', requiredProficiency: 'Beginner' }]);
    };

    const handleSkillChange = (index, field, value) => {
        const updatedSkills = [...roleSkills];
        updatedSkills[index][field] = value;
        setRoleSkills(updatedSkills);
    };

    const handleRemoveSkill = (index) => {
        const updatedSkills = roleSkills.filter((_, i) => i !== index);
        setRoleSkills(updatedSkills);
    };

    const handleSaveChanges = async () => {
        try {
            const res = await fetch('/api/role-skill-matrix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roleName: selectedRole, requiredSkills: roleSkills }),
                credentials: 'include',
            });
            if (res.ok) {
                fetchInitialData(); // Refresh data
                alert('Changes saved successfully!');
            } else {
                const err = await res.json();
                setError(err.message || 'Failed to save changes');
            }
        } catch (err) {
            setError('Failed to save changes');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
                <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
                <select
                    id="role-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                >
                    <option value="">-- Select a Role --</option>
                    {/* Assuming roles are predefined or fetched from somewhere */}
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Senior Software Engineer">Senior Software Engineer</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Accountant">Accountant</option>
                </select>
            </div>

            {selectedRole && (
                <div>
                    <h3 className="text-xl font-bold mb-4">Required Skills for {selectedRole}</h3>
                    <div className="space-y-4">
                        {roleSkills.map((rs, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                                <select
                                    value={rs.skillId._id || rs.skillId}
                                    onChange={(e) => handleSkillChange(index, 'skillId', e.target.value)}
                                    className="flex-grow p-2 border rounded-lg"
                                >
                                    <option value="">-- Select Skill --</option>
                                    {skills.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                </select>
                                <select
                                    value={rs.requiredProficiency}
                                    onChange={(e) => handleSkillChange(index, 'requiredProficiency', e.target.value)}
                                    className="p-2 border rounded-lg"
                                >
                                    {proficiencyLevels.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                                <button onClick={() => handleRemoveSkill(index)} className="text-red-500 hover:text-red-700">Remove</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddSkill} className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Add Skill</button>
                    <button onClick={handleSaveChanges} className="mt-4 ml-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Save Changes</button>
                </div>
            )}
        </div>
    );
};

export default RoleSkillRequirements;