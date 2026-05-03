import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiTrendingUp, FiBriefcase, FiDollarSign, FiActivity, FiArrowRight, FiTarget, FiSearch } from "react-icons/fi";
import { getMyInvestments, getInvestmentRequests } from "../../services/investmentService";

const InvestorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({ totalInvested: 0, portfolioSize: 0, pendingProposals: 0 });
  const [loading, setLoading] = useState(true);
  const [recentPortfolio, setRecentPortfolio] = useState([]);

  useEffect(() => {
    const fetchInvestorData = async () => {
      try {
        setLoading(true);
        const invRes = await getMyInvestments();
        const investments = invRes.data;
        const reqRes = await getInvestmentRequests();
        const requests = reqRes.data;
        let totalInvested = 0;
        investments.forEach(i => { if (i.status === 'APPROVED') totalInvested += i.amount; });
        setStats({ totalInvested, portfolioSize: investments.length, pendingProposals: requests.filter(r => r.status === 'PENDING').length });
        setRecentPortfolio(investments.slice(0, 5));
      } catch { console.error("Investor dashboard sync failure."); }
      finally { setLoading(false); }
    };
    fetchInvestorData();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-12 h-12 border-4 border-slate-300/50 dark:border-emerald-500/20 border-t-slate-700 dark:border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  const utilization = stats.totalInvested > 0 ? Math.min(Math.round((stats.totalInvested / (stats.totalInvested + 500000)) * 100), 99) : 0;
  const circumference = 2 * Math.PI * 52;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      {/* HEADER */}
      <div className="mb-10 border-b border-slate-200 dark:border-white/5 pb-8 flex justify-between items-end transition-colors duration-300">
        <div>
          <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Welcome back</p>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">
            {user?.name?.split(" ")[0] || "Investor"}'s Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium transition-colors duration-300">Monitoring capital allocation and venture performance.</p>
        </div>
        <Link to="/browse-startups" className="btn-primary flex items-center gap-2 py-3 px-6">
          <FiSearch /> Discover Ventures
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: <FiDollarSign />, label: "Deployed Capital", value: `₹${stats.totalInvested.toLocaleString()}`, accent: stats.totalInvested > 0 },
          { icon: <FiBriefcase />, label: "Venture Portfolio", value: stats.portfolioSize },
          { icon: <FiTarget />, label: "Pending Proposals", value: stats.pendingProposals, warn: stats.pendingProposals > 0 },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#0f1513] p-7 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group hover:border-slate-400 dark:hover:border-emerald-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-6xl text-slate-900 dark:text-white">{s.icon}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 transition-colors duration-300">{s.label}</p>
            <p className={`text-4xl font-black tracking-tighter transition-colors duration-300 ${s.warn ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* PORTFOLIO */}
          <div className="card">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-white/5 pb-4 transition-colors duration-300">
              <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Strategic Portfolio</h2>
              <Link to="/my-investments" className="text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 dark:hover:text-emerald-400 transition-colors">Manage All</Link>
            </div>
            <div className="space-y-4">
              {recentPortfolio.length === 0 ? (
                <div className="py-14 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-xl transition-colors duration-300">
                  <FiActivity className="text-4xl text-slate-200 dark:text-slate-700 mx-auto mb-4 transition-colors duration-300" />
                  <p className="text-slate-400 font-medium text-sm">No active investments yet.</p>
                  <Link to="/browse-startups" className="mt-4 inline-block text-sm font-bold text-slate-700 dark:text-emerald-400 hover:underline transition-colors">Browse Startups →</Link>
                </div>
              ) : (
                recentPortfolio.map(i => (
                  <div key={i.id} className="flex items-center justify-between p-5 rounded-xl bg-slate-50 dark:bg-transparent border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-emerald-500/30 transition-all group duration-300">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0B0F0E] border border-slate-200 dark:border-white/10 flex items-center justify-center text-xl font-bold text-slate-600 dark:text-emerald-500 shadow-sm group-hover:border-slate-400 dark:group-hover:border-emerald-500/40 transition-all">
                        {i.startupName?.[0] || 'S'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white transition-colors duration-300">{i.startupName || `Venture #${i.startupId}`}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">₹{i.amount.toLocaleString()} · <span className={i.status === 'APPROVED' ? 'text-green-600 dark:text-green-400' : i.status === 'REJECTED' ? 'text-red-500' : 'text-amber-500'}>{i.status}</span></p>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/startup/${i.startupId}`)} className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-emerald-500 transition-colors">
                      <FiArrowRight className="text-xl" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          {/* Capital Utilization Ring */}
          <div className="card bg-slate-900 dark:bg-[#0f1513] text-white border-none transition-colors duration-300">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Capital Utilization</h2>
            <div className="flex items-center justify-center py-4">
              <div className="relative">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="52" fill="none" stroke="#1e293b" strokeWidth="12" />
                  <circle cx="70" cy="70" r="52" fill="none" stroke="#10b981" strokeWidth="12"
                    strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * utilization / 100)}
                    strokeLinecap="round" transform="rotate(-90 70 70)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{utilization}%</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Deployed</span>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">₹{stats.totalInvested.toLocaleString()} of total capital</p>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 transition-colors duration-300">Operations</h2>
            <div className="space-y-3">
              <Link to="/investment-requests" className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-slate-100 dark:border-white/5 group duration-300">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Review Proposals</span>
                <div className="flex items-center gap-2">
                  {stats.pendingProposals > 0 && <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{stats.pendingProposals}</span>}
                  <FiArrowRight className="text-slate-300 dark:text-slate-600" />
                </div>
              </Link>
              <Link to="/my-investments" className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-slate-100 dark:border-white/5 group duration-300">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Portfolio Ledger</span>
                <FiArrowRight className="text-slate-300 dark:text-slate-600" />
              </Link>
              <Link to="/browse-startups" className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-slate-100 dark:border-white/5 group duration-300">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Explore Ventures</span>
                <FiArrowRight className="text-slate-300 dark:text-slate-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;