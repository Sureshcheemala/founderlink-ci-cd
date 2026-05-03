import { useEffect, useState } from "react";
import { getNotifications, markAsRead } from "../../services/notificationService";
import { FiBell, FiCheckCircle } from "react-icons/fi";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      setNotifications(res.data);
    } catch { setError("Failed to load notifications."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch { alert("Failed to update notification."); }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.allSettled(unread.map(n => markAsRead(n.id)));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-slate-300/50 dark:border-emerald-500/20 border-t-slate-700 dark:border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="flex justify-between items-end mb-10 border-b border-slate-200 dark:border-white/5 pb-8 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">Updates & Alerts</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium transition-colors duration-300">Monitor ecosystem activity and action requests.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="badge">{unreadCount} UNREAD</span>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest transition-colors duration-300">
              Mark all read
            </button>
          )}
        </div>
      </div>

      {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg mb-8 font-medium transition-colors duration-300">{error}</div>}

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 border-dashed rounded-xl py-20 text-center transition-colors duration-300">
            <FiBell className="text-5xl mx-auto mb-4 text-slate-200 dark:text-slate-700 transition-colors duration-300" />
            <p className="text-slate-400 font-medium">No notifications yet.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} onClick={() => !n.read && handleRead(n.id)}
              className={`p-5 border rounded-xl transition-all cursor-pointer flex gap-5 items-start ${
                n.read
                  ? "bg-slate-50 dark:bg-transparent border-slate-100 dark:border-white/5 opacity-60"
                  : "bg-white dark:bg-[#0f1513] border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none hover:border-slate-300 dark:hover:border-emerald-500/30"
              }`}>
              <div className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 ${n.read ? 'bg-slate-200 dark:bg-slate-700' : 'bg-slate-700 dark:bg-emerald-500'} transition-colors duration-300`} />
              <div className="flex-1">
                <p className={`leading-relaxed text-sm transition-colors duration-300 ${n.read ? 'text-slate-500 dark:text-slate-500 font-medium' : 'text-slate-900 dark:text-white font-bold'}`}>
                  {n.message}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-bold uppercase tracking-wider transition-colors duration-300">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.read && (
                <button className="text-slate-500 dark:text-emerald-500 hover:text-slate-900 dark:hover:text-emerald-400 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 flex-shrink-0 transition-colors duration-300">
                  <FiCheckCircle /> Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
