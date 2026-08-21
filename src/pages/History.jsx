import React, { useState, useEffect, useCallback } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Trash2,
  RefreshCw,
  Info,
  Download
} from 'lucide-react';
import { STORAGE_KEY, LOG_EVENT_NAME } from '../utils/logger';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const loadLogs = useCallback(() => {
    try {
      const savedLogs = localStorage.getItem(STORAGE_KEY);
      setHistory(savedLogs ? JSON.parse(savedLogs) : []);
    } catch (error) {
      console.error('Failed to read activity logs:', error);
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    loadLogs();

    const handleSameTabUpdate = () => loadLogs();
    window.addEventListener(LOG_EVENT_NAME, handleSameTabUpdate);

    const handleCrossTabUpdate = (e) => {
      if (e.key === STORAGE_KEY) loadLogs();
    };
    window.addEventListener('storage', handleCrossTabUpdate);

    return () => {
      window.removeEventListener(LOG_EVENT_NAME, handleSameTabUpdate);
      window.removeEventListener('storage', handleCrossTabUpdate);
    };
  }, [loadLogs]);

  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all history logs?')) {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
      window.dispatchEvent(new CustomEvent(LOG_EVENT_NAME));
    }
  };

  const handleDeleteLog = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(LOG_EVENT_NAME));
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ['Log ID', 'User', 'Role', 'Action', 'Details', 'Timestamp', 'Status'];
    const rows = history.map(item => [
      `"${item.id}"`,
      `"${item.user}"`,
      `"${item.role}"`,
      `"${item.action}"`,
      `"${item.details?.replace(/"/g, '""') || ''}"`,
      `"${item.timestamp}"`,
      `"${item.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `activity_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = history.filter((log) => {
    const matchesSearch = 
      log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 p-6 md:p-10 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <GraduationCap className="text-indigo-400 h-8 w-8" />
            Project Activity History
          </h1>
          <p className="text-slate-400 mt-1">
            Real-time audit log tracking actions performed across all pages in this application.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button 
            onClick={loadLogs}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-lg text-sm font-medium transition shadow-sm"
            title="Refresh Logs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>

          {history.length > 0 && (
            <>
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3.5 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                title="Export Logs to CSV"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>

              <button 
                onClick={handleClearAllHistory}
                className="flex items-center gap-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 px-3.5 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                title="Clear All Logs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear History</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-[#131e3a] border border-slate-700/60 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by ID, User, or Action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#0b1329] text-slate-100 border border-slate-700 focus:outline-none focus:border-indigo-500 text-sm placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Filter className="text-slate-400 h-4 w-4 hidden sm:block" />
          <span className="text-sm text-slate-400 hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0b1329] border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Statuses ({history.length})</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="bg-[#131e3a] border border-slate-700/60 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0b1329]/80 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-6 py-4">Log ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-mono text-xs text-indigo-400 font-semibold">{item.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-100">{item.user}</div>
                      <div className="text-xs text-slate-500">{item.role}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-200 font-medium">{item.action}</td>
                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate" title={item.details}>{item.details || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {item.timestamp}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Completed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                      {item.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {item.status === 'Failed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <AlertCircle className="w-3 h-3" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteLog(item.id)}
                        className="p-1 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded transition"
                        title="Delete Log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Info className="w-8 h-8 text-slate-600" />
                      <p className="text-slate-300 font-medium">No Activity Logs Found</p>
                      <p className="text-xs text-slate-500 max-w-sm">
                        New actions created across any page in this application will automatically record here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}