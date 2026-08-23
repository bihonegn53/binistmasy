import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Department from './pages/Courses';
import HomePage from './pages/HomePage'; // <--- የፋይሉ ትክክለኛ ስም HomePage ተደርጎ ገብቷል
import About from './pages/About';
import ContinuousAssessmentPage from './pages/ContinuousAssessmentPage';
import StudentList from './pages/StudentList';
import Help from './pages/Help';
import Other from './pages/Other';
import Employe from './pages/Employe';
import History from './pages/History';
import AssessmentTable from './pages/AssessmentTable';
import Teacher from './pages/Teacher';
import Comment from './pages/Comment'; 
import './App.css';

const ADMIN_CREDENTIALS = {
  username: 'Bini td',
  password: 'bini@53',
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // የተማሪዎች ዳታ የሚቀመጥበት ስቴት (State)
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const status = localStorage.getItem('isAdminLoggedIn');
    if (status === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Login Process
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      localStorage.setItem('isAdminLoggedIn', 'true');
      setError('');
    } else {
      setError('የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል!');
    }
  };

  // Logout Process
  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#13091e] to-[#1e1b4b] flex items-center justify-center p-4 text-white font-sans">
        <div className="bg-[#0f172a]/90 backdrop-blur-md border border-purple-500/30 w-full max-w-md rounded-3xl p-8 shadow-2xl relative text-center">
          
          <div className="pb-6 border-b border-slate-800/80 mb-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center mb-3 border border-purple-500/30 shadow-lg shadow-purple-500/20">
              <Lock className="w-7 h-7 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-center text-white">Please fill username and password</h2>
            <p className="text-xs text-slate-400 mt-1 text-center">Admin Authentication</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-slate-400 z-10" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 bg-[#1e293b] border border-slate-700/80 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 z-10" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#1e293b] border border-slate-700/80 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-2xl text-sm transition-all shadow-lg shadow-purple-600/30 text-center active:scale-[0.98] cursor-pointer"
            >
              Log in
            </button>
          </form>

        </div>
      </div>
    );
  }

  // ==========================================
  // Main Dashboard & Routes
  // ==========================================
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout onLogout={handleLogout} />}>
          {/* ዳሽቦርዱን በነባሪ (Default) ለማድረግ */}
          <Route path="/" element={<Dashboard students={students} setStudents={setStudents} />} />
          <Route path="/department" element={<Department />} />
          <Route path="/home" element={<HomePage />} /> {/* <--- ትክክለኛው የ HomePage 路线 */}
          <Route path="/about" element={<About />} />
          <Route path="/continuous-assessment" element={<ContinuousAssessmentPage />} />
          <Route path="/student-list" element={<StudentList students={students} setStudents={setStudents} />} />
          <Route path="/help" element={<Help />} />
          <Route path="/other" element={<Other />} />
          <Route path="/employe" element={<Employe />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/history" element={<History />} />
          <Route path="/comment" element={<Comment />} />
          
          {/* Assessment Table Routes */}
          <Route path="/assessment-table" element={<AssessmentTable students={students} />} />

          {/* Legacy & Case-insensitive Redirects */}
          <Route path="/Help" element={<Navigate to="/help" replace />} />
          <Route path="/Other" element={<Navigate to="/other" replace />} />
          <Route path="/Employe" element={<Navigate to="/employe" replace />} />
          <Route path="/Teacher" element={<Navigate to="/teacher" replace />} />
          <Route path="/History" element={<Navigate to="/history" replace />} />
          <Route path="/Comment" element={<Navigate to="/comment" replace />} />
          <Route path="/AssessmentTable" element={<Navigate to="/assessment-table" replace />} />
          <Route path="/User" element={<Navigate to="/teacher" replace />} />
          <Route path="/ContinuousAssessmentPage" element={<Navigate to="/continuous-assessment" replace />} />
          <Route path="/StudentList" element={<Navigate to="/student-list" replace />} />
          <Route path="/Home" element={<Navigate to="/home" replace />} />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}