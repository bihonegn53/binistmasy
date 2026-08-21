import React, { useState, useEffect } from "react";
import { addProjectLog } from "../utils/logger"; // ✅ logger
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Trash2, 
  Edit2, 
  CheckCircle, 
  Clock, 
  X,
  Camera,
  Briefcase,
  Filter,
  FileText,
  Upload,
  Download,
  Paperclip
} from 'lucide-react';

export default function EmployeePage() {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('company_employees');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);

  // Document View Modal States
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docModalEmp, setDocModalEmp] = useState(null);

  // Form State for Add / Edit Employee (Includes documents array)
  const [formData, setFormData] = useState({ 
    name: '', 
    role: '', 
    department: 'Engineering', 
    email: '', 
    phone: '',
    status: 'Active',
    avatar: '',
    documents: [] // 👈 ሰነዶች እዚህ ይያዛሉ
  });

  useEffect(() => {
    localStorage.setItem('company_employees', JSON.stringify(employees));
  }, [employees]);

  const availableRoles = Array.from(
    new Set(employees.map(emp => emp.role).filter(Boolean))
  );

  // Profile Photo Upload Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 📄 Handle Uploading Documents in "Add Employee Modal"
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
        documents: [...prev.documents, newDoc]
      }));
    };

    reader.readAsDataURL(file);
  };

  // Remove uploaded doc before submitting form
  const handleRemoveFormDoc = (docId) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== docId)
    }));
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingEmp(null);
    setFormData({ 
      name: '', 
      role: '', 
      department: 'Engineering', 
      email: '', 
      phone: '', 
      status: 'Active',
      avatar: '',
      documents: [] 
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (emp) => {
    setEditingEmp(emp);
    setFormData({
      name: emp.name || '',
      role: emp.role || '',
      department: emp.department || 'Engineering',
      email: emp.email || '',
      phone: emp.phone || '',
      status: emp.status || 'Active',
      avatar: emp.avatar || '',
      documents: emp.documents || []
    });
    setIsModalOpen(true);
  };

  // Open Document View Modal
  const handleOpenDocModal = (emp) => {
    setDocModalEmp(emp);
    setIsDocModalOpen(true);
  };

  // Filter Employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'All' || emp.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Save / Update Employee
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.email) return;

    if (editingEmp) {
      // ✏️ UPDATE EMPLOYEE
      const updatedList = employees.map(emp => 
        emp.id === editingEmp.id ? { ...emp, ...formData } : emp
      );
      setEmployees(updatedList);

      addProjectLog(
        'Updated Employee',
        `Updated details and documents for ${formData.name}`,
        'Bini td',
        'Admin',
        'Completed'
      );
    } else {
      // ➕ ADD NEW EMPLOYEE
      const addedPerson = {
        id: Date.now(),
        ...formData,
        avatar: formData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name)}`
      };

      setEmployees([addedPerson, ...employees]);

      addProjectLog(
        'Created New Employee',
        `Added employee ${formData.name} with ${formData.documents.length} attached documents`,
        'Bini td',
        'Admin',
        'Completed'
      );
    }

    setIsModalOpen(false);
  };

  // Delete Employee
  const handleDelete = (id) => {
    const empToDelete = employees.find(emp => emp.id === id);
    if (!empToDelete) return;

    if (window.confirm(`Are you sure you want to delete ${empToDelete.name}?`)) {
      setEmployees(employees.filter(emp => emp.id !== id));
      addProjectLog(
        'Deleted Employee',
        `Removed employee ${empToDelete.name}`,
        'Bini td',
        'Admin',
        'Completed'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-10 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="text-blue-500 h-8 w-8" />
            Employee Directory
          </h1>
          <p className="text-slate-400 mt-1">Manage team members, roles, documents, and status.</p>
        </div>

        <button 
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20 cursor-pointer"
        >
          <UserPlus className="h-5 w-5" />
          Add Employee
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1e293b] border border-slate-700/60 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Total Staff</p>
            <p className="text-2xl font-bold mt-1">{employees.length}</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#1e293b] border border-slate-700/60 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Active Now</p>
            <p className="text-2xl font-bold mt-1 text-emerald-400">
              {employees.filter(e => e.status === 'Active').length}
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#1e293b] border border-slate-700/60 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">On Leave</p>
            <p className="text-2xl font-bold mt-1 text-amber-400">
              {employees.filter(e => e.status === 'On Leave').length}
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <Clock className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#1e293b] border border-slate-700/60 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search name, role, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0f172a] border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full sm:w-56 bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Roles / Positions</option>
            {availableRoles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0f172a]/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
              <tr>
                <th className="py-4 px-6">Employee</th>
                <th className="py-4 px-6">Position / Role</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {filteredEmployees.map((emp) => {
                const docCount = emp.documents ? emp.documents.length : 0;
                
                return (
                  <tr key={emp.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img 
                        src={emp.avatar} 
                        alt={emp.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-600 bg-slate-700"
                      />
                      <div>
                        <p className="font-semibold text-slate-100">{emp.name}</p>
                        <p className="text-xs text-slate-400">{emp.email}</p>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-medium text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-blue-400" />
                        {emp.role}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs border border-slate-700">
                        {emp.department}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {emp.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* 📎 View Uploaded Documents Icon */}
                        <button 
                          onClick={() => handleOpenDocModal(emp)}
                          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition relative"
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
                          onClick={() => handleOpenEditModal(emp)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition"
                          title="Edit Employee"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button 
                          onClick={() => handleDelete(emp.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                          title="Delete Employee"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ➕ ADD / EDIT EMPLOYEE MODAL ( includes Document Upload Icon ) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 text-white">
              {editingEmp ? 'Edit Employee' : 'Add New Employee'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Photo Upload */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl p-3 bg-[#0f172a]/50 relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Preview" className="w-14 h-14 rounded-full object-cover border-2 border-blue-500" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-400">
                    <Camera className="h-5 w-5 text-blue-400" />
                    <span className="text-xs">Upload Photo</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Job Position / Role</label>
                <input 
                  type="text" 
                  required
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Department</label>
                <select 
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="HR">HR</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              {/* 📄 ADD DOCUMENT SECTION INSIDE FORM */}
              <div className="pt-2 border-t border-slate-700/60">
                <label className="block text-xs text-slate-400 mb-2 font-medium flex items-center gap-1">
                  <Paperclip className="h-3.5 w-3.5 text-amber-400" />
                  Attach Documents (CV, Certificates, ID)
                </label>

                <div className="border border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-3 bg-[#0f172a]/40 text-center cursor-pointer relative mb-2">
                  <input 
                    type="file" 
                    onChange={handleFormFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <Upload className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-medium text-slate-300">Click to attach file</span>
                  </div>
                </div>

                {/* Show attached documents in form */}
                {formData.documents.length > 0 && (
                  <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                    {formData.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-[#0f172a] border border-slate-700 rounded-lg text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span className="truncate text-slate-300">{doc.name}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveFormDoc(doc.id)}
                          className="text-slate-500 hover:text-red-400 p-0.5"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium"
                >
                  {editingEmp ? 'Update Employee' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📁 VIEW/DOWNLOAD DOCUMENTS MODAL */}
      {isDocModalOpen && docModalEmp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsDocModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Employee Documents</h2>
                <p className="text-xs text-slate-400">{docModalEmp.name} • {docModalEmp.role}</p>
              </div>
            </div>

            {/* View Document List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {docModalEmp.documents && docModalEmp.documents.length > 0 ? (
                docModalEmp.documents.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="flex items-center justify-between p-3 bg-[#0f172a] border border-slate-700/60 rounded-xl"
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
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition"
                      title="Download Document"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs border border-slate-800 rounded-xl bg-[#0f172a]/30">
                  No documents uploaded for this employee yet.
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/60 flex justify-end">
              <button 
                onClick={() => setIsDocModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm"
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