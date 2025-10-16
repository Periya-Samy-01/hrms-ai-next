"use client";

import { useState, useEffect } from 'react';

const MasterSkillsList = () => {
    const [skills, setSkills] = useState([]);
    const [newSkillName, setNewSkillName] = useState('');
    const [editingSkill, setEditingSkill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/skills');
            const data = await res.json();
            setSkills(data);
        } catch (err) {
            setError('Failed to fetch skills');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleCreateSkill = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newSkillName }),
                credentials: 'include',
            });
            if (res.ok) {
                setNewSkillName('');
                fetchSkills();
            } else {
                const err = await res.json();
                setError(err.message || 'Failed to create skill');
            }
        } catch (err) {
            setError('Failed to create skill');
        }
    };

    const handleUpdateSkill = async (skill) => {
        try {
            const res = await fetch(`/api/skills/${skill._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: skill.name }),
                credentials: 'include',
            });
            if (res.ok) {
                setEditingSkill(null);
                fetchSkills();
            } else {
                const err = await res.json();
                setError(err.message || 'Failed to update skill');
            }
        } catch (err) {
            setError('Failed to update skill');
        }
    };

    const handleDeleteSkill = async (id) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;
        try {
            const res = await fetch(`/api/skills/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (res.ok) {
                fetchSkills();
            } else {
                const err = await res.json();
                setError(err.message || 'Failed to delete skill');
            }
        } catch (err) {
            setError('Failed to delete skill');
        }
    };

    if (loading) return <div>Loading skills...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleCreateSkill} className="mb-4 flex space-x-2">
                <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Enter new skill name"
                    className="flex-grow p-2 border rounded-lg"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Add Skill</button>
            </form>
            <ul className="space-y-2">
                {skills.map((skill) => (
                    <li key={skill._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        {editingSkill?._id === skill._id ? (
                            <input
                                type="text"
                                value={editingSkill.name}
                                onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                                className="flex-grow p-2 border rounded-lg"
                            />
                        ) : (
                            <span>{skill.name}</span>
                        )}
                        <div className="flex space-x-2">
                            {editingSkill?._id === skill._id ? (
                                <button onClick={() => handleUpdateSkill(editingSkill)} className="text-green-500 hover:text-green-700">Save</button>
                            ) : (
                                <button onClick={() => setEditingSkill({ ...skill })} className="text-blue-500 hover:text-blue-700">Edit</button>
                            )}
                            <button onClick={() => handleDeleteSkill(skill._id)} className="text-red-500 hover:text-red-700">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MasterSkillsList;