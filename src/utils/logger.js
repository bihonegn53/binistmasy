export const STORAGE_KEY = 'app_activity_logs';
export const LOG_EVENT_NAME = 'app_activity_log_updated';

export const addProjectLog = (
  action, 
  details = '', 
  user = 'Bini td', 
  role = 'Admin', 
  status = 'Completed'
) => {
  try {
    const existingLogs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      user,
      role,
      action,
      details,
      timestamp: formattedDate,
      status
    };

    const updatedLogs = [newLog, ...existingLogs];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));

    // ገጹ ሳይታደስ (Refresh ሳይሆን) በሪል-ታይም እንዲቀየር ያደርጋል
    window.dispatchEvent(new CustomEvent(LOG_EVENT_NAME, { detail: updatedLogs }));
  } catch (error) {
    console.error('Failed to save project log:', error);
  }
};