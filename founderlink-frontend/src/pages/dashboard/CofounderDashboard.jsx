import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiUsers, FiMail, FiSearch, FiArrowRight, FiActivity, FiStar, FiCheckCircle } from "react-icons/fi";
import { getMyRequests } from "../../services/teamService";
import { getProfile } from "../../services/userService";

const CofounderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({ pendingInvites: 0, activeRoles: 0, sentApplications: 0 });
  const [loading, setLoading] = useState(true);
  const [recentInvites, setRecentInvites] = useState([]);
  const [activeTeams, setActiveTeams] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reqRes, profileRes] = await Promise.allSettled([
          getMyRequests(),
          getProfile(),
        ]);

        if (reqRes.status === "fulfilled") {
          const requests = reqRes.value.data;
          const invites = requests.filter(r => r.status === 'INVITED' && r.type === 'INVITE');
          const active = requests.filter(r => r.status === 'ACCEPTED');
          const sent = requests.filter(r => r.status === 'REQUESTED');

          setStats({ pendingInvites: invites.length, activeRoles: active.length, sentApplications: sent.length });
          setRecentInvites(invites.slice(0, 3));
          setActiveTeams(active.slice(0, 3));
        }

        if (profileRes.status === "fulfilled") {
          setProfile(profileRes.value.data);
        }
      } catch { console.error("Cofounder dashboard sync failure."); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-12 h-12 border-4 border-slate-300/50 dark:border-emerald-500/20 border-t-slate-700 dark:border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  const displayName = profile?.name || user?.name || "Executive";
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      {/* HEADER */}
      <div className="mb-10 border-b border-slate-200 dark:border-white/5 pb-8 flex justify-between items-end transition-colors duration-300">
        <div>
          <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Welcome back</p>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">
            {displayName.split(" ")[0]}'s Hub
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium transition-colors duration-300">Manage your venture invitations and executive applications.</p>
        </div>
        <Link to="/browse-startups" className="btn-primary flex items-center gap-2 py-3 px-6">
          <FiSearch /> Discover Startups
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: <FiMail />, label: "Pending Invites", value: stats.pendingInvites, warn: stats.pendingInvites > 0, link: "/team-requests" },
          { icon: <FiUsers />, label: "Active Ventures", value: stats.activeRoles, accent: stats.activeRoles > 0 },
          { icon: <FiActivity />, label: "Sent Applications", value: stats.sentApplications },
        ].map((s, i) => (
          <div key={i} onClick={s.link ? () => navigate(s.link) : undefined}
            className={`bg-white dark:bg-[#0f1513] p-7 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group hover:border-slate-400 dark:hover:border-emerald-500/30 transition-all duration-300 ${s.link ? 'cursor-pointer' : ''}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-6xl text-slate-900 dark:text-white">{s.icon}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{s.label}</p>
            <p className={`text-4xl font-black tracking-tighter transition-colors duration-300 ${s.warn ? 'text-amber-600 dark:text-amber-400' : s.accent ? 'text-green-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* PENDING INVITATIONS */}
          <div className="card">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-white/5 pb-4 transition-colors duration-300">
              <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Pending Invitations</h2>
              <Link to="/team-requests" className="text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 dark:hover:text-emerald-400 transition-colors">View All</Link>
            </div>
            <div className="space-y-4">
              {recentInvites.length === 0 ? (
                <div className="py-14 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-xl transition-colors duration-300">
                  <FiMail className="text-4xl text-slate-200 dark:text-slate-700 mx-auto mb-4 transition-colors duration-300" />
                  <p className="text-slate-400 font-medium text-sm">No new invitations received.</p>
                  <Link to="/browse-startups" className="mt-4 inline-block text-sm font-bold text-slate-700 dark:text-emerald-400 hover:underline transition-colors">Explore startups →</Link>
                </div>
              ) : (
                recentInvites.map(inv => (
                  <div key={inv.id} className="flex items-center justify-between p-5 rounded-xl bg-slate-50 dark:bg-transparent border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-emerald-500/30 transition-all group duration-300">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0B0F0E] border border-slate-200 dark:border-white/10 flex items-center justify-center text-xl font-bold text-slate-600 dark:text-emerald-500 shadow-sm transition-all">
                        {inv.startupName?.[0] || 'S'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm transition-colors duration-300">{inv.startupName || `Startup #${inv.startupId}`}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">Invited as {inv.role}</p>
                      </div>
                    </div>
                    <button onClick={() => navigate('/team-requests')} className="btn-primary py-1.5 px-5 text-xs">Review</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ACTIVE VENTURES */}
          {activeTeams.length > 0 && (
            <div className="card">
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-white/5 pb-4 transition-colors duration-300">
                <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Ventures</h2>
              </div>
              <div className="space-y-4">
                {activeTeams.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-5 rounded-xl bg-slate-50 dark:bg-transparent border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-emerald-500/30 transition-all group duration-300">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0B0F0E] border border-slate-200 dark:border-white/10 flex items-center justify-center text-xl font-bold text-slate-600 dark:text-emerald-500 shadow-sm transition-all">
                        {t.startupName?.[0] || 'S'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm transition-colors duration-300">{t.startupName || `Startup #${t.startupId}`}</h3>
                        <p className="text-xs text-green-600 dark:text-emerald-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1"><FiCheckCircle className="text-xs" /> Active · {t.role}</p>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/startup/${t.startupId}`)} className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-emerald-500 transition-colors">
                      <FiArrowRight />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="card bg-slate-50 dark:bg-[#0f1513] border-slate-100 dark:border-white/5 transition-colors duration-300">
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 transition-colors duration-300">Talent Identity</h2>
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-white dark:bg-[#0B0F0E] border border-slate-200 dark:border-white/10 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-slate-600 dark:text-emerald-500 shadow-sm transition-colors duration-300">
                {initials}
              </div>
              <p className="font-bold text-slate-900 dark:text-white transition-colors duration-300">{displayName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors duration-300">
                {profile?.skills?.split(",")[0]?.trim() || "Co-founder"}
              </p>
              {profile?.bio && (
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-3 leading-relaxed italic px-2 line-clamp-2 transition-colors duration-300">
                  "{profile.bio}"
                </p>
              )}
            </div>
            <button onClick={() => navigate('/profile/edit')} className="w-full btn-secondary text-xs py-3 mt-4">Enhance Visibility</button>
          </div>

          {/* Discovery */}
          <div className="card">
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 transition-colors duration-300">Discovery</h2>
            <div className="space-y-3">
              {[
                { to: "/browse-startups", label: "Venture Marketplace" },
                { to: "/team-requests", label: "Invitation History" },
                { to: "/profile", label: "View My Profile" },
              ].map(l => (
                <Link key={l.to} to={l.to} className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-slate-100 dark:border-white/5 group duration-300">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{l.label}</span>
                  <FiArrowRight className="text-slate-300 dark:text-slate-600" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CofounderDashboard;
