import React, { useState, useMemo } from 'react';
import { Printer, Search, Award, CheckSquare, Square } from 'lucide-react';

const AssessmentTable = ({ students = [] }) => {
  // ነባሪ ሴሚስተሮች (Props ካልመጡ በራሱ እንዲጠቀማቸው)
  const semestersList = ['Year 1 - Semester 1', 'Year 1 - Semester 2', 'Year 2 - Semester 1', 'Year 2 - Semester 2'];
  
  const [selectedSemester, setSelectedSemester] = useState(semestersList[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [onlyWithRecords, setOnlyWithRecords] = useState(false);

  // ከትክክለኛው የተማሪዎች ዳታ ዲፓርትመንቶችን በራስ-ሰር መምረጥ
  const departments = useMemo(() => {
    const deps = students.map((s) => s.department).filter(Boolean);
    return ['All', ...new Set(deps)];
  }, [students]);

  // ተማሪዎችን ማጣራት
  const filteredStudents = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return students.filter((st) => {
      const matchesSearch = !term || st.fullName?.toLowerCase().includes(term);
      const matchesDep = selectedDepartment === 'All' || st.department === selectedDepartment;
      
      const studentRecord = st.assessments?.[selectedSemester];
      const hasRecords = studentRecord && Object.keys(studentRecord).length > 0;

      if (onlyWithRecords) {
        return matchesSearch && matchesDep && hasRecords;
      }
      return matchesSearch && matchesDep;
    });
  }, [students, searchTerm, selectedDepartment, selectedSemester, onlyWithRecords]);

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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden my-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-400" />
            Dedicated Assessment Matrix Table
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tracking continuous assessment scores exclusively for <span className="text-indigo-300 font-semibold">{selectedSemester}</span>.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Assessment Table</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        {/* Semester Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
            SELECT SEMESTER
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full border border-slate-300 rounded-xl py-2 px-3 text-sm font-semibold text-slate-800 bg-white cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {semestersList.map((sem) => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
            DEPARTMENT FILTER
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full border border-slate-300 rounded-xl py-2 px-3 text-sm font-semibold text-slate-800 bg-white cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {departments.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>

        {/* Search Student */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
            SEARCH STUDENT NAME
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Type name to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Toggle Bar */}
      <div className="px-6 py-3 bg-indigo-50/50 border-b border-slate-200 flex items-center justify-between">
        <button
          onClick={() => setOnlyWithRecords(!onlyWithRecords)}
          className="flex items-center gap-2 text-xs font-bold text-indigo-900 cursor-pointer select-none"
        >
          {onlyWithRecords ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-slate-400" />}
          <span>Show only students with recorded assessment marks for this semester</span>
        </button>
        <span className="text-xs font-semibold text-slate-500">
          Showing {filteredStudents.length} student(s)
        </span>
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-left text-sm text-slate-700 border-collapse">
            <thead className="bg-slate-100 text-slate-800 text-xs uppercase font-extrabold border-b border-slate-200">
              <tr>
                <th className="p-3.5">#</th>
                <th className="p-3.5">STUDENT NAME</th>
                <th className="p-3.5">DEPARTMENT</th>
                <th className="p-3.5 text-center">QUIZ (10%)</th>
                <th className="p-3.5 text-center">ASSIGNMENT (15%)</th>
                <th className="p-3.5 text-center">MID-TERM (25%)</th>
                <th className="p-3.5 text-center">PROJECT (20%)</th>
                <th className="p-3.5 text-center">FINAL (25%)</th>
                <th className="p-3.5 text-center">ATTENDANCE (5%)</th>
                <th className="p-3.5 text-center">TOTAL (100%)</th>
                <th className="p-3.5 text-center">GRADE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-12 text-slate-500 italic">
                    No assessment records found matching your filters. (ተማሪዎችን ወይም ውጤቶቹን ከዳታቤዝ ማምጣትዎን ያረጋግጡ)
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, index) => {
                  const stId = st._id || st.id;
                  const record = st.assessments?.[selectedSemester] || {};
                  return (
                    <tr key={stId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-400 text-xs">{index + 1}</td>
                      <td className="p-3.5 font-bold text-indigo-950 whitespace-nowrap">{st.fullName}</td>
                      <td className="p-3.5 text-slate-600 font-medium whitespace-nowrap">{st.department || 'General'}</td>
                      <td className="p-3.5 text-center font-medium text-slate-600">{record.quiz1 ?? '-'}</td>
                      <td className="p-3.5 text-center font-medium text-slate-600">{record.assignment1 ?? '-'}</td>
                      <td className="p-3.5 text-center font-medium text-slate-600">{record.midTerm ?? '-'}</td>
                      <td className="p-3.5 text-center font-medium text-slate-600">{record.project ?? '-'}</td>
                      <td className="p-3.5 text-center font-medium text-slate-600">{record.finalExam ?? '-'}</td>
                      <td className="p-3.5 text-center font-medium text-slate-600">{record.attendanceScore ?? '-'}</td>
                      <td className="p-3.5 text-center font-black text-slate-900 bg-slate-50/50">{record.totalScore ?? '-'}</td>
                      <td className="p-3.5 text-center">
                        <span className={`inline-block px-3 py-0.5 text-xs font-black rounded-full border ${getGradeBadgeStyle(record.grade || 'N/A')}`}>
                          {record.grade || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssessmentTable;