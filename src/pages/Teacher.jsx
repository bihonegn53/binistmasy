import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Briefcase, 
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
  Download,
  Phone,
  AlertTriangle,
  Building
} from 'lucide-react';

const API_BASE_URL = "https://binistmasy-1.onrender.com";

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add / Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Document View Modal States
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docModalEmployee, setDocModalEmployee] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: 'Engineering',
    jobTitle: 'Software Engineer',
    status: 'Active',
    avatar: '',
    emergencyName: '',     
    emergencyPhone: '',    
    documents: []
  });

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees`);
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    (emp.fullName || emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.emergencyName || '').toLowerCase().includes(searchTerm.toLowerCase())
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
      department: 'Engineering', 
      jobTitle: 'Software Engineer',
      status: 'Active', 
      avatar: '', 
      emergencyName: '', 
      emergencyPhone: '', 
      documents: [] 
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (employee) => {
    setEditingId(employee._id || employee.id);
    setFormData({
      fullName: employee.fullName || employee.name || '',
      email: employee.email || '',
      department: employee.department || 'Engineering',
      jobTitle: employee.jobTitle || 'Software Engineer',
      status: employee.status || 'Active',
      avatar: employee.avatar || '',
      emergencyName: employee.emergencyName || '',
      emergencyPhone: employee.emergencyPhone || '',
      documents: employee.documents || []
    });
    setIsModalOpen(true);
  };

  const handleOpenDocModal = (employee) => {
    setDocModalEmployee(employee);
    setIsDocModalOpen(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchEmployees();
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
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
        ? `${API_BASE_URL}/api/employees/${editingId}`
        : `${API_BASE_URL}/api/employees`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchEmployees();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ 
      fullName: '', 
      email: '', 
      department: 'Engineering', 
      jobTitle: 'Software Engineer',
      status: 'Active', 
      avatar: '', 
      emergencyName: '', 
      emergencyPhone: '', 
      documents: [] 
    });
  };

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 p-6 md:p-10 font-sans">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <Users className="text-indigo-400 h-8 w-8" />
            Employee Directory
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage staff profiles, departmental roles, attached documents, and contact records.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-lg text-sm shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Toolbar & Search */}
      <div className="bg-[#131e3a] border border-slate-700/60 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, department, position..."
            className="w-full pl-10 pr-4 py-2 bg-[#0b1329] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-400 w-full md:w-auto justify-between md:justify-end">
          <span>Total: <strong className="text-white">{employees.length}</strong></span>
          <span>Active: <strong className="text-emerald-400">{employees.filter(e => e.status === 'Active').length}</strong></span>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-[#131e3a] border border-slate-700/60 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0b1329]/60 border-b border-slate-700/80 text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Employee</th>
                <th className="py-4 px-6">Department & Role</th>
                <th className="py-4 px-6">Emergency Contact</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => {
                  const docCount = employee.documents ? employee.documents.length : 0;
                  const name = employee.fullName || employee.name;

                  return (
                    <tr key={employee._id || employee.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img 
                          src={employee.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
                          alt={name} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <p className="font-semibold text-white">{name}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {employee.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700">
                            <Building className="h-3 w-3 text-indigo-400" />
                            {employee.department || 'General'}
                          </span>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Briefcase className="h-3 w-3 text-slate-500" />
                            {employee.jobTitle || 'Staff'}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-slate-200 text-xs">
                          {employee.emergencyName ? employee.emergencyName : <span className="text-slate-500 italic">No contact provided</span>}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3 text-rose-400" /> 
                          {employee.emergencyPhone ? employee.emergencyPhone : <span className="text-slate-500 italic">No phone</span>}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          employee.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {employee.status === 'Active' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          {employee.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleOpenDocModal(employee)}
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
                            onClick={() => handleEditClick(employee)}
                            className="p-1.5 hover:bg-slate-700/60 rounded text-slate-400 hover:text-indigo-400 transition cursor-pointer"
                            title="Edit Employee"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteEmployee(employee._id || employee.id)}
                            className="p-1.5 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-400 transition cursor-pointer"
                            title="Delete Employee"
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
                    {loading ? 'Loading employees...' : 'No employees found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Employee */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#131e3a] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Edit Employee' : 'Add New Employee'}
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
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <span className="text-xs text-slate-400 mt-2">Click to upload photo</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. John Doe"
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
                  placeholder="john.doe@company.com"
                  className="w-full px-3 py-2 bg-[#0b1329] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0b1329] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="e.g. Frontend Developer"
                    className="w-full px-3 py-2 bg-[#0b1329] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#0b1329] rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Emergency Contact Information</span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                    placeholder="e.g. Mary Doe (Spouse)"
                    className="w-full px-3 py-2 bg-[#131e3a] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    placeholder="e.g. +1 555 019 2831"
                    className="w-full px-3 py-2 bg-[#131e3a] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Employment Status</label>
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
                <label className="block text-xs font-medium text-slate-300 mb-2">Attach Documents / Resume</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-indigo-300 cursor-pointer transition">
                    <Paperclip className="h-4 w-4" />
                    <span>Upload Document</span>
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
                  {editingId ? 'Update Employee' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document View Modal */}
      {isDocModalOpen && docModalEmployee && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#131e3a] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="text-indigo-400 h-5 w-5" />
                Documents for {docModalEmployee.fullName || docModalEmployee.name}
              </h3>
              <button onClick={() => setIsDocModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {docModalEmployee.documents && docModalEmployee.documents.length > 0 ? (
                docModalEmployee.documents.map((doc, idx) => (
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
                <p className="text-center text-slate-400 py-8">No documents attached for this employee.</p>
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