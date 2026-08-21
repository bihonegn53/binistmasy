import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Printer } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const semestersList = [
  'Year 1 - Semester 1',
  'Year 1 - Semester 2',
  'Year 2 - Semester 1',
  'Year 2 - Semester 2',
  'Year 3 - Semester 1',
  'Year 3 - Semester 2',
  'Year 4 - Semester 1',
  'Year 4 - Semester 2',
];

const getGradeBadgeStyle = (grade) => {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'A-':
    case 'B+':
    case 'B':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'B-':
    case 'C+':
    case 'C':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'F':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-300';
  }
};

const ContinuousAssessmentPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYearFilter, setSelectedYearFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [semesterSearch, setSemesterSearch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('Year 1 - Semester 1');

  const [assessmentData, setAssessmentData] = useState({
    quiz1: '',
    assignment1: '',
    midTerm: '',
    project: '',
    finalExam: '',
    attendanceScore: '',
    rank: '',
    conductRating: 'Excellent',
    teacherObservations: '',
  });

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchStudents();
    }
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      if (!response.ok) {
        throw new Error('Failed to fetch students list from server.');
      }
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return students.filter((st) => {
      const fullName = st?.fullName ? st.fullName.toLowerCase() : '';
      const matchesSearch = !term || fullName.includes(term);

      const matchesYear =
        selectedYearFilter === 'All' ||
        st?.year === selectedYearFilter ||
        st?.academicYear === selectedYearFilter;

      return matchesSearch && matchesYear;
    });
  }, [students, searchTerm, selectedYearFilter]);

  useEffect(() => {
    const term = searchTerm.trim();
    if (!term) return;

    if (filteredStudents.length > 0) {
      const currentId = selectedStudent?._id || selectedStudent?.id;
      const exists = filteredStudents.some((s) => (s._id || s.id) === currentId);

      if (!exists) {
        setSelectedStudent(filteredStudents[0]);
      }
    } else {
      setSelectedStudent(null);
    }
  }, [searchTerm, filteredStudents]);

  const filteredSemesters = useMemo(() => {
    return semestersList.filter((sem) =>
      sem.toLowerCase().includes(semesterSearch.trim().toLowerCase())
    );
  }, [semesterSearch]);

  useEffect(() => {
    if (selectedStudent && selectedStudent.assessments?.[selectedSemester]) {
      const data = selectedStudent.assessments[selectedSemester];
      setAssessmentData({
        quiz1: data.quiz1 ?? '',
        assignment1: data.assignment1 ?? '',
        midTerm: data.midTerm ?? '',
        project: data.project ?? '',
        finalExam: data.finalExam ?? '',
        attendanceScore: data.attendanceScore ?? '',
        rank: data.rank ?? '',
        conductRating: data.conductRating || 'Excellent',
        teacherObservations: data.teacherObservations || '',
      });
    } else {
      setAssessmentData({
        quiz1: '',
        assignment1: '',
        midTerm: '',
        project: '',
        finalExam: '',
        attendanceScore: '',
        rank: '',
        conductRating: 'Excellent',
        teacherObservations: '',
      });
    }
  }, [selectedStudent, selectedSemester]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssessmentData((prev) => ({ ...prev, [name]: value }));
  };

  const quiz = Number(assessmentData.quiz1) || 0;
  const assignment = Number(assessmentData.assignment1) || 0;
  const mid = Number(assessmentData.midTerm) || 0;
  const project = Number(assessmentData.project) || 0;
  const final = Number(assessmentData.finalExam) || 0;
  const attendance = Number(assessmentData.attendanceScore) || 0;

  const totalScore = quiz + assignment + mid + project + final + attendance;

  const calculateGrade = (score) => {
    const hasAnyValue = Object.keys(assessmentData).some(
      (k) => k !== 'conductRating' && k !== 'teacherObservations' && k !== 'rank' && assessmentData[k] !== ''
    );

    if (!hasAnyValue && score === 0) return 'N/A';
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 50) return 'C';
    return 'F';
  };

  const currentGrade = calculateGrade(totalScore);

  const handleUpdate = async () => {
    if (!selectedStudent) {
      alert('እባክዎን አስቀድመው ተማሪ ይምረጡ!');
      return;
    }

    const studentId = selectedStudent._id || selectedStudent.id;
    const updatedAssessments = {
      ...(selectedStudent.assessments || {}),
      [selectedSemester]: {
        ...assessmentData,
        totalScore,
        grade: currentGrade,
      },
    };

    const updatedStudentData = {
      ...selectedStudent,
      assessments: updatedAssessments,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudentData),
      });

      if (!response.ok) {
        throw new Error('መረጃውን ማስቀመጥ አልተቻለም።');
      }

      const savedStudent = await response.json();
      const refreshedStudent = savedStudent.fullName ? savedStudent : updatedStudentData;

      setSelectedStudent(refreshedStudent);
      setStudents((prev) =>
        prev.map((s) => ((s._id || s.id) === studentId ? refreshedStudent : s))
      );

      alert(`ማርክ በተሳካ ሁኔታ ተመዝግቧል: ${selectedStudent.fullName} [${selectedSemester}]`);
    } catch (err) {
      alert(`የስህተት መልዕክት: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 bg-slate-50 min-h-screen font-sans">
      <style>{`
        @media print {
          header, 
          nav, 
          aside, 
          button, 
          input, 
          select,
          .sidebar-menu {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          body * {
            visibility: hidden;
          }
          .printable-assessment-section, 
          .printable-assessment-section * {
            visibility: visible;
          }
          .printable-assessment-section {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            border: 1px solid #cbd5e1 !important;
            color: #000 !important;
            padding: 8px !important;
          }
        }
      `}</style>

      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center"
            title="Go Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-200 text-lg">
                📊
              </span>
              Continuous Assessment Tracker
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Record, analyze, and manage student performance and semester metrics seamlessly.
            </p>
          </div>
        </div>
      </header>

      <main className="space-y-8">
        {/* SECTION 1: SEARCH & FILTER STUDENT */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-black">
                1
              </span>
              Search & Select Student
            </h2>
            {selectedStudent && (
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setSearchTerm('');
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer border border-slate-300 flex items-center gap-1.5"
              >
                <span>✕</span> Clear Selection
              </button>
            )}
          </div>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-sm border border-rose-200 flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Type Student Name
              </label>
              <input
                type="text"
                placeholder="Search student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-slate-300 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-slate-900 font-medium placeholder-slate-400 bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Filter by Academic Year
              </label>
              <select
                value={selectedYearFilter}
                onChange={(e) => setSelectedYearFilter(e.target.value)}
                className="w-full border border-slate-300 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-slate-800 font-medium bg-white cursor-pointer transition-all"
              >
                <option value="All">All Years</option>
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Select Matching Student ({filteredStudents.length} found)
              </label>
              <select
                value={selectedStudent?._id || selectedStudent?.id || ''}
                onChange={(e) => {
                  const found = students.find((s) => (s._id || s.id) === e.target.value);
                  setSelectedStudent(found || null);
                }}
                disabled={loading || filteredStudents.length === 0}
                className="w-full border border-slate-300 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-slate-800 font-medium bg-white cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
              >
                <option value="">-- Choose a student --</option>
                {loading ? (
                  <option value="">Loading students list...</option>
                ) : filteredStudents.length === 0 ? (
                  <option value="">No matching student found</option>
                ) : (
                  filteredStudents.map((st) => {
                    const stId = st._id || st.id;
                    return (
                      <option key={stId} value={stId}>
                        {st.fullName} — ({st.department || 'General'})
                      </option>
                    );
                  })
                )}
              </select>
            </div>
          </div>
        </section>

        {/* SELECTED STUDENT PANEL & MARKS ENTRY */}
        {selectedStudent && (
          <>
            <section className="bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-indigo-700/40">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 text-white font-black text-2xl flex items-center justify-center shadow-inner">
                  {selectedStudent.fullName ? selectedStudent.fullName.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-white">{selectedStudent.fullName}</h3>
                  <div className="flex flex-wrap gap-4 text-xs text-indigo-200">
                    <span>✉️ {selectedStudent.email}</span>
                    <span>🏛️ {selectedStudent.department || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto space-y-2 bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider">
                  Academic Semester Selection
                </label>
                <input
                  type="text"
                  placeholder="Filter semesters..."
                  value={semesterSearch}
                  onChange={(e) => setSemesterSearch(e.target.value)}
                  className="w-full md:w-72 border border-indigo-300/30 rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-white/50 outline-none text-xs text-white placeholder-indigo-300 bg-black/20 mb-1"
                />
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full md:w-72 border-2 border-indigo-400 bg-indigo-950 text-white font-semibold rounded-lg py-2 px-3 focus:outline-none text-sm cursor-pointer shadow-sm"
                >
                  {filteredSemesters.length === 0 ? (
                    <option value="">No semester matches</option>
                  ) : (
                    filteredSemesters.map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Assessment Scores — <span className="text-indigo-600">{selectedSemester}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Quiz 1 (10%)
                    <input
                      type="number"
                      name="quiz1"
                      value={assessmentData.quiz1}
                      onChange={handleInputChange}
                      placeholder="e.g. 8"
                      className="mt-1.5 block w-full border border-slate-300 rounded-xl py-2 px-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-semibold text-slate-900 placeholder-slate-400 bg-slate-50/50"
                    />
                  </label>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Assignment 1 (15%)
                    <input
                      type="number"
                      name="assignment1"
                      value={assessmentData.assignment1}
                      onChange={handleInputChange}
                      placeholder="e.g. 12"
                      className="mt-1.5 block w-full border border-slate-300 rounded-xl py-2 px-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-semibold text-slate-900 placeholder-slate-400 bg-slate-50/50"
                    />
                  </label>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Mid-Term Exam (25%)
                    <input
                      type="number"
                      name="midTerm"
                      value={assessmentData.midTerm}
                      onChange={handleInputChange}
                      placeholder="e.g. 20"
                      className="mt-1.5 block w-full border border-slate-300 rounded-xl py-2 px-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-semibold text-slate-900 placeholder-slate-400 bg-slate-50/50"
                    />
                  </label>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Project (20%)
                    <input
                      type="number"
                      name="project"
                      value={assessmentData.project}
                      onChange={handleInputChange}
                      placeholder="e.g. 18"
                      className="mt-1.5 block w-full border border-slate-300 rounded-xl py-2 px-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-semibold text-slate-900 placeholder-slate-400 bg-slate-50/50"
                    />
                  </label>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Final Exam (25%)
                    <input
                      type="number"
                      name="finalExam"
                      value={assessmentData.finalExam}
                      onChange={handleInputChange}
                      placeholder="e.g. 22"
                      className="mt-1.5 block w-full border border-slate-300 rounded-xl py-2 px-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-semibold text-slate-900 placeholder-slate-400 bg-slate-50/50"
                    />
                  </label>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Attendance (5%)
                    <input
                      type="number"
                      name="attendanceScore"
                      value={assessmentData.attendanceScore}
                      onChange={handleInputChange}
                      placeholder="e.g. 5"
                      className="mt-1.5 block w-full border border-slate-300 rounded-xl py-2 px-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-semibold text-slate-900 placeholder-slate-400 bg-slate-50/50"
                    />
                  </label>
                </div>

                <div className="bg-slate-900 text-white p-5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-center shadow-inner">
                  <div className="border-r border-slate-800 last:border-r-0">
                    <span className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                      Total Score
                    </span>
                    <span className="text-2xl font-black text-white">{totalScore} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
                  </div>
                  <div className="border-r border-slate-800 last:border-r-0">
                    <span className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                      Average %
                    </span>
                    <span className="text-2xl font-black text-indigo-400">{totalScore}%</span>
                  </div>
                  <div className="border-r border-slate-800 last:border-r-0">
                    <span className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                      Grade
                    </span>
                    <span className="text-2xl font-black text-emerald-400">{currentGrade}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                      Rank
                    </span>
                    <input
                      type="text"
                      name="rank"
                      value={assessmentData.rank}
                      onChange={handleInputChange}
                      placeholder="e.g. 1st / 40"
                      className="w-full text-center border border-slate-700 rounded-lg bg-slate-800 py-1 text-xs font-bold text-white outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
              </div>

              <aside className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Behavioral Data
                  </h3>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Conduct Rating
                    <select
                      name="conductRating"
                      value={assessmentData.conductRating}
                      onChange={handleInputChange}
                      className="mt-1.5 block w-full border border-slate-300 rounded-xl py-2 px-3 outline-none text-sm font-semibold text-slate-900 bg-slate-50/50 cursor-pointer"
                    >
                      <option value="Excellent">🌟 Excellent</option>
                      <option value="Good">👍 Good</option>
                      <option value="Needs Improvement">⚠️ Needs Improvement</option>
                    </select>
                  </label>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Teacher Observations
                    <textarea
                      name="teacherObservations"
                      value={assessmentData.teacherObservations}
                      onChange={handleInputChange}
                      placeholder="Enter notes on student progress, attitude, etc..."
                      className="mt-1.5 block w-full border border-slate-300 rounded-xl py-2 px-3 outline-none text-sm text-slate-900 bg-slate-50/50 h-32 resize-none placeholder-slate-400 focus:border-indigo-500"
                    ></textarea>
                  </label>
                </div>
              </aside>
            </section>

            <div className="flex items-center justify-end space-x-4 pt-2">
              <button
                onClick={handleUpdate}
                className="px-8 py-3 text-sm rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2 transform active:scale-95"
              >
                <span>💾</span> Update & Save Student Details
              </button>
            </div>
          </>
        )}

        {/* SECTION 4: ASSESSMENTS / ALL STUDENTS TABLE WITH PRINT BUTTON */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden printable-assessment-section">
          <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>📋</span>
                {selectedStudent
                  ? `Tracked Assessments — ${selectedStudent.fullName}`
                  : 'All Registered Students & Assessment Status'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {selectedStudent
                  ? 'Historical overview of recorded continuous assessment scores for this student.'
                  : 'Overview of all students in the database. Select a student above to manage or enter marks.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Table</span>
              </button>

              <span className="text-xs font-extrabold bg-indigo-500/20 text-indigo-300 px-3.5 py-1.5 rounded-full border border-indigo-400/30 backdrop-blur-md">
                {selectedStudent
                  ? `${Object.keys(selectedStudent.assessments || {}).length} Semester(s)`
                  : `${filteredStudents.length} Student(s)`}
              </span>
            </div>
          </div>

          <div className="p-6">
            {selectedStudent ? (
              !selectedStudent.assessments || Object.keys(selectedStudent.assessments).length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm italic bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <span className="text-2xl block mb-2">📥</span>
                  No tracked assessments found for this student yet. Enter scores above and click "Update & Save".
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                  <table className="w-full text-left text-sm text-slate-700 border-collapse">
                    <thead className="bg-slate-100 text-slate-800 text-xs uppercase font-extrabold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Semester</th>
                        <th className="p-3.5 text-center">Quiz (10)</th>
                        <th className="p-3.5 text-center">Assign (15)</th>
                        <th className="p-3.5 text-center">Mid (25)</th>
                        <th className="p-3.5 text-center">Project (20)</th>
                        <th className="p-3.5 text-center">Final (25)</th>
                        <th className="p-3.5 text-center">Att. (5)</th>
                        <th className="p-3.5 text-center">Total Score</th>
                        <th className="p-3.5 text-center">Grade</th>
                        <th className="p-3.5 text-center">Conduct</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {Object.entries(selectedStudent.assessments).map(([semKey, record]) => (
                        <tr key={semKey} className="hover:bg-indigo-50/40 transition-colors">
                          <td className="p-3.5 font-bold text-indigo-950 whitespace-nowrap flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                            {semKey}
                          </td>
                          <td className="p-3.5 text-center font-medium text-slate-600">{record.quiz1 ?? '-'}</td>
                          <td className="p-3.5 text-center font-medium text-slate-600">{record.assignment1 ?? '-'}</td>
                          <td className="p-3.5 text-center font-medium text-slate-600">{record.midTerm ?? '-'}</td>
                          <td className="p-3.5 text-center font-medium text-slate-600">{record.project ?? '-'}</td>
                          <td className="p-3.5 text-center font-medium text-slate-600">{record.finalExam ?? '-'}</td>
                          <td className="p-3.5 text-center font-medium text-slate-600">{record.attendanceScore ?? '-'}</td>
                          <td className="p-3.5 text-center font-black text-slate-900 whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200">
                              {record.totalScore ?? 0} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <span className={`inline-block px-3 py-1 text-xs font-black rounded-full border ${getGradeBadgeStyle(record.grade)}`}>
                              {record.grade || 'N/A'}
                            </span>
                          </td>
                          <td className="p-3.5 text-center text-xs font-semibold whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                              {record.conductRating || '-'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => setSelectedSemester(semKey)}
                              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors cursor-pointer border border-indigo-200"
                            >
                              Edit Semester
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              /* DISPLAY ALL REGISTERED STUDENTS TABLE WHEN NO INDIVIDUAL STUDENT IS SELECTED */
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full text-left text-sm text-slate-700 border-collapse">
                  <thead className="bg-slate-100 text-slate-800 text-xs uppercase font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Full Name</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5 text-center">Academic Year</th>
                      <th className="p-3.5 text-center">Tracked Semesters</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-slate-500 text-sm italic">
                          No students found in the registry.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((st) => {
                        const stId = st._id || st.id;
                        const semesterCount = Object.keys(st.assessments || {}).length;
                        return (
                          <tr key={stId} className="hover:bg-indigo-50/40 transition-colors">
                            <td className="p-3.5 font-bold text-indigo-950 flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                              {st.fullName}
                            </td>
                            <td className="p-3.5 text-slate-600">{st.email || 'N/A'}</td>
                            <td className="p-3.5 text-slate-600">{st.department || 'General'}</td>
                            <td className="p-3.5 text-center font-semibold text-slate-700">
                              {st.year || st.academicYear || 'Year 1'}
                            </td>
                            <td className="p-3.5 text-center">
                              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-200 text-xs">
                                {semesterCount} Semester{semesterCount === 1 ? '' : 's'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap">
                              <button
                                onClick={() => setSelectedStudent(st)}
                                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
                              >
                                Manage Marks
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContinuousAssessmentPage;