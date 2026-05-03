import { useEffect, useState } from "react";
import { getPendingInvestmentRequests, acceptRequest, rejectRequest } from "../../services/investmentService";
import { FiArrowLeft, FiCheck, FiX, FiDollarSign, FiInbox } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const InvestmentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getPendingInvestmentRequests();
      setRequests(res.data);
    } catch { console.error("Failed to load funding requests."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === "accept") await acceptRequest(id);
      else await rejectRequest(id);
      fetchData();
    } catch { alert(`Failed to ${action} request.`); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="flex justify-between items-end mb-10 border-b border-slate-200 dark:border-white/5 pb-8 transition-colors duration-300">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-4 font-bold text-sm">
            <FiArrowLeft /> Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">Funding Proposals</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium transition-colors duration-300">Review and respond to direct investment invitations.</p>
        </div>
        {requests.length > 0 && (
          <span className="badge">{requests.length} PENDING</span>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-300/50 dark:border-emerald-500/20 border-t-slate-700 dark:border-t-emerald-500 rounded-full animate-spin" />
        </div>
      )}

      <div className="space-y-5">
        {requests.length === 0 && !loading ? (
          <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 border-dashed rounded-xl py-20 text-center transition-colors duration-300">
            <FiInbox className="text-5xl text-slate-200 dark:text-slate-700 mx-auto mb-4 transition-colors duration-300" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No pending funding proposals found.</p>
          </div>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-slate-400 dark:hover:border-emerald-500/30 duration-300">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-[#0B0F0E] flex items-center justify-center text-slate-500 dark:text-emerald-500 border border-slate-200 dark:border-white/10 transition-colors duration-300">
                  <FiDollarSign className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white transition-colors duration-300">Startup ID: {r.startupId}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5 transition-colors duration-300">Founder: {r.founderEmail}</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#0B0F0E]/50 px-7 py-4 rounded-xl border border-slate-100 dark:border-white/5 min-w-[180px] transition-colors duration-300">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1 transition-colors duration-300">Requested Amount</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">₹{r.amount.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button onClick={() => handleAction(r.id, "accept")} className="btn-primary py-2.5 px-6 text-sm flex-1 md:flex-none flex items-center justify-center gap-2">
                  <FiCheck /> Accept
                </button>
                <button onClick={() => handleAction(r.id, "reject")} className="btn-secondary py-2.5 px-6 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex-1 md:flex-none flex items-center justify-center gap-2 transition-colors duration-300">
                  <FiX /> Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InvestmentRequests;