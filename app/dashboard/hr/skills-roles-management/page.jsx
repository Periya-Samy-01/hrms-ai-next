"use client";

import { useState } from 'react';

const AISkillGenerator = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleGenerateAndSaveProfile = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            const res = await fetch('/api/ai/analyze-role', {
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
            setSuccessMessage(`Successfully generated and saved profile for role: ${data.roleName}`);
            setJobDescription(''); // Clear the textarea on success
        } catch (err) {
            setError(`Failed to process job description: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Generate and Save Skill Profile with AI</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Paste Job Description</h2>
                <p className="text-gray-600 mb-4">
                    Paste a job description below. The system will use AI to analyze it, extract the required skills, and automatically save a new skill profile for the role.
                </p>

                {error && <div className="mb-4 text-red-500 bg-red-100 p-3 rounded-lg">Error: {error}</div>}
                {successMessage && <div className="mb-4 text-green-600 bg-green-100 p-3 rounded-lg">{successMessage}</div>}

                <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="e.g., 'We are looking for a Senior Software Engineer...'"
                    className="w-full h-60 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows="10"
                />
                <button
                    onClick={handleGenerateAndSaveProfile}
                    disabled={isLoading || !jobDescription}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Analyzing and Saving...' : 'Generate and Save Profile'}
                </button>
            </div>
        </div>
    );
};

export default AISkillGenerator;