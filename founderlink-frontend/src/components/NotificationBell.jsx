import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotifications, markAsRead } from "../services/notificationService";
import { FiBell } from "react-icons/fi";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to load notifications");
      }
    };
    fetch();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      console.error("Failed to mark read");
    }
  };

  const handleMarkAll = async () => {
    try {
      await Promise.all(notifications.filter(n => !n.read).map((n) => markAsRead(n.id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      console.error("Failed to mark all");
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-full transition group">
        <FiBell className={`text-xl transition ${unreadCount > 0 ? 'text-slate-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-emerald-500'}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-slate-800 dark:bg-emerald-500 text-white dark:text-[#0B0F0E] text-[8px] font-black px-1 rounded-full border border-white dark:border-[#0B0F0E]">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#0f1513] shadow-xl rounded-xl border border-slate-200 dark:border-white/5 z-50 overflow-hidden transform origin-top-right transition-all">
            <div className="p-4 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/5 flex justify-between items-center transition-colors">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Alerts</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="text-[10px] text-slate-700 dark:text-emerald-500 font-black uppercase hover:underline"
                >
                  Mark All
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-xs font-medium italic">
                  No activity found.
                </div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 border-b border-slate-100 dark:border-white/5 cursor-pointer transition hover:bg-slate-50 dark:hover:bg-white/5 ${
                      n.read ? "opacity-60" : "bg-white dark:bg-transparent"
                    }`}
                    onClick={() => { handleRead(n.id); setOpen(false); }}
                  >
                    <div className="flex gap-3">
                      {!n.read && <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-800 dark:bg-emerald-500 flex-shrink-0"></div>}
                      <div>
                        <p className={`text-xs text-slate-900 dark:text-white leading-normal ${!n.read ? 'font-bold' : 'font-medium'}`}>
                          {n.message}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="block p-3 text-center text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-emerald-500 transition border-t border-slate-200 dark:border-white/5"
            >
              View Full History
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;