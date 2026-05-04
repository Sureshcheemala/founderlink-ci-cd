import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStartupInvestments, approveInvestment, rejectInvestment } from "../../services/investmentService";
import { FiArrowLeft, FiCheck, FiX, FiMail, FiDollarSign } from "react-icons/fi";

const StartupInvestments = () => {
  const { startupId } = useParams();
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getStartupInvestments(startupId);
        setInvestments(res.data);
      } catch {
        console.error("Failed to load investment records.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startupId]);

  const handleAction = async (id, action) => {
    try {
      const res = action === "approve" ? await approveInvestment(id) : await rejectInvestment(id);
      setInvestments((prev) => prev.map((inv) => (inv.id === id ? res.data : inv)));
    } catch {
      alert(`System failure during ${action} operation.`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-12 border-b border-slate-200 dark:border-white/5 pb-8 transition-colors duration-300">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-emerald-500 transition-colors mb-4 font-bold text-sm">
            <FiArrowLeft /> Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">Investment Requests</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium transition-colors duration-300">Manage institutional capital commitments for your venture.</p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-300/50 dark:border-emerald-500/20 border-t-slate-700 dark:border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="space-y-6">
        {investments.length === 0 && !loading ? (
          <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 border-dashed rounded-xl py-20 text-center text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">
            No active investment requests found.
          </div>
        ) : (
          investments.map((inv) => (
            <div key={inv.id} className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-8 hover:border-slate-400 dark:hover:border-emerald-500/30 transition-colors duration-300">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-[#0B0F0E] flex items-center justify-center text-slate-700 dark:text-emerald-500 border border-slate-200 dark:border-white/10 transition-colors duration-300">
                  <FiMail className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">{inv.investorEmail}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1 transition-colors duration-300">Institutional Investor</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#0B0F0E]/50 px-8 py-4 rounded-xl border border-slate-100 dark:border-white/5 min-w-[200px] transition-colors duration-300">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1 transition-colors duration-300">Committed Amount</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">₹{inv.amount.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                {inv.status === "PENDING" ? (
                  <div className="flex gap-4 w-full">
                    <button
                      onClick={() => handleAction(inv.id, "approve")}
                      className="btn-primary py-2.5 px-6 text-sm flex-1 md:flex-none flex items-center justify-center gap-2"
                    >
                      <FiCheck /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(inv.id, "reject")}
                      className="btn-secondary py-2.5 px-6 text-sm text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-1 md:flex-none flex items-center justify-center gap-2 transition-colors duration-300"
                    >
                      <FiX /> Decline
                    </button>
                  </div>
                ) : (
                  <span className={`badge px-6 py-2 ${
                    inv.status === "APPROVED" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {inv.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StartupInvestments;