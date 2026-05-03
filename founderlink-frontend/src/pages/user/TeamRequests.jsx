import { useEffect, useState } from "react";
import { getMyRequests, acceptInvite, rejectInvite } from "../../services/teamService";
import { FiCheck, FiX, FiClock, FiBriefcase, FiCheckCircle } from "react-icons/fi";

const STATUS_STYLES = {
  ACCEPTED: "bg-green-100 dark:bg-emerald-500/10 text-green-700 dark:text-emerald-400 border border-green-200 dark:border-emerald-500/20",
  REJECTED: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20",
  INVITED: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
  REQUESTED: "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10",
};

const TeamRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getMyRequests();
      setRequests(res.data);
    } catch { setError("Failed to load team requests."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === "accept") await acceptInvite(id);
      else await rejectInvite(id);
      fetchRequests();
    } catch { alert("Operation failed."); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-slate-300/50 dark:border-emerald-500/20 border-t-slate-700 dark:border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  const pendingInvites = requests.filter(r => r.status === 'INVITED' && r.type === 'INVITE');
  const history = requests.filter(r => !(r.status === 'INVITED' && r.type === 'INVITE'));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="mb-10 border-b border-slate-200 dark:border-white/5 pb-8 transition-colors duration-300">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">Team Requests</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium transition-colors duration-300">Manage your invitations and track your join requests.</p>
      </div>

      {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg mb-8 font-medium transition-colors duration-300">{error}</div>}

      {/* PENDING INVITATIONS */}
      <section className="mb-12">
        <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5 transition-colors duration-300">
          Pending Invitations {pendingInvites.length > 0 && <span className="ml-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingInvites.length}</span>}
        </h2>
        <div className="space-y-4">
          {pendingInvites.length === 0 ? (
            <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 border-dashed rounded-xl py-14 text-center text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">
              <FiBriefcase className="text-4xl mx-auto mb-3 text-slate-200 dark:text-slate-700 transition-colors duration-300" />
              No pending invitations at this time.
            </div>
          ) : (
            pendingInvites.map((req) => (
              <div key={req.id} className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:border-slate-400 dark:hover:border-emerald-500/30 duration-300">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-[#0B0F0E] flex items-center justify-center text-slate-600 dark:text-emerald-500 border border-slate-200 dark:border-white/10 transition-colors duration-300">
                    <FiBriefcase />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white transition-colors duration-300">{req.startupName}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors duration-300">
                      <span>Invited as <span className="text-slate-700 dark:text-emerald-400 font-bold transition-colors">{req.role}</span></span>
                      <span className="flex items-center gap-1"><FiClock className="text-slate-400 dark:text-slate-500" /> {new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={() => handleAction(req.id, "accept")} className="btn-primary py-2 px-6 text-sm flex-1 md:flex-none flex items-center justify-center gap-2">
                    <FiCheck /> Accept
                  </button>
                  <button onClick={() => handleAction(req.id, "reject")} className="btn-secondary py-2 px-6 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex-1 md:flex-none flex items-center justify-center gap-2 transition-colors duration-300">
                    <FiX /> Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* HISTORY */}
      <section>
        <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5 transition-colors duration-300">Request History</h2>
        {history.length === 0 ? (
          <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 border-dashed rounded-xl py-14 text-center text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">
            <FiCheckCircle className="text-4xl mx-auto mb-3 text-slate-200 dark:text-slate-700 transition-colors duration-300" />
            No historical records found.
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden transition-colors duration-300">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-white/5">
              <thead className="bg-slate-50 dark:bg-white/[0.02] transition-colors duration-300">
                <tr>
                  {["Startup", "Role", "Type", "Date", "Status"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors duration-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {history.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors duration-300">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900 dark:text-white text-sm transition-colors duration-300">{req.startupName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">{req.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">{req.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 dark:text-slate-500 font-medium transition-colors duration-300">{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[req.status] || STATUS_STYLES.REQUESTED}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default TeamRequests;
