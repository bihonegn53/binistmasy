import React, { useState, useEffect } from 'react';
import { addProjectLog } from '../utils/logger';
import { Printer } from 'lucide-react';
const API_BASE_URL = 'http://localhost:5000/api';

// --- ETHIOPIAN CALENDAR CONVERTER ---
const toEthiopianDate = (gregorianDateStr) => {
  if (!gregorianDateStr) return 'N/A';
  const date = new Date(gregorianDateStr);
  if (isNaN(date.getTime())) return gregorianDateStr;

  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  let newYearDay = year % 4 === 3 ? 12 : 11;
  let ethYear = year - 8;
  let ethMonth = 0;
  let ethDay = 0;

  const daysInGregMonths = [0, 31, year % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let dayOfYear = day;
  for (let i = 1; i < month; i++) {
    dayOfYear += daysInGregMonths[i];
  }

  let sep11DayOfYear = year % 4 === 0 ? 255 : 254;
  if (newYearDay === 12) sep11DayOfYear += 1;

  if (dayOfYear >= sep11DayOfYear) {
    ethYear = year - 7;
    let daysDiff = dayOfYear - sep11DayOfYear;
    ethMonth = Math.floor(daysDiff / 30) + 1;
    ethDay = (daysDiff % 30) + 1;
  } else {
    ethYear = year - 8;
    let prevYearSep11 = (year - 1) % 4 === 0 ? 255 : 254;
    let daysDiff = dayOfYear + (365 + ((year - 1) % 4 === 0 ? 1 : 0)) - prevYearSep11;
    ethMonth = Math.floor(daysDiff / 30) + 1;
    ethDay = (daysDiff % 30) + 1;
  }

  return `${String(ethDay).padStart(2, '0')}/${String(ethMonth).padStart(2, '0')}/${ethYear} E.C.`;
};

// --- STYLES ---
const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  boxSizing: 'border-box',
  backgroundColor: '#f8fafc',
  color: '#0f172a',
  border: '1.5px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'all 0.2s ease',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '600',
  color: '#334155',
  marginBottom: '0.35rem',
};

const badgeStyle = {
  display: 'inline-block',
  padding: '0.25rem 0.65rem',
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: '600',
  textTransform: 'capitalize',
};

const initialStudentForm = {
  fullName: '',
  email: '',
  emergencyName: '',
  age: '',
  gender: 'male',
  department: 'computer science',
  program: 'regular',
  startDate: '',
};

export default function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addFormData, setAddFormData] = useState(initialStudentForm);

  const [editingStudent, setEditingStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Server error (${response.status})`);
      }
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[StudentListPage] Fetch error:', err);
      setError(err.message || 'Could not fetch student list from backend.');
    } finally {
      setLoading(false);
    }
  };

  // --- ADD STUDENT ---
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...addFormData,
        age: addFormData.age ? Number(addFormData.age) : null,
      };

      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add student.');
      }

      setStudents((prev) => [data, ...prev]);

      addProjectLog(
        'Added Student',
        `Registered new student ${addFormData.fullName} (${addFormData.email})`,
        'Bini td',
        'Admin',
        'Completed'
      );

      setAddFormData(initialStudentForm);
      setIsAddOpen(false);
    } catch (err) {
      alert(`Add Student Error: ${err.message}`);
    }
  };

  // --- DELETE STUDENT ---
  const handleDelete = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete ${studentName || 'this student'}?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, { method: 'DELETE' });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to delete student.');
      }

      setStudents((prev) => prev.filter((s) => s._id !== studentId));

      addProjectLog('Deleted Student', `Removed student ${studentName || 'Unknown'}`, 'Bini td', 'Admin', 'Completed');
    } catch (err) {
      alert(`Delete Error: ${err.message}`);
    }
  };

  // --- EDIT STUDENT ---
  const handleEditOpen = (student) => {
    setEditingStudent(student);
    setEditFormData({
      fullName: student.fullName || '',
      email: student.email || '',
      emergencyName: student.emergencyName || '',
      age: student.age || '',
      gender: student.gender || 'male',
      department: student.department || 'computer science',
      program: student.program || 'regular',
      startDate: student.startDate || '',
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editFormData,
        age: editFormData.age ? Number(editFormData.age) : null,
      };

      const response = await fetch(`${API_BASE_URL}/students/${editingStudent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update student details.');
      }

      setStudents((prev) => prev.map((s) => (s._id === editingStudent._id ? (data.student || { ...s, ...payload }) : s)));

      addProjectLog('Updated Student', `Updated info for ${editFormData.fullName}`, 'Bini td', 'Admin', 'Completed');
      setEditingStudent(null);
    } catch (err) {
      alert(`Update Error: ${err.message}`);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.emergencyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter ? student.department?.toLowerCase() === departmentFilter.toLowerCase() : true;

    return matchesSearch && matchesDept;
  });

  return (
    <div style={{ maxWidth: '1150px', margin: '2rem auto', padding: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.75rem', fontWeight: '700' }}>Academy Student Management</h2>
          <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Manage and register academy students efficiently</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            color: '#ffffff',
            padding: '0.75rem 1.4rem',
            borderRadius: '10px',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
            transition: 'transform 0.15s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <span style={{ fontSize: '1.1rem' }}>➕</span> Register New Student
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '220px' }}>
          <input
            type="text"
            placeholder="Search by name, email, or emergency contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ flex: 1, minWidth: '180px' }}>
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} style={inputStyle}>
            <option value="">All Departments</option>
            <option value="computer science">Computer Science</option>
            <option value="it">IT</option>
            <option value="nursing">Nursing</option>
            <option value="laboratory">Laboratory</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="management">Management</option>
            <option value="accounting">Accounting</option>
            <option value="teaching">Teaching</option>
            <option value="law">Law</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '3rem' }}>Loading students...</p>
      ) : filteredStudents.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#f8fafc', border: '2px dashed #e2e8f0', borderRadius: '12px', color: '#64748b' }}>
          No students found matching your criteria.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.925rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Full Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Email</th>
                <th style={{ padding: '0.85rem 1rem' }}>Emergency Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Age / Gender</th>
                <th style={{ padding: '0.85rem 1rem' }}>Department</th>
                <th style={{ padding: '0.85rem 1rem' }}>Program</th>
                <th style={{ padding: '0.85rem 1rem' }}>Start Date (E.C.)</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => (
                <tr
                  key={student._id || idx}
                  style={{
                    borderBottom: idx === filteredStudents.length - 1 ? 'none' : '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                  }}
                >
                  <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: '#0f172a' }}>{student.fullName}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{student.email}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155', fontWeight: '500' }}>{student.emergencyName || 'N/A'}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569', textTransform: 'capitalize' }}>
                    {student.age || student.gender ? `${student.age || '-'} (${student.gender || 'N/A'})` : 'N/A'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textTransform: 'capitalize' }}>
                    <span style={{ ...badgeStyle, backgroundColor: '#e0f2fe', color: '#0369a1' }}>{student.department}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textTransform: 'capitalize' }}>
                    <span style={{ ...badgeStyle, backgroundColor: '#f1f5f9', color: '#334155' }}>{student.program}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: '500' }}>{toEthiopianDate(student.startDate)}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => handleEditOpen(student)}
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: '600', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer', marginRight: '0.4rem' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student._id, student.fullName)}
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: '600', borderRadius: '6px', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- ATTRACTIVE ADD STUDENT MODAL --- */}
      {isAddOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '560px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {/* Modal Header */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '1.25rem 1.75rem', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>🎓 Register New Student</h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Fill in the student credentials below</p>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer', padding: '0.2rem' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAddSubmit} style={{ padding: '1.75rem', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Abebe Bikila"
                    value={addFormData.fullName}
                    onChange={(e) => setAddFormData({ ...addFormData, fullName: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={addFormData.email}
                    onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Emergency Contact Name</label>
                  <input
                    type="text"
                    placeholder="Guardian or emergency contact person"
                    value={addFormData.emergencyName}
                    onChange={(e) => setAddFormData({ ...addFormData, emergencyName: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Age</label>
                  <input
                    type="number"
                    placeholder="20"
                    value={addFormData.age}
                    onChange={(e) => setAddFormData({ ...addFormData, age: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Gender</label>
                  <select
                    value={addFormData.gender}
                    onChange={(e) => setAddFormData({ ...addFormData, gender: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Department</label>
                  <select
                    value={addFormData.department}
                    onChange={(e) => setAddFormData({ ...addFormData, department: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="computer science">Computer Science</option>
                    <option value="it">IT</option>
                    <option value="nursing">Nursing</option>
                    <option value="laboratory">Laboratory</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="management">Management</option>
                    <option value="accounting">Accounting</option>
                    <option value="teaching">Teaching</option>
                    <option value="law">Law</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Program</label>
                  <select
                    value={addFormData.program}
                    onChange={(e) => setAddFormData({ ...addFormData, program: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="regular">Regular</option>
                    <option value="extension">Extension</option>
                    <option value="weekend">Weekend</option>
                    <option value="distance">Distance</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={labelStyle}>Start Date *</label>
                    {addFormData.startDate && (
                      <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '600' }}>
                        E.C.: {toEthiopianDate(addFormData.startDate)}
                      </span>
                    )}
                  </div>
                  <input
                    type="date"
                    value={addFormData.startDate}
                    onChange={(e) => setAddFormData({ ...addFormData, startDate: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#16a34a', color: '#ffffff', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px rgba(22, 163, 74, 0.2)' }}
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {editingStudent && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '560px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '1.25rem 1.75rem', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>✏️ Edit Student Details</h3>
              <button onClick={() => setEditingStudent(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ padding: '1.75rem', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" value={editFormData.fullName} onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })} style={inputStyle} required />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} style={inputStyle} required />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Emergency Contact Name</label>
                  <input type="text" value={editFormData.emergencyName} onChange={(e) => setEditFormData({ ...editFormData, emergencyName: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Age</label>
                  <input type="number" value={editFormData.age} onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Gender</label>
                  <select value={editFormData.gender} onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })} style={inputStyle}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Department</label>
                  <select value={editFormData.department} onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })} style={inputStyle}>
                    <option value="computer science">Computer Science</option>
                    <option value="it">IT</option>
                    <option value="nursing">Nursing</option>
                    <option value="laboratory">Laboratory</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="management">Management</option>
                    <option value="accounting">Accounting</option>
                    <option value="teaching">Teaching</option>
                    <option value="law">Law</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Program</label>
                  <select value={editFormData.program} onChange={(e) => setEditFormData({ ...editFormData, program: e.target.value })} style={inputStyle}>
                    <option value="regular">Regular</option>
                    <option value="extension">Extension</option>
                    <option value="weekend">Weekend</option>
                    <option value="distance">Distance</option>
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Start Date</label>
                  <input type="date" value={editFormData.startDate} onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button type="button" onClick={() => setEditingStudent(null)} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '600', cursor: 'pointer' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <button
  onClick={() => window.print()}
  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-all shadow-sm cursor-print"
>
  <Printer className="w-5 h-5" />
  <span>Print Page</span>
</button>
    </div>
    
  );
}