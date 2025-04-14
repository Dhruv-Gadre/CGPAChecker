import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator } from 'lucide-react';

const Target = () => {
  const [existingCgpa, setExistingCgpa] = useState("");
  const [creditsEarned, setCreditsEarned] = useState("");
  const [currentSemesterCredits, setCurrentSemesterCredits] = useState("");
  const [targetCgpa, setTargetCgpa] = useState("");
  const [requiredGpa, setRequiredGpa] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    const cgpa = parseFloat(existingCgpa);
    const earnedCredits = parseFloat(creditsEarned);
    const currentCredits = parseFloat(currentSemesterCredits);
    const target = parseFloat(targetCgpa);

    const totalCredits = earnedCredits + currentCredits;
    const totalGradePoints = cgpa * earnedCredits;
    const targetGradePoints = target * totalCredits;

    const requiredSemesterGpa = (targetGradePoints - totalGradePoints) / currentCredits;

    setRequiredGpa(requiredSemesterGpa);
  };

  return (
    <div className={`overflow-x-hidden min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className={`rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
          <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-indigo-600'} text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calculator size={32} className="text-indigo-200" />
                <h1 className="text-3xl font-bold tracking-tight">GPA Target Calculator</h1>
              </div>
              <Link
                to="/"
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-indigo-700 hover:bg-indigo-800 text-white'} transition flex items-center gap-2`}
              >
                <ArrowLeft size={20} />
                <span>Back to Calculator</span>
              </Link>
            </div>
            <p className={`mt-2 ${darkMode ? 'text-indigo-200' : 'text-indigo-100'}`}>
              Calculate the GPA you need this semester to reach your target CGPA
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition`}>
                  <label className="block text-sm font-medium mb-1">
                    Existing CGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className={`w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                    value={existingCgpa}
                    onChange={(e) => setExistingCgpa(e.target.value)}
                    required
                    placeholder="Enter your current CGPA"
                  />
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition`}>
                  <label className="block text-sm font-medium mb-1">
                    Credits Earned
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    className={`w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                    value={creditsEarned}
                    onChange={(e) => setCreditsEarned(e.target.value)}
                    required
                    placeholder="Enter total credits earned"
                  />
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition`}>
                  <label className="block text-sm font-medium mb-1">
                    Target CGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className={`w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                    value={targetCgpa}
                    onChange={(e) => setTargetCgpa(e.target.value)}
                    required
                    placeholder="Enter your target CGPA"
                  />
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition`}>
                  <label className="block text-sm font-medium mb-1">
                    Current Semester Credits
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    className={`w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                    value={currentSemesterCredits}
                    onChange={(e) => setCurrentSemesterCredits(e.target.value)}
                    required
                    placeholder="Enter current semester credits"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white glow`}
              >
                <Calculator size={20} />
                <span className="font-medium">Calculate Required GPA</span>
              </button>
            </form>

            {requiredGpa !== null && (
              <div className={`mt-6 p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-indigo-50'} border ${darkMode ? 'border-gray-600' : 'border-indigo-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">Results</h2>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className={`flex justify-between items-center p-4 rounded-md ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                    <p>Required GPA for this semester:</p>
                    <p className="text-xl font-bold text-purple-500">{requiredGpa.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 text-center text-sm opacity-75">
              Made with ❤️ for students | Calculate your academic goals
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Target;