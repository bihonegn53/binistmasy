import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Award, BookOpen, 
  GraduationCap, CheckCircle2, UserCheck, Briefcase 
} from 'lucide-react';

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // ከሰርቨር የተማሪዎችን፣ የአስተማሪዎችን እና የሰራተኞችን መረጃዎች በአንድ ላይ ማምጣት
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, teachersRes, employeesRes] = await Promise.all([
          fetch('http://localhost:5000/api/students'),
          fetch('http://localhost:5000/api/teachers'),
          fetch('http://localhost:5000/api/employees')
        ]);

        const studentsData = await studentsRes.json();
        const teachersData = await teachersRes.json();
        const employeesData = await employeesRes.json();
        
        // መረጃው በቀጥታ አርራይ ወይም በኦብጀክት ውስጥ እንዳለ አረጋግጦ መውሰድ (Flexible Handling)
        setStudents(Array.isArray(studentsData) ? studentsData : studentsData.students || studentsData.data || []);
        setTeachers(Array.isArray(teachersData) ? teachersData : teachersData.teachers || teachersData.data || []);
        setEmployees(Array.isArray(employeesData) ? employeesData : employeesData.employees || employeesData.data || []);
      } catch (error) {
        console.error("Error fetching data from server:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 1. የተማሪዎች ብዛት እና ዲፓርትመንት ስርጭት
  const studentStats = useMemo(() => {
    const totalStudents = students.length;
    const departmentCounts = {};

    students.forEach((student) => {
      let dept = student.department || student.dept || student.Department || 'Unassigned';
      if (typeof dept === 'string') {
        dept = dept.trim();
      }
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    return { totalStudents, departmentCounts };
  }, [students]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-600 font-bold">
        መረጃዎችን በመጫን ላይ...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-6 md:p-8 space-y-8 font-sans">
      
      {/* ራስጌ (Header) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-indigo-600" /> የአካዳሚክ ማጠቃለያ ዳሽቦርድ (Overview)
          </h1>
          <p className="text-xs text-slate-400 mt-1">ከሰርቨር የተገኙ የተማሪዎች፣ አስተማሪዎች እና ሰራተኞች መረጃዎች ማጠቃለያ።</p>
        </div>
        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold border border-emerald-100">
          ሰርቨር ተገናኝቷል (Server Connected)
        </div>
      </div>

      {/* ዋና ዋና የስታቲስቲክስ ሳጥኖች */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* ጠቅላላ ተማሪዎች */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">ጠቅላላ ተማሪዎች</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{studentStats.totalStudents}</h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-2 inline-block">
              {Object.keys(studentStats.departmentCounts).length} ዲፓርትመንቶች አሉ
            </span>
          </div>
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* አስተማሪዎች (Teachers) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">አስተማሪዎች (Teachers)</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{teachers.length}</h3>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md mt-2 inline-block">
              Registered Instructors
            </span>
          </div>
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* ሰራተኞች (Employees) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">ሰራተኞች (Employees)</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{employees.length}</h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-2 inline-block">
              Staff Members
            </span>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* ዲፓርትመንቶች ብዛት */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">ዲፓርትመንቶች</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{Object.keys(studentStats.departmentCounts).length}</h3>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mt-2 inline-block">Departments</span>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* የዲፓርትመንት ስርጭት እና ማጠቃለያ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">የተማሪዎች ስርጭት በዲፓርትመንት (Students by Department)</h3>
            <p className="text-xs text-slate-400 mt-0.5">ሁሉንም ዲፓርትመንቶች ጨምሮ የተማሪዎች ምጣኔ።</p>
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {Object.keys(studentStats.departmentCounts).length === 0 || studentStats.totalStudents === 0 ? (
              <p className="text-xs text-slate-400">ምንም ዲፓርትመንት ከሰርቨር አልተገኘም።</p>
            ) : (
              Object.entries(studentStats.departmentCounts).map(([dept, count]) => {
                const percentage = studentStats.totalStudents > 0 
                  ? Math.round((count / studentStats.totalStudents) * 100) 
                  : 0;

                return (
                  <div key={dept}>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-700 capitalize">{dept}</span>
                      <span className="text-indigo-600">{percentage}% ({count} ተማሪዎች)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ማጠቃለያ ካርድ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">የሰርቨር ግንኙነት ማጠቃለያ</h3>
            <p className="text-xs text-slate-400 mt-0.5">ከባክኤንድ (Backend API) የተሰበሰቡ መረጃዎች ሁኔታ።</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">የተማሪዎች ዝርዝር</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {studentStats.totalStudents} ተማሪዎች ተጭነዋል
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">የአስተማሪዎች ብዛት</span>
              <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {teachers.length} አስተማሪዎች ተመዝገበዋል
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">የሰራተኞች ብዛት</span>
              <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {employees.length} ሰራተኞች ተመዝገበዋል
              </span>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 text-indigo-700 rounded-2xl text-xs font-medium leading-relaxed">
            💡 ይህ ገጽ አሁን የተማሪዎችን፣ የአስተማሪዎችን እና የሰራተኞችን መረጃዎች ከሰርቨር አቀናጅቶ ያሳያል።
          </div>
        </div>

      </div>

    </div>
  );
}