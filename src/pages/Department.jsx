import React, { useState } from 'react';
import { BookOpen, GraduationCap, Clock, Award, Search, CheckCircle } from 'lucide-react';

export default function AcademicPrograms() {
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // የዲፓርትመንቶች እና ኮርሶች መረጃ
  const departments = [
    {
      id: 'cs',
      name: 'Computer Science',
      icon: '💻',
      description: 'Master software engineering, algorithms, artificial intelligence, and modern system design.',
      courses: [
        { code: 'CS101', level: 'Beginner', title: 'Data Structures & Algorithms', duration: '12 Weeks', credits: '4 Credits' },
        { code: 'CS204', level: 'Intermediate', title: 'Full-Stack Web Development', duration: '16 Weeks', credits: '4 Credits' },
        { code: 'CS310', level: 'Advanced', title: 'Artificial Intelligence & Machine Learning', duration: '14 Weeks', credits: '3 Credits' },
      ]
    },
    {
      id: 'it',
      name: 'Information Technology',
      icon: '🌐',
      description: 'Learn cloud computing, cybersecurity, system administration, and enterprise networking.',
      courses: [
        { code: 'IT102', level: 'Beginner', title: 'Network Fundamentals & Security', duration: '10 Weeks', credits: '3 Credits' },
        { code: 'IT220', level: 'Intermediate', title: 'Cloud Infrastructure & DevOps', duration: '12 Weeks', credits: '4 Credits' },
        { code: 'IT305', level: 'Intermediate', title: 'Database Administration (SQL & NoSQL)', duration: '10 Weeks', credits: '3 Credits' },
      ]
    },
    {
      id: 'ds',
      name: 'Data Science & Big Data',
      icon: '📊',
      description: 'Extract actionable insights from massive datasets using Python, data visualization, and predictive modeling.',
      courses: [
        { code: 'DS101', level: 'Beginner', title: 'Python for Data Analytics', duration: '10 Weeks', credits: '3 Credits' },
        { code: 'DS210', level: 'Intermediate', title: 'Applied Statistics & Visualizations', duration: '12 Weeks', credits: '4 Credits' },
        { code: 'DS350', level: 'Advanced', title: 'Deep Learning & Neural Networks', duration: '14 Weeks', credits: '4 Credits' },
      ]
    },
    {
      id: 'design',
      name: 'Graphic & UI/UX Design',
      icon: '🎨',
      description: 'Design intuitive digital experiences, design systems, visual branding, and interactive prototypes.',
      courses: [
        { code: 'DES101', level: 'Beginner', title: 'User Interface (UI) Fundamentals', duration: '8 Weeks', credits: '3 Credits' },
        { code: 'DES205', level: 'Intermediate', title: 'UX Research & Wireframing', duration: '12 Weeks', credits: '4 Credits' },
        { code: 'DES320', level: 'Advanced', title: 'Design Systems & Micro-Animations', duration: '10 Weeks', credits: '3 Credits' },
      ]
    },
    {
      id: 'ece',
      name: 'Electrical & Computer Engineering',
      icon: '⚡',
      description: 'Explore embedded systems, IoT devices, microelectronics, and digital signal processing.',
      courses: [
        { code: 'ECE101', level: 'Beginner', title: 'Circuit Theory & Electronics', duration: '12 Weeks', credits: '4 Credits' },
        { code: 'ECE240', level: 'Intermediate', title: 'Embedded Systems & Microcontrollers', duration: '14 Weeks', credits: '4 Credits' },
        { code: 'ECE330', level: 'Advanced', title: 'Internet of Things (IoT) Engineering', duration: '12 Weeks', credits: '3 Credits' },
      ]
    },
    {
      id: 'acc',
      name: 'Accounting & Finance',
      icon: '📈',
      description: 'Build expertise in financial reporting, corporate auditing, taxation, and cost analysis.',
      courses: [
        { code: 'ACC101', level: 'Beginner', title: 'Principles of Financial Accounting', duration: '12 Weeks', credits: '3 Credits' },
        { code: 'ACC215', level: 'Intermediate', title: 'Managerial Accounting & Costing', duration: '10 Weeks', credits: '3 Credits' },
        { code: 'ACC340', level: 'Advanced', title: 'Auditing & Corporate Taxation', duration: '12 Weeks', credits: '4 Credits' },
      ]
    },
    {
      id: 'mgmt',
      name: 'Management & Business',
      icon: '🏛️',
      description: 'Develop executive leadership, operational efficiency, human resource strategy, and marketing skills.',
      courses: [
        { code: 'MGMT101', level: 'Beginner', title: 'Principles of Business Management', duration: '10 Weeks', credits: '3 Credits' },
        { code: 'MGMT230', level: 'Intermediate', title: 'Organizational Behavior & Leadership', duration: '12 Weeks', credits: '3 Credits' },
      ]
    }
  ];

  // ማጣሪያዎች (Filtering)
  const filteredDepartments = departments.filter(dept => {
    const matchesCategory = selectedDept === 'All' || dept.name === selectedDept;
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dept.courses.some(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 space-y-10 font-sans">
      
      {/* ራስጌ (Header Section) */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-wider uppercase inline-block border border-indigo-100">
          Academic Programs
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900">
          Our Departments & Courses
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Explore industry-aligned academic tracks tailored for academic excellence and modern career growth.
        </p>
      </div>

      {/* የፍለጋ እና የፊልተር አዝራሮች */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* የዲፓርትመንት ፊልተር Tab */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedDept('All')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDept === 'All' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Departments
          </button>
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.name)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDept === dept.name 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept.icon} {dept.name}
            </button>
          ))}
        </div>

        {/* የፍለጋ ሳጥን */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search courses or departments..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-indigo-600 transition-all"
          />
        </div>
      </div>

      {/* የዲፓርትመንቶች እና ኮርሶች ዝርዝር */}
      <div className="space-y-12">
        {filteredDepartments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400 text-sm font-medium">
            No matching departments or courses found.
          </div>
        ) : (
          filteredDepartments.map((dept) => (
            <div key={dept.id} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              
              {/* የዲፓርትመንት ራስጌ */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-indigo-50 text-2xl rounded-2xl border border-indigo-100">
                    {dept.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{dept.name}</h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">{dept.description}</p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold border border-slate-100 self-start">
                  {dept.courses.length} Courses Available
                </span>
              </div>

              {/* የኮርሶች ካርዶች ግሪድ */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dept.courses.map((course, idx) => (
                  <div key={idx} className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-4 hover:border-indigo-200 hover:bg-white transition-all shadow-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-xl text-xs font-black tracking-wide">
                          {course.code}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                          course.level === 'Beginner' ? 'bg-emerald-50 text-emerald-600' :
                          course.level === 'Intermediate' ? 'bg-amber-50 text-amber-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                          {course.level}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 leading-snug">{course.title}</h3>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-indigo-600" /> {course.credits}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}