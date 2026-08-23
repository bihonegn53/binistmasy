import React, { useState, useEffect } from 'react';
import { Printer, Award } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const AssessmentTable = ({ students: propStudents = [] }) => {
  const [students, setStudents] = useState(propStudents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const semestersList = ['Year 1 - Semester 1', 'Year 1 - Semester 2', 'Year 2 - Semester 1', 'Year 2 - Semester 2'];

  useEffect(() => {
    if (propStudents.length === 0) {
      const fetchAssessmentStudents = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`${API_BASE_URL}/students`);
          if (!response.ok) {
            throw new Error(`Server error (${response.status})`);
          }
          const data = await response.json();
          setStudents(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('[AssessmentTable] Fetch error:', err);
          setError(err.message || 'Could not fetch student records.');
        } finally {
          setLoading(false);
        }
      };

      fetchAssessmentStudents();
    } else {
      setStudents(propStudents);
    }
  }, [propStudents]);

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
      
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            border: 1px solid #cbd5e1 !important;
            padding: 0.4rem !important;
            font-size: 10px !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-400" />
            Students Assessment Records (All Semesters)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Displaying continuous assessment scores for all academic years and semesters.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="no-print px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Table</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 text-xs border-b border-rose-200">
          {error}
        </div>
      )}

      <div className="no-print p-4 bg-slate-50 border-b border-slate-200 flex justify-end">
        <span className="text-xs font-semibold text-slate-500">
          Total Students: {students.length}
        </span>
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-100 text-slate-800 uppercase font-extrabold border-b border-slate-200">
              <tr>
                <th className="p-3 border-r">#</th>
                <th className="p-3 border-r">STUDENT NAME</th>
                <th className="p-3 border-r">DEPARTMENT</th>
                {semestersList.map((sem) => (
                  <th key={sem} className="p-3 text-center border-r bg-indigo-50/50" colSpan="4">
                    {sem}
                  </th>
                ))}
              </tr>
              <tr className="bg-slate-50 text-[10px] text-slate-600 border-b">
                <th className="p-2 border-r"></th>
                <th className="p-2 border-r"></th>
                <th className="p-2 border-r"></th>
                {semestersList.map((sem) => (
                  <React.Fragment key={sem}>
                    <th className="p-2 text-center border-r">Total</th>
                    <th className="p-2 text-center border-r">Grade</th>
                    <th className="p-2 text-center border-r">Conduct</th>
                    <th className="p-2 text-center border-r">Action</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="19" className="text-center py-12 text-slate-500 italic">
                    Loading student records...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="19" className="text-center py-12 text-slate-500 italic">
                    No student records found.
                  </td>
                </tr>
              ) : (
                students.map((st, index) => {
                  const stId = st._id || st.id;
                  return (
                    <tr key={stId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-400 border-r">{index + 1}</td>
                      <td className="p-3 font-bold text-indigo-950 whitespace-nowrap border-r">{st.fullName}</td>
                      <td className="p-3 text-slate-600 font-medium whitespace-nowrap border-r">{st.department || 'General'}</td>
                      
                      {semestersList.map((sem) => {
                        const record = st.assessments?.[sem] || {};
                        return (
                          <React.Fragment key={sem}>
                            <td className="p-3 text-center font-black text-slate-900 border-r bg-slate-50/30">
                              {record.totalScore !== undefined ? `${record.totalScore}` : '-'}
                            </td>
                            <td className="p-3 text-center border-r">
                              <span className={`inline-block px-2 py-0.5 text-[10px] font-black rounded-full border ${getGradeBadgeStyle(record.grade || 'N/A')}`}>
                                {record.grade || 'N/A'}
                              </span>
                            </td>
                            <td className="p-3 text-center border-r text-slate-600">
                              {record.conduct || 'Exc.'}
                            </td>
                            <td className="no-print p-3 text-center border-r whitespace-nowrap">
                              <button
                                onClick={() => alert(`Edit ${sem} record for ${st.fullName}`)}
                                className="px-2 py-1 text-[10px] font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded transition-all cursor-pointer"
                              >
                                Edit
                              </button>
                            </td>
                          </React.Fragment>
                        );
                      })}
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