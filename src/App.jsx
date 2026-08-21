import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import Courses from './pages/Courses';
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const status = localStorage.getItem('isAdminLoggedIn');
    if (status === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Login Process
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'Bini td' && password === 'bini@53') {
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
      <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#13091e] to-[#1e1b4b] flex items-center justify-center p-4 text-white">
        <div className="bg-[#0f172a]/90 backdrop-blur-md border border-purple-500/30 w-full max-w-md rounded-2xl p-8 shadow-2xl relative text-center">
          
          {/* Header Section */}
          <div className="pb-6 border-b border-slate-800 mb-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-purple-600/20 text-purple-400 rounded-full flex items-center justify-center mb-3 border border-purple-500/30 shadow-lg shadow-purple-500/20">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-center text-white">Please fill user name and password</h2>
            <p className="text-xs text-slate-400 mt-1 text-center">First login</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 text-center">
                Username
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-slate-400 z-10" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="user name"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 text-center">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 z-10" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 rounded-lg text-sm transition shadow-lg shadow-purple-600/30 text-center active:scale-[0.99]"
            >
              Log in
            </button>
          </form>

        </div>
      </div>
    );
  }

  // ==========================================
  // Main Dashboard & Routes (አድሚን ከተገባ በኋላ)
  // ==========================================
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout onLogout={handleLogout} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/continuous-assessment" element={<ContinuousAssessmentPage />} />
          <Route path="/student-list" element={<StudentList />} />
          <Route path="/Help" element={<Help />} />
          <Route path="/help" element={<Navigate to="/Help" replace />} />
          <Route path="/Other" element={<Other />} />
          <Route path="/Employe" element={<Employe />} />
          <Route path="/Teacher" element={<Teacher />} />
          <Route path="/History" element={<History />} />
          <Route path="/Comment" element={<Comment />} />
          
          {/* Assessment Table Routes with casing alias protection */}
          <Route path="/AssessmentTable" element={<AssessmentTable />} />
          <Route path="/assessment-table" element={<Navigate to="/AssessmentTable" replace />} />

          {/* Alias Redirects for legacy links */}
          <Route path="/User" element={<Navigate to="/Teacher" replace />} />
          <Route path="/ContinuousAssessmentPage" element={<Navigate to="/continuous-assessment" replace />} />
          <Route path="/StudentList" element={<Navigate to="/student-list" replace />} />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;