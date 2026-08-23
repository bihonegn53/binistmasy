import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Shield, 
  Mail, 
  Trash2, 
  Edit3,
  CheckCircle2, 
  XCircle,
  UserPlus,
  X,
  Camera,
  Paperclip,
  FileText,
  Upload,
  Download,
  Phone,
  AlertTriangle
} from 'lucide-react';

export default function TeacherPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add / Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Document View Modal States
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docModalTeacher, setDocModalTeacher] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Computer Science',
    status: 'Active',
    avatar: '',
    emergencyName: '',     
    emergencyPhone: '',    
    documents: []
  });

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/teachers');
      const data = await response.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) =>
    (teacher.fullName || teacher.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.emergencyName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newDoc = {
        id: Date.now(),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type,
        data: reader.result,
        uploadedAt: new Date().toLocaleDateString()
      };

      setFormData(prev => ({
        ...prev,
        documents: [...(prev.documents || []), newDoc]
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveFormDoc = (docId) => {
    setFormData(prev => ({
      ...prev,
      documents: (prev.documents || []).filter(doc => doc.id !== docId)
    }));
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ 
      fullName: '', 
      email: '', 
      role: 'Computer Science', 
      status: 'Active', 
      avatar: '', 
      emergencyName: '', 
      emergencyPhone: '', 
      documents: [] 
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (teacher) => {
    setEditingId(teacher._id || teacher.id);
    setFormData({
      fullName: teacher.fullName || teacher.name || '',
      email: teacher.email || '',
      role: teacher.role || 'Computer Science',
      status: teacher.status || 'Active',
      avatar: teacher.avatar || '',
      emergencyName: teacher.emergencyName || '',
      emergencyPhone: teacher.emergencyPhone || '',
      documents: teacher.documents || []
    });
    setIsModalOpen(true);
  };

  const handleOpenDocModal = (teacher) => {
    setDocModalTeacher(teacher);
    setIsDocModalOpen(true);
  };

  const handleDeleteTeacher = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/teachers/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchTeachers();
        }
      } catch (error) {
        console.error("Error deleting teacher:", error);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    try {
      const url = editingId 
        ? `http://localhost:5000/api/teachers/${editingId}`
        : 'http://localhost:5000/api/teachers';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchTeachers();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error saving teacher:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ 
      fullName: '', 
      email: '', 
      role: 'Computer Science', 
      status: 'Active', 
      avatar: '', 
      emergencyName: '', 
      emergencyPhone: '', 
      documents: [] 
    });
  };

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 p-6 md:p-10 font-sans">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <Users className="text-indigo-400 h-8 w-8" />
            Teacher Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage instructors, academic departments, documents, and faculty records.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-lg text-sm shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Teacher</span>
        </button>
      </div>

      <div className="bg-[#131e3a] border border-slate-700/60 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, department, or emergency contact..."
            className="w-full pl-10 pr-4 py-2 bg-[#0b1329] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-400 w-full md:w-auto justify-between md:justify-end">
          <span>Total: <strong className="text-white">{teachers.length}</strong></span>
          <span>Active: <strong className="text-emerald-400">{teachers.filter(t => t.status === 'Active').length}</strong></span>
        </div>
      </div>

      <div className="bg-[#131e3a] border border-slate-700/60 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0b1329]/60 border-b border-slate-700/80 text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Teacher</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6">Emergency Contact</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => {
                  const docCount = teacher.documents ? teacher.documents.length : 0;
                  const name = teacher.fullName || teacher.name;

                  return (
                    <tr key={teacher._id || teacher.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img 
                          src={teacher.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
                          alt={name} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <p className="font-semibold text-white">{name}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {teacher.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700">
                          <Shield className="h-3 w-3 text-indigo-400" />
                          {teacher.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {/* እዚህ ጋር የድንገተኛ ተጠሪ ስም እና ስልክ ቁጥር በግልጽ እንዲወጣ ተደርጓል */}
                        <p className="font-medium text-slate-200 text-xs">
                          {teacher.emergencyName ? teacher.emergencyName : <span className="text-slate-500 italic">No name provided</span>}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3 text-rose-400" /> 
                          {teacher.emergencyPhone ? teacher.emergencyPhone : <span className="text-slate-500 italic">No phone</span>}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          teacher.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {teacher.status === 'Active' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          {teacher.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleOpenDocModal(teacher)}
                            className="p-1.5 hover:bg-slate-700/60 rounded text-slate-400 hover:text-amber-400 transition relative cursor-pointer"
                            title="View Documents"
                          >
                            <Paperclip className="h-4 w-4" />
                            {docCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {docCount}
                              </span>
                            )}
                          </button>

                          <button 
                            onClick={() => handleEditClick(teacher)}
                            className="p-1.5 hover:bg-slate-700/60 rounded text-slate-400 hover:text-indigo-400 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteTeacher(teacher._id || teacher.id)}
                            className="p-1.5 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-400 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">
                    {loading ? 'Loading teachers...' : 'No teachers found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#131e3a] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Edit Teacher' : 'Add New Teacher'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="relative w-20 h-20 rounded-full border-2 border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center group">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="h-8 w-8 text-slate-500" />
                  )}
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition">
                    <Camera className="h-5 w-5 mb-1 text-indigo-300" />
                    <span className="text-[10px]">Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="user" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <span className="text-xs text-slate-400 mt-2">Click or use camera to upload photo</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Abebe Bikila"
                  className="w-full px-3 py-2 bg-[#0b1329] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="abebe@academy.edu"
                  className="w-full px-3 py-2 bg-[#0b1329] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Emergency Contact Information Section */}
              <div className="p-3 bg-[#0b1329] rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Emergency Contact Information</span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                    placeholder="e.g. Almaz Bekele (Spouse)"
                    className="w-full px-3 py-2 bg-[#131e3a] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Emergency Phone Number</label>
                  <input
                    type="text"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    placeholder="e.g. +251 911 234567"
                    className="w-full px-3 py-2 bg-[#131e3a] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0b1329] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Management">Management</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0b1329] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-medium text-slate-300 mb-2">Attach CV / Documents</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-indigo-300 cursor-pointer transition">
                    <Paperclip className="h-4 w-4" />
                    <span>Upload CV / File</span>
                    <input 
                      type="file" 
                      onChange={handleFormFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>

                {formData.documents && formData.documents.length > 0 && (
                  <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
                    {formData.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between bg-[#0b1329] px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-4 w-4 text-amber-400 shrink-0" />
                          <span className="truncate text-slate-200">{doc.name}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveFormDoc(doc.id)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                >
                  {editingId ? 'Update Teacher' : 'Save Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document View Modal */}
      {isDocModalOpen && docModalTeacher && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#131e3a] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="text-indigo-400 h-5 w-5" />
                Documents for {docModalTeacher.fullName || docModalTeacher.name}
              </h3>
              <button onClick={() => setIsDocModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {docModalTeacher.documents && docModalTeacher.documents.length > 0 ? (
                docModalTeacher.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#0b1329] p-3 rounded-xl border border-slate-700/80">
                    <div className="flex items-center gap-3 truncate">
                      <FileText className="h-6 w-6 text-indigo-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white truncate">{doc.name}</p>
                        <p className="text-xs text-slate-400">{doc.size} • Uploaded on {doc.uploadedAt || 'N/A'}</p>
                      </div>
                    </div>
                    <a 
                      href={doc.data} 
                      download={doc.name}
                      className="p-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-lg transition flex items-center gap-1 text-xs font-medium"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 py-8">No documents attached for this teacher.</p>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 text-right">
              <button
                type="button"
                onClick={() => setIsDocModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}