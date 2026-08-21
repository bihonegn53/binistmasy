import React, { useState, useEffect } from 'react';
import { addProjectLog } from "../utils/logger"; // ✅ logger
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
  Download
} from 'lucide-react';

export default function TeacherPage() {
  const initialTeachers = [
    {
      id: 1,
      name: 'Abebe Bikila',
      email: 'abebe.b@academy.edu',
      role: 'Computer Science',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      documents: []
    },
    {
      id: 2,
      name: 'Sarah Jenkins',
      email: 'sarah.j@academy.edu',
      role: 'Accounting',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      documents: []
    }
  ];

  const [teachers, setTeachers] = useState(() => {
    const savedData = localStorage.getItem('teachers_data');
    return savedData ? JSON.parse(savedData) : initialTeachers;
  });

  const [searchTerm, setSearchTerm] = useState('');
  
  // Add / Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Document View Modal States
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docModalTeacher, setDocModalTeacher] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Computer Science',
    status: 'Active',
    avatar: '',
    documents: [] // 👈 Document list for state
  });

  // Save to localStorage automatically on any change
  useEffect(() => {
    localStorage.setItem('teachers_data', JSON.stringify(teachers));
  }, [teachers]);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📄 Handle Uploading Documents inside Form Modal
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

  // Remove uploaded doc before submitting form
  const handleRemoveFormDoc = (docId) => {
    setFormData(prev => ({
      ...prev,
      documents: (prev.documents || []).filter(doc => doc.id !== docId)
    }));
  };

  // Open modal in "Add" mode
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', role: 'Computer Science', status: 'Active', avatar: '', documents: [] });
    setIsModalOpen(true);
  };

  // Open modal in "Edit" mode with existing teacher data
  const handleEditClick = (teacher) => {
    setEditingId(teacher.id);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      role: teacher.role,
      status: teacher.status,
      avatar: teacher.avatar,
      documents: teacher.documents || []
    });
    setIsModalOpen(true);
  };

  // Open View Documents Modal
  const handleOpenDocModal = (teacher) => {
    setDocModalTeacher(teacher);
    setIsDocModalOpen(true);
  };

  const handleDeleteTeacher = (id) => {
    const teacherToDelete = teachers.find(t => t.id === id);

    if (window.confirm('Are you sure you want to delete this teacher?')) {
      const updatedList = teachers.filter(t => t.id !== id);
      setTeachers(updatedList);

      if (teacherToDelete) {
        addProjectLog(
          'Deleted Teacher',
          `Removed teacher ${teacherToDelete.name} (${teacherToDelete.email})`,
          'Bini td',
          'Admin',
          'Completed'
        );
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

  // Handle both Add and Update actions
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingId) {
      // EDIT MODE: Update existing teacher
      const updatedTeachers = teachers.map((t) => {
        if (t.id === editingId) {
          return {
            ...t,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: formData.status,
            avatar: formData.avatar || t.avatar,
            documents: formData.documents || []
          };
        }
        return t;
      });
      setTeachers(updatedTeachers);

      addProjectLog(
        'Updated Teacher',
        `Updated info for ${formData.name} (${formData.email})`,
        'Bini td',
        'Admin',
        'Completed'
      );
    } else {
      // ADD MODE: Create new teacher
      const newTeacher = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        avatar: formData.avatar || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150`,
        documents: formData.documents || []
      };
      setTeachers([newTeacher, ...teachers]);

      addProjectLog(
        'Created New Teacher',
        `Added teacher ${formData.name} (${formData.email}) as ${formData.role} with ${formData.documents.length} attached documents`,
        'Bini td',
        'Admin',
        'Completed'
      );
    }
    
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', email: '', role: 'Computer Science', status: 'Active', avatar: '', documents: [] });
  };

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 p-6 md:p-10 font-sans">
      
      {/* Header */}
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
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-lg text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Control Bar (Search & Stats) */}
      <div className="bg-[#131e3a] border border-slate-700/60 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or department..."
            className="w-full pl-10 pr-4 py-2 bg-[#0b1329] border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-400 w-full md:w-auto justify-between md:justify-end">
          <span>Total: <strong className="text-white">{teachers.length}</strong></span>
          <span>Active: <strong className="text-emerald-400">{teachers.filter(t => t.status === 'Active').length}</strong></span>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-[#131e3a] border border-slate-700/60 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0b1329]/60 border-b border-slate-700/80 text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Teacher</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => {
                  const docCount = teacher.documents ? teacher.documents.length : 0;

                  return (
                    <tr key={teacher.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img 
                          src={teacher.avatar} 
                          alt={teacher.name} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <p className="font-semibold text-white">{teacher.name}</p>
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
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          teacher.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {teacher.status === 'Active' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          {teacher.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          
                          {/* 📎 Document Storage & View Button */}
                          <button 
                            onClick={() => handleOpenDocModal(teacher)}
                            className="p-1.5 hover:bg-slate-700/60 rounded text-slate-400 hover:text-amber-400 transition relative cursor-pointer"
                            title="View / Download Documents"
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
                            title="Edit Teacher"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            className="p-1.5 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-400 transition cursor-pointer"
                            title="Delete Teacher"
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
                  <td colSpan="4" className="text-center py-12 text-slate-400">
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#131e3a] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Edit Teacher' : 'Add New Teacher'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Image Upload UI */}
              <div className="flex flex-col items-center justify-center mb-2">
                <label className="relative cursor-pointer group flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-600 bg-[#0b1329] flex items-center justify-center overflow-hidden relative group-hover:border-indigo-500 transition-colors">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 mt-2 group-hover:text-indigo-400 transition-colors">
                    {formData.avatar ? 'Change Photo' : 'Upload Photo'}
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Abebe"
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

              {/* 📄 ATTACH DOCUMENTS SECTION */}
              <div className="pt-3 border-t border-slate-800">
                <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                  <Paperclip className="h-3.5 w-3.5 text-amber-400" />
                  Attach Documents (CV, Degree, ID, Certificates)
                </label>

                <div className="border border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-3 bg-[#0b1329]/50 text-center cursor-pointer relative mb-2 transition">
                  <input 
                    type="file" 
                    onChange={handleFormFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <Upload className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-medium text-slate-300">Click to upload document</span>
                  </div>
                </div>

                {/* List Attached Documents inside Form */}
                {formData.documents && formData.documents.length > 0 && (
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                    {formData.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-[#0b1329] border border-slate-700/80 rounded-lg text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span className="truncate text-slate-200">{doc.name}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveFormDoc(doc.id)}
                          className="text-slate-500 hover:text-rose-400 p-0.5 transition"
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
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  {editingId ? 'Update Teacher' : 'Save Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📁 VIEW/DOWNLOAD DOCUMENTS MODAL */}
      {isDocModalOpen && docModalTeacher && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#131e3a] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsDocModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Teacher Documents</h2>
                <p className="text-xs text-slate-400">{docModalTeacher.name} • {docModalTeacher.role}</p>
              </div>
            </div>

            {/* List of Attached Documents */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {docModalTeacher.documents && docModalTeacher.documents.length > 0 ? (
                docModalTeacher.documents.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="flex items-center justify-between p-3 bg-[#0b1329] border border-slate-700/60 rounded-xl"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-5 w-5 text-amber-400 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-medium text-slate-200 truncate">{doc.name}</p>
                        <p className="text-[10px] text-slate-500">{doc.size} • {doc.uploadedAt}</p>
                      </div>
                    </div>

                    <a 
                      href={doc.data} 
                      download={doc.name}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
                      title="Download Document"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs border border-slate-800 rounded-xl bg-[#0b1329]/40">
                  No documents attached for this teacher yet.
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setIsDocModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm transition cursor-pointer"
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