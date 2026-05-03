import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiGrid, FiUsers, FiActivity, FiArrowRight, FiPieChart, FiDollarSign, FiBell } from "react-icons/fi";
import { getMyStartups } from "../../services/startupService";
import { getStartupInvestments } from "../../services/investmentService";
import { getStartupRequests } from "../../services/teamService";

const FounderDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({

    activeStartups: 0,
    totalFunding: 0,
    pendingRequests: 0,
    activeDeals: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentStartups, setRecentStartups] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const startupsRes = await getMyStartups();
        const startups = startupsRes.data;
        setRecentStartups(startups.slice(0, 3));

        // Aggregate stats
        let totalFunding = 0;
        let totalRequests = 0;

        const investmentPromises = startups.map(s => getStartupInvestments(s.id));
        const requestPromises = startups.map(s => getStartupRequests(s.id));

        const investmentResults = await Promise.allSettled(investmentPromises);
        const requestResults = await Promise.allSettled(requestPromises);

        investmentResults.forEach(res => {
          if (res.status === 'fulfilled') {
            res.value.data.forEach(inv => {
              if (inv.status === 'APPROVED') totalFunding += inv.amount;
            });
          }
        });

        requestResults.forEach(res => {
          if (res.status === 'fulfilled') {
            totalRequests += res.value.data.filter(r => r.status === 'PENDING').length;
          }
        });

        setStats({
          activeStartups: startups.length,
          totalFunding: totalFunding,
          pendingRequests: totalRequests,
          activeDeals: investmentResults.filter(res => res.status === 'fulfilled' && res.value.data.length > 0).length
        });

      } catch (err) {
        console.error("Dashboard synchronization failure.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-slate-300/50 dark:border-emerald-500/20 border-t-slate-700 dark:border-t-emerald-500 rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      {/* HEADER */}
      <div className="mb-12 border-b border-slate-200 dark:border-white/5 pb-8 flex justify-between items-end transition-colors duration-300">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">Founder Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium transition-colors duration-300">Strategic overview of your venture portfolio and team activity.</p>
        </div>
        <Link to="/create-startup" className="btn-primary flex items-center gap-2 py-3 px-6">
          <FiPlus /> New Venture
        </Link>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="bg-white dark:bg-[#0f1513]/80 dark:backdrop-blur-md p-8 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group hover:border-slate-400 dark:hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 dark:opacity-10 dark:group-hover:opacity-20 transition-opacity">
            <FiGrid className="text-6xl text-slate-900 dark:text-white" />
          </div>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">Active Ventures</p>
          <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors duration-300">{stats.activeStartups}</p>
        </div>
        <div className="bg-white dark:bg-[#0f1513]/80 dark:backdrop-blur-md p-8 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group hover:border-slate-400 dark:hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 dark:opacity-10 dark:group-hover:opacity-20 transition-opacity">
            <FiDollarSign className="text-6xl text-slate-900 dark:text-white" />
          </div>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">Capital Secured</p>
          <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors duration-300">₹{stats.totalFunding.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-[#0f1513]/80 dark:backdrop-blur-md p-8 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group hover:border-slate-400 dark:hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 dark:opacity-10 dark:group-hover:opacity-20 transition-opacity">
            <FiUsers className="text-6xl text-slate-900 dark:text-white" />
          </div>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">Talent Requests</p>
          <p className={`text-4xl font-black tracking-tighter transition-colors duration-300 ${stats.pendingRequests > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>{stats.pendingRequests}</p>
        </div>
        <div className="bg-white dark:bg-[#0f1513]/80 dark:backdrop-blur-md p-8 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group hover:border-slate-400 dark:hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 dark:opacity-10 dark:group-hover:opacity-20 transition-opacity">
            <FiActivity className="text-6xl text-slate-900 dark:text-white" />
          </div>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">Active Dealflow</p>
          <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors duration-300">{stats.activeDeals}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* RECENT STARTUPS */}
        <div className="lg:col-span-2 space-y-8">
           <div className="card">
              <div className="flex justify-between items-center mb-10 border-b border-slate-100 dark:border-white/5 pb-4 transition-colors duration-300">
                 <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest transition-colors duration-300">Active Venture Assets</h2>
                 <Link to="/my-startups" className="text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 dark:hover:text-emerald-400 transition-colors duration-300">View All</Link>
              </div>
              
              <div className="space-y-6">
                {recentStartups.length === 0 ? (
                  <div className="py-12 text-center">
                    <FiPieChart className="text-4xl text-slate-200 dark:text-slate-700 mx-auto mb-4 transition-colors duration-300" />
                    <p className="text-slate-400 font-medium transition-colors duration-300">No ventures initialized yet.</p>
                  </div>
                ) : (
                  recentStartups.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-6 rounded-xl bg-slate-50 dark:bg-transparent border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-emerald-500/30 transition-all duration-300 group">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-xl bg-white dark:bg-[#0B0F0E] border border-slate-200 dark:border-white/10 flex items-center justify-center text-xl font-bold text-slate-600 dark:text-emerald-500 shadow-sm group-hover:bg-slate-800 dark:group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:text-[#0B0F0E] transition-all duration-300">
                             {s.name[0]}
                          </div>
                          <div>
                             <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">{s.name}</h3>
                             <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1 transition-colors duration-300">{s.industry} • {s.stage}</p>
                          </div>
                       </div>
                       <button onClick={() => navigate(`/startup/${s.id}`)} className="text-slate-400 hover:text-slate-900 dark:hover:text-emerald-500 transition-colors">
                          <FiArrowRight className="text-xl" />
                       </button>
                    </div>
                  ))
                )}
              </div>
           </div>

           {/* LIVE NOTIFICATIONS SHORTCUT */}
           <div className="card">
              <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-white/5 pb-4 transition-colors duration-300">Quick Actions</h2>
              <div className="space-y-3">
                 <Link to="/notifications" className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-emerald-500/30 group duration-300">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                       <FiBell />
                    </div>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-slate-800 dark:text-white">View Notifications</p>
                       <p className="text-xs text-slate-400">Stay updated on latest platform activity.</p>
                    </div>
                    <FiArrowRight className="text-slate-300" />
                 </Link>
                 {[
                   { to: '/investment-requests', label: 'Funding Proposals', desc: 'Review pending investor commitments.' },
                   { to: '/browse-startups', label: 'Explore Marketplace', desc: 'See what other founders are building.' },
                 ].map(item => (
                   <Link key={item.to} to={item.to} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-emerald-500/30 group duration-300">
                     <div className="flex-1">
                       <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-slate-900 transition-colors duration-300">{item.label}</p>
                       <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5 transition-colors duration-300">{item.desc}</p>
                     </div>
                     <FiArrowRight className="text-slate-300 dark:text-slate-600 mt-0.5 flex-shrink-0" />
                   </Link>
                 ))}
              </div>
           </div>
        </div>

        {/* QUICK ACTIONS & INSIGHTS */}
        <div className="space-y-10">
           <div className="card bg-slate-100 dark:bg-emerald-500/5 border-slate-200 dark:border-emerald-500/10 transition-colors duration-300">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Strategic Insights</h2>
              <div className="space-y-4">
                 <div className="p-4 bg-white dark:bg-[#0B0F0E] rounded-lg border border-slate-200 dark:border-white/5 transition-colors duration-300">
                    <p className="text-xs font-bold text-slate-600 dark:text-emerald-500 uppercase tracking-widest mb-1 transition-colors duration-300">Market Trend</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">AI-driven SaaS valuations have increased by 14% this quarter.</p>
                 </div>
                 <div className="p-4 bg-white dark:bg-[#0B0F0E] rounded-lg border border-slate-200 dark:border-white/5 transition-colors duration-300">
                    <p className="text-xs font-bold text-slate-600 dark:text-emerald-500 uppercase tracking-widest mb-1 transition-colors duration-300">Portfolio Health</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">Your ventures are 40% more active than the platform average.</p>
                 </div>
              </div>
           </div>

           <div className="card">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Quick Links</h2>
              <div className="space-y-4">
                 <Link to="/profile/edit" className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-emerald-500/5 transition-colors duration-300 border border-slate-100 dark:border-white/5 group">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-emerald-500 transition-colors">Update Profile</span>
                    <FiArrowRight className="text-slate-300 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-emerald-500 transition-colors" />
                 </Link>
                 <Link to="/notifications" className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-emerald-500/5 transition-colors duration-300 border border-slate-100 dark:border-white/5 group">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-emerald-500 transition-colors">Global Alerts</span>
                    <FiArrowRight className="text-slate-300 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-emerald-500 transition-colors" />
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FounderDashboard;