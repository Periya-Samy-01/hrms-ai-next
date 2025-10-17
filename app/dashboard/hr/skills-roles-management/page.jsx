"use client";

import { useState } from 'react';

const AISkillGenerator = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [generatedProfile, setGeneratedProfile] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleGenerateProfile = async () => {
        setIsGenerating(true);
        setError(null);
        setSuccessMessage('');
        setGeneratedProfile(null);

        try {
            const res = await fetch('/api/ai/generate-skill-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobDescription }),
                credentials: 'include',
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || `Error: ${res.status}`);
            }

            const data = await res.json();
            setGeneratedProfile(data);
        } catch (err) {
            setError(`Failed to generate profile: ${err.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleConfirmAndSave = async () => {
        setIsSaving(true);
        setError(null);
        setSuccessMessage('');

        try {
            const res = await fetch('/api/roles/save-skill-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(generatedProfile),
                credentials: 'include',
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || `Error: ${res.status}`);
            }

            setSuccessMessage('Profile saved successfully!');
            setGeneratedProfile(null); // Clear the profile after saving

        } catch (err) {
            setError(`Failed to save profile: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Generate Skill Profile with AI</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {error && <div className="mt-4 text-red-500 bg-red-100 p-3 rounded-lg">Error: {error}</div>}
                {successMessage && <div className="mt-4 text-green-600 bg-green-100 p-3 rounded-lg">{successMessage}</div>}

                {!generatedProfile && (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Paste Job Description</h2>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the full job description here..."
                            className="w-full h-60 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            rows="10"
                        />
                        <button
                            onClick={handleGenerateProfile}
                            disabled={isGenerating || !jobDescription}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isGenerating ? 'Generating...' : 'Generate Skill Profile'}
                        </button>
                    </>
                )}

                {generatedProfile && !successMessage && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Confirm Generated Profile</h2>
                        <div className="bg-gray-100 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-gray-800">{generatedProfile.roleName}</h3>
                            <ul className="mt-4 space-y-2">
                                {generatedProfile.requiredSkills.map((skill, index) => (
                                    <li key={index} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm">
                                        <span className="font-medium text-gray-700">{skill.skillName}</span>
                                        <span className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">{skill.requiredProficiency}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 flex space-x-4">
                                <button
                                    onClick={handleConfirmAndSave}
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                                >
                                    {isSaving ? 'Saving...' : 'Confirm and Save'}
                                </button>
                                <button
                                    onClick={() => setGeneratedProfile(null)}
                                    className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AISkillGenerator;