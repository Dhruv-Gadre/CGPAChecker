import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Calculator, BookOpen, Award, Save, Moon, Sun, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Target from './Target';

function CalculatorView() {
  const [subjects, setSubjects] = useState([]);
  const [previousCGPA, setPreviousCGPA] = useState('');
  const [previousCredits, setPreviousCredits] = useState('');
  const [currentGPA, setCurrentGPA] = useState(null);
  const [overallCGPA, setOverallCGPA] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const gradePoints = {
    'S': 10,
    'A': 9,
    'B': 8,
    'C': 7,
    'D': 6,
    'E': 5,
    'F': 0
  };

  const addSubject = () => {
    setSubjects([
      ...subjects,
      { id: Date.now(), name: '', credits: 0, grade: 'S' }
    ]);
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map(subject =>
      subject.id === id ? { ...subject, [field]: value } : subject
    ));
  };

  const calculateGPA = () => {
    if (subjects.length === 0) return;

    let credits = 0;
    let points = 0;

    subjects.forEach(subject => {
      credits += subject.credits;
      points += subject.credits * gradePoints[subject.grade];
    });

    setTotalCredits(credits);
    setTotalPoints(points);
    const semesterGPA = points / credits;
    setCurrentGPA(semesterGPA);

    if (previousCGPA && previousCredits) {
      const prevCGPA = parseFloat(previousCGPA);
      const prevCredits = parseFloat(previousCredits);
      const overall = (prevCGPA * prevCredits + semesterGPA * credits) / (prevCredits + credits);
      setOverallCGPA(overall);
    }
  };

  const downloadExcel = () => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();

    // Create headers and data for subjects table
    const subjectHeaders = ["Subject Name", "Credits", "Grade", "Grade Points", "Points Earned"];
    const subjectData = subjects.map(subject => [
      subject.name || "Unnamed Subject",
      subject.credits,
      subject.grade,
      gradePoints[subject.grade],
      subject.credits * gradePoints[subject.grade]
    ]);

    // Add summary rows
    const summaryRows = [
      ["", "", "", "", ""],
      ["Summary", "", "", "", ""],
      ["Total Credits", totalCredits, "", "", ""],
      ["Total Points", totalPoints, "", "", ""],
      ["Current Semester GPA", currentGPA ? currentGPA.toFixed(2) : "N/A", "", "", ""]
    ];

    // Add CGPA calculation if available
    if (overallCGPA !== null) {
      summaryRows.push(["", "", "", "", ""]);
      summaryRows.push(["CGPA Calculation", "", "", "", ""]);
      summaryRows.push(["Previous CGPA", previousCGPA, "", "", ""]);
      summaryRows.push(["Previous Credits", previousCredits, "", "", ""]);
      summaryRows.push(["Overall CGPA", overallCGPA.toFixed(2), "", "", ""]);
    }

    // Combine all data
    const wsData = [subjectHeaders, ...subjectData, ...summaryRows];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    const wscols = [
      { wch: 30 }, // Subject Name
      { wch: 10 }, // Credits
      { wch: 10 }, // Grade
      { wch: 15 }, // Grade Points
      { wch: 15 }  // Points Earned
    ];
    ws['!cols'] = wscols;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "CGPA Calculation");

    // Generate file name with date
    const date = new Date();
    const fileName = `CGPA_Calculation_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.xlsx`;

    // Write and download the file
    XLSX.writeFile(wb, fileName);

    showToast("Excel file downloaded successfully!");
  };

  const saveData = () => {
    const data = {
      subjects,
      previousCGPA,
      previousCredits
    };

    localStorage.setItem('cgpaCalculatorData', JSON.stringify(data));
    showToast("Data saved successfully!");
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 animate-fade-in';
    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-fade-out');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  };

  const loadData = () => {
    const savedData = localStorage.getItem('cgpaCalculatorData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setSubjects(data.subjects || []);
      setPreviousCGPA(data.previousCGPA || '');
      setPreviousCredits(data.previousCredits || '');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className={`overflow-x-hidden min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-out {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(10px); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-fade-out { animation: fade-out 0.3s ease-in forwards; }
        .glow { box-shadow: 0 0 15px rgba(99, 102, 241, 0.5); }
      `}</style>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className={`rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>


          <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-indigo-600'} text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calculator size={32} className="text-indigo-200" />
                <h1 className="text-3xl font-bold tracking-tight">CGPA Calculator</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-full ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-yellow-300' : 'bg-indigo-700 hover:bg-indigo-800 text-white'}`}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                  onClick={() => setShowTips(!showTips)}
                  className={`p-2 rounded-full ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-indigo-700 hover:bg-indigo-800'} transition`}
                  title="Show/Hide Tips"
                >
                  <BookOpen size={20} />
                </button>
                <button
                  onClick={saveData}
                  className={`p-2 rounded-full ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-indigo-700 hover:bg-indigo-800'} transition`}
                  title="Save Data"
                >
                  <Save size={20} />
                </button>
              </div>
            </div>
            <p className={`mt-2 ${darkMode ? 'text-indigo-200' : 'text-indigo-100'}`}>
              Calculate your semester GPA and overall CGPA with ease
            </p>
          </div>

          {showTips && (
            <div className={`p-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'} border-l-4 border-indigo-500`}>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                Tips
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Enter your previous CGPA and total credits earned if you want to calculate overall CGPA</li>
                <li>Add all subjects from the current semester</li>
                <li>S grade = 10 points, A grade = 9 points, and so on</li>
                <li>Your data will be saved locally in this browser</li>
                <li>You can download your results as an Excel file for record keeping</li>
              </ul>
            </div>
          )}

          <div className="p-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition`}>
                <label className="block text-sm font-medium mb-1">
                  Previous CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className={`w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                  value={previousCGPA}
                  onChange={(e) => setPreviousCGPA(e.target.value)}
                  placeholder="Enter previous CGPA"
                />
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition`}>
                <label className="block text-sm font-medium mb-1">
                  Previous Credits Earned
                </label>
                <input
                  type="number"
                  min="0"
                  className={`w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                  value={previousCredits}
                  onChange={(e) => setPreviousCredits(e.target.value)}
                  placeholder="Enter total credits earned"
                />
              </div>
            </div>



            {subjects.length > 0 && (
              <div className={`grid grid-cols-12 gap-4 mb-2 text-sm font-medium px-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="col-span-5">Subject Name</div>
                <div className="col-span-3">Credits</div>
                <div className="col-span-3">Grade</div>
                <div className="col-span-1"></div>
              </div>
            )}


            <div className="space-y-3 mb-6">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className={`grid grid-cols-12 gap-4 items-center p-3 rounded-lg transition ${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Subject Name"
                      className={`w-full p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                      value={subject.name}
                      onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      min="0"
                      placeholder="Credits"
                      className={`w-full p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                      value={subject.credits || ''}
                      onChange={(e) => updateSubject(subject.id, 'credits', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      className={`w-full p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                      value={subject.grade}
                      onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)}
                    >
                      {Object.keys(gradePoints).map((grade) => (
                        <option
                          key={grade}
                          value={grade}
                          className={darkMode ? 'bg-gray-700' : ''}
                        >
                          {grade} ({gradePoints[grade]})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => removeSubject(subject.id)}
                      className={`p-2 rounded-full transition ${darkMode ? 'text-red-400 hover:bg-gray-600 hover:text-red-300' : 'text-red-500 hover:bg-red-50 hover:text-red-700'}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>


            <button
              onClick={addSubject}
              className={`flex items-center gap-2 mb-6 py-2.5 px-4 rounded-lg transition ${darkMode ? 'bg-indigo-700 hover:bg-indigo-600 text-white' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'}`}
            >
              <PlusCircle size={20} />
              <span>Add Subject</span>
            </button>


            <button
              onClick={calculateGPA}
              disabled={subjects.length === 0}
              className={`w-full py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition ${subjects.length === 0
                ? `${darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500'} cursor-not-allowed`
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white glow'
                }`}
            >
              <Calculator size={20} />
              <span className="font-medium">Calculate GPA</span>
            </button>


            {currentGPA !== null && (
              <div className={`mt-6 p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-indigo-50'} border ${darkMode ? 'border-gray-600' : 'border-indigo-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Award size={26} className={`${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <h2 className="text-xl font-semibold">Results</h2>
                  </div>

                  <button
                    onClick={downloadExcel}
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg transition ${darkMode ? 'bg-emerald-700 hover:bg-emerald-600 text-white' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                      }`}
                  >
                    <Download size={18} />
                    <span>Export to Excel</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className={`flex justify-between items-center p-4 rounded-md ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                    <p>Current Semester GPA:</p>
                    <p className="text-xl font-bold text-indigo-500">{currentGPA.toFixed(2)}</p>
                  </div>
                  {overallCGPA !== null && (
                    <div className={`flex justify-between items-center p-4 rounded-md ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                      <p>Overall CGPA:</p>
                      <p className="text-xl font-bold text-purple-500">{overallCGPA.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <br></br>
            <div className="tar">
              <div className="cont">
                <Link
                  to="/target"
                  className="p-2 rounded-full transition gap-2 bg-gradient-to-r from-indigo-700 to-purple-700 hover:to-indigo-400 hover:from-purple-600 text-white glow flex items-center justify-center"
                  title="Click here to see the Target GPA Calculator"
                >
                  <Calculator size={20} />
                  <div>Calculate required GPA to achive target</div>
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center text-sm opacity-75">
              Made with ❤️ for students | Data is saved locally in your browser and can be exported as Excel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<CalculatorView />} />
      <Route path="/target" element={<Target />} />
    </Routes>
  );
}

export default App;