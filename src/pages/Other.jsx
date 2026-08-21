import React, { useState } from 'react';
import { 
  BarChart3, 
  Settings, 
  Database, 
  Sliders, 
  Download, 
  Upload, 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export default function OtherPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);

  return (
    <div className="min-h-screen bg-red-600 text-white p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
          <BarChart3 className="text-red-100 h-8 w-8" />
          Other Settings & Tools
        </h1>
        <p className="text-red-100/90 mt-1">
          Manage system configurations, data exports, and secondary preferences.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Quick System Overview */}
        <div className="lg:col-span-2 bg-red-700/80 border border-red-500 rounded-xl p-6 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
            <Sliders className="text-red-200 h-5 w-5" />
            System Preferences
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-800/60 rounded-lg border border-red-600">
              <div>
                <p className="font-medium text-white">System Notifications</p>
                <p className="text-xs text-red-100/80">Receive real-time alerts for system updates</p>
              </div>
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${notificationsEnabled ? 'bg-white justify-end' : 'bg-red-900 justify-start border border-red-700'}`}
              >
                <div className={`w-4 h-4 rounded-full shadow-md ${notificationsEnabled ? 'bg-red-600' : 'bg-red-300'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-800/60 rounded-lg border border-red-600">
              <div>
                <p className="font-medium text-white">Automatic Daily Backups</p>
                <p className="text-xs text-red-100/80">Backup system data to secure cloud storage at midnight</p>
              </div>
              <button 
                onClick={() => setAutoBackup(!autoBackup)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${autoBackup ? 'bg-white justify-end' : 'bg-red-900 justify-start border border-red-700'}`}
              >
                <div className={`w-4 h-4 rounded-full shadow-md ${autoBackup ? 'bg-red-600' : 'bg-red-300'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Quick Status */}
        <div className="bg-red-700/80 border border-red-500 rounded-xl p-6 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
            <Database className="text-red-200 h-5 w-5" />
            System Health
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-red-100/80">Database Status</span>
              <span className="text-emerald-300 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Operational
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-red-100/80">Storage Used</span>
              <span className="text-white font-medium">64.2 / 100 GB</span>
            </div>
            <div className="w-full bg-red-900/60 h-2 rounded-full overflow-hidden border border-red-500/50">
              <div className="bg-white h-full w-[64%]" />
            </div>
            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-red-100/80">API Gateway</span>
              <span className="text-emerald-300 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Healthy
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Data Import & Export Utilities */}
        <div className="lg:col-span-3 bg-red-700/80 border border-red-500 rounded-xl p-6 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
            <Settings className="text-red-200 h-5 w-5" />
            Data Operations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-red-600 rounded-lg p-5 bg-red-800/50 hover:bg-red-800/80 transition flex items-start gap-4">
              <div className="p-3 bg-white/10 text-white rounded-lg">
                <Download className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Export Data Logs</h3>
                <p className="text-xs text-red-100/80 mt-1 mb-3">Download system reports and activity logs in CSV or JSON format.</p>
                <button className="px-4 py-2 bg-white text-red-600 hover:bg-red-50 rounded-md text-sm font-semibold transition shadow-sm">
                  Export Files
                </button>
              </div>
            </div>

            <div className="border border-red-600 rounded-lg p-5 bg-red-800/50 hover:bg-red-800/80 transition flex items-start gap-4">
              <div className="p-3 bg-white/10 text-white rounded-lg">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Batch Import</h3>
                <p className="text-xs text-red-100/80 mt-1 mb-3">Upload bulk configuration files or record datasets into the system.</p>
                <button className="px-4 py-2 bg-red-900 hover:bg-red-950 border border-red-500 text-white rounded-md text-sm font-medium transition shadow-sm">
                  Upload File
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}