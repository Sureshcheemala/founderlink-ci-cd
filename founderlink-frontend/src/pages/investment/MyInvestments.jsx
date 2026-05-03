import { useEffect, useState } from "react";
import { getMyInvestments } from "../../services/investmentService";
import { getStartupById } from "../../services/startupService";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiPieChart, FiTrendingUp } from "react-icons/fi";

const STATUS_STYLES = {
  APPROVED: "bg-green-100 dark:bg-emerald-500/10 text-green-700 dark:text-emerald-400 border border-green-200 dark:border-emerald-500/20",
  REJECTED: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20",
  PENDING: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
};

const MyInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [startupMap, setStartupMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getMyInvestments();
        setInvestments(res.data);
        const uniqueIds = [...new Set(res.data.map(inv => inv.startupId).filter(Boolean))];
        const responses = await Promise.allSettled(uniqueIds.map(id => getStartupById(id)));
        const map = {};
        responses.forEach(r => { if (r.status === "fulfilled") map[r.value.data.id] = r.value.data; });
        setStartupMap(map);
      } catch { setError("Failed to synchronize portfolio data."); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const totalApproved = investments.filter(i => i.status === "APPROVED").reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="mb-10 border-b border-slate-200 dark:border-white/5 pb-8 flex justify-between items-end transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">Investment Portfolio</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium transition-colors duration-300">Track your capital commitments and venture performance.</p>
        </div>
        {investments.length > 0 && (
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Approved</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors duration-300">₹{totalApproved.toLocaleString()}</p>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-300/50 dark:border-emerald-500/20 border-t-slate-700 dark:border-t-emerald-500 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg mb-10 font-medium transition-colors duration-300">{error}</div>
      )}

      {!loading && investments.length === 0 && (
        <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 rounded-xl py-20 text-center shadow-sm transition-colors duration-300">
          <FiPieChart className="text-5xl text-slate-200 dark:text-slate-700 mx-auto mb-6 transition-colors duration-300" />
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 font-medium">Your investment portfolio is currently empty.</p>
          <button onClick={() => navigate("/browse-startups")} className="btn-primary px-8">
            Explore Market Opportunities
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investments.map((inv) => {
          const startup = startupMap[inv.startupId];
          const fundingPercent = startup ? Math.min(Math.round((inv.amount / startup.fundingGoal) * 100), 100) : 0;
          return (
            <div key={inv.id} className="card group hover:border-slate-400 dark:hover:border-emerald-500/30 duration-300 flex flex-col h-full">
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-[#0B0F0E] flex items-center justify-center text-lg font-bold text-slate-600 dark:text-emerald-500 border border-slate-200 dark:border-white/10 transition-colors duration-300">
                    {startup?.name?.[0] || "S"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm transition-colors duration-300 line-clamp-1">{startup?.name || `Venture #${inv.startupId}`}</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5 transition-colors duration-300">{startup?.industry || "—"}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[inv.status] || STATUS_STYLES.PENDING}`}>
                  {inv.status}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-[#0B0F0E]/50 p-5 rounded-lg mb-5 border border-slate-100 dark:border-white/5 flex-1 flex flex-col justify-center transition-colors duration-300">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] mb-1 transition-colors duration-300">Committed Capital</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tighter transition-colors duration-300">₹{inv.amount.toLocaleString()}</p>
                {startup && (
                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
                      <span>Share of Goal</span><span>{fundingPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${fundingPercent}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => navigate(`/startup/${inv.startupId}`)}
                className="w-full btn-secondary py-2.5 text-sm flex items-center justify-center gap-2">
                View Asset <FiArrowRight />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyInvestments;