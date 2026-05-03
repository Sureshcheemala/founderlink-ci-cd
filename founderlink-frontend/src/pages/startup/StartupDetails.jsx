import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getStartupById } from "../../services/startupService";
import { getTeam, requestToJoin, inviteCofounder, getStartupRequests, acceptRequest, rejectRequest } from "../../services/teamService";
import { getStartupInvestments, getStartupFundingTotal } from "../../services/investmentService";
import { searchUsers } from "../../services/userService";
import { FiUsers, FiBriefcase, FiTarget, FiMail, FiArrowLeft, FiGlobe, FiLinkedin, FiCpu, FiPlus, FiSearch, FiCheck, FiX } from "react-icons/fi";

const StartupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [startup, setStartup] = useState(null);
  const [team, setTeam] = useState([]);
  const [requests, setRequests] = useState([]);
  const [totalFunding, setTotalFunding] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getStartupById(id);
      setStartup(res.data);
      const teamRes = await getTeam(id);
      setTeam(teamRes.data);
      const totalRes = await getStartupFundingTotal(id);
      setTotalFunding(totalRes.data);
      if (user?.role === "FOUNDER" && res.data.founderEmail === user?.email) {
        const invRes = await getStartupInvestments(id);
        const reqRes = await getStartupRequests(id);
        setRequests(reqRes.data);
      }
    } catch { setError("Failed to load startup profile."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id, user]);

  const handleJoinRequest = async () => {
    try {
      await requestToJoin({ startupId: id, role: "COFOUNDER" });
      alert("Join request transmitted successfully."); fetchData();
    } catch (err) { alert(err.response?.data?.message || "Failed to transmit request."); }
  };

  const handleSearchUsers = async () => {
    if (!searchTerm) return;
    try {
      setIsSearching(true);
      const res = await searchUsers(searchTerm);
      setSearchResults(res.data);
    } catch { console.error("Search failed"); }
    finally { setIsSearching(false); }
  };

  const handleInvite = async (targetEmail) => {
    try {
      await inviteCofounder({ startupId: id, userEmail: targetEmail, role: "COFOUNDER" });
      alert(`Invitation transmitted to ${targetEmail}`); fetchData();
    } catch (err) { alert(err.response?.data?.message || "Failed to send invite."); }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      if (action === "accept") await acceptRequest(requestId);
      else await rejectRequest(requestId);
      fetchData();
    } catch { alert("Operation failed."); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-slate-300/50 dark:border-emerald-500/20 border-t-slate-700 dark:border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );
  if (error) return <div className="p-12 text-center text-red-600 font-bold">{error}</div>;
  if (!startup) return null;

  const fundingPercent = Math.min(Math.round((totalFunding / startup.fundingGoal) * 100), 100);
  const isOwner = user?.email === startup.founderEmail;

  const tabs = ["overview", "team", isOwner && "recruitment", isOwner && "management"].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-emerald-500 transition-colors mb-10 font-bold text-sm">
        <FiArrowLeft /> Back to marketplace
      </button>

      {/* HEADER */}
      <div className="bg-white dark:bg-[#0B0F0E] border border-slate-200 dark:border-white/10 rounded-xl p-8 md:p-10 mb-8 shadow-sm overflow-hidden relative transition-colors duration-300">
        <div className="absolute top-0 right-0 p-8">
          <span className="badge px-4 py-1.5 uppercase tracking-widest">{startup.stage}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-emerald-500/10 flex items-center justify-center text-3xl font-bold text-slate-700 dark:text-emerald-500 border border-slate-200 dark:border-emerald-500/20 shadow-inner flex-shrink-0 transition-colors duration-300">
            {startup.logoUrl ? <img src={startup.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-2xl" /> : startup.name[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-1 transition-colors duration-300">{startup.name}</h1>
            {startup.tagline && <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mb-4 italic transition-colors duration-300">{startup.tagline}</p>}
            <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors duration-300">
              <span className="flex items-center gap-2"><FiBriefcase className="text-slate-400 dark:text-emerald-500 transition-colors" /> {startup.industry}</span>
              {startup.websiteUrl && (
                <a href={startup.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-emerald-400 transition-colors">
                  <FiGlobe className="text-slate-400 dark:text-emerald-500" /> Website
                </a>
              )}
              {startup.linkedinUrl && (
                <a href={startup.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-emerald-400 transition-colors">
                  <FiLinkedin className="text-slate-400 dark:text-emerald-500" /> LinkedIn
                </a>
              )}
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {user?.role === "INVESTOR" && (
              <button onClick={() => navigate(`/invest/${startup.id}`)} className="btn-primary flex-1 md:flex-none py-3 px-6">Commit Capital</button>
            )}
            {user?.role === "COFOUNDER" && !team.find(t => t.userEmail === user.email) && (
              <button onClick={handleJoinRequest} className="btn-primary flex-1 md:flex-none py-3 px-6">Request to Join</button>
            )}
            {isOwner && (
              <button onClick={() => navigate(`/founder/edit/${startup.id}`)} className="btn-secondary flex-1 md:flex-none py-3 px-6">Manage Profile</button>
            )}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 dark:border-white/10 mb-8 overflow-x-auto bg-white dark:bg-[#0B0F0E] rounded-t-xl px-4 transition-colors duration-300">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? "border-slate-900 dark:border-emerald-500 text-slate-900 dark:text-emerald-500"
                : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="card">
                <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-white/5 pb-4 transition-colors duration-300">Executive Summary</h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-base whitespace-pre-line transition-colors duration-300">{startup.description}</p>
              </div>
              {(startup.problemStatement || startup.solution) && (
                <div className="grid md:grid-cols-2 gap-8">
                  {startup.problemStatement && (
                    <div className="card">
                      <div className="flex items-center gap-3 mb-5">
                        <FiTarget className="text-slate-500 dark:text-emerald-500 transition-colors" />
                        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Market Friction</h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed transition-colors duration-300">{startup.problemStatement}</p>
                    </div>
                  )}
                  {startup.solution && (
                    <div className="card">
                      <div className="flex items-center gap-3 mb-5">
                        <FiCpu className="text-slate-500 dark:text-emerald-500 transition-colors" />
                        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Strategic Solution</h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed transition-colors duration-300">{startup.solution}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TEAM */}
          {activeTab === "team" && (
            <div className="card">
              <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8 border-b border-slate-100 dark:border-white/5 pb-4 transition-colors duration-300">Executive Team</h2>
              {/* Founder row */}
              <div className="mb-4">
                <div className="flex items-center gap-5 p-5 rounded-xl bg-slate-50 dark:bg-transparent border border-slate-100 dark:border-white/5 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-[#0B0F0E] border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold transition-colors duration-300">
                    {startup.founderEmail?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white transition-colors duration-300">{startup.founderEmail}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-0.5">FOUNDER</p>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {team.length === 0 ? (
                  <p className="text-slate-500 italic py-8 text-center col-span-2 text-sm">No additional team members yet.</p>
                ) : (
                  team.map((m) => (
                    <div key={m.id} className="flex items-center gap-5 p-5 rounded-xl bg-slate-50 dark:bg-transparent border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-emerald-500/30 transition-colors duration-300">
                      <div className="w-12 h-12 rounded-full bg-white dark:bg-[#0B0F0E] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-emerald-500 font-bold transition-colors duration-300">
                        {m.userEmail[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white transition-colors duration-300">{m.userEmail}</p>
                        <p className="text-[10px] text-slate-500 dark:text-emerald-500 font-black uppercase tracking-widest mt-0.5 transition-colors duration-300">{m.role}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* RECRUITMENT */}
          {activeTab === "recruitment" && isOwner && (
            <div className="space-y-8">
              <div className="card bg-slate-800 dark:bg-emerald-900/20 text-white border-none overflow-hidden relative transition-colors duration-300">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 dark:bg-emerald-500/5 rounded-full blur-3xl" />
                <h2 className="text-xl font-bold mb-1">Talent Acquisition</h2>
                <p className="text-slate-400 font-medium mb-6 text-sm">Search for strategic partners and technical co-founders.</p>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search by name or skills..." value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearchUsers()}
                      className="w-full bg-white dark:bg-[#0B0F0E] text-slate-900 dark:text-white rounded-lg pl-11 pr-4 py-3 font-medium outline-none transition-colors duration-300" />
                  </div>
                  <button onClick={handleSearchUsers} disabled={isSearching}
                    className="bg-white dark:bg-emerald-500 text-slate-800 dark:text-[#0B0F0E] px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity">
                    {isSearching ? "..." : "Search"}
                  </button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="card">
                  <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 transition-colors duration-300">Candidates ({searchResults.length})</h3>
                  <div className="space-y-4">
                    {searchResults.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-5 rounded-xl bg-slate-50 dark:bg-transparent border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-emerald-500/30 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full bg-white dark:bg-[#0B0F0E] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-emerald-500 font-bold transition-colors duration-300">
                            {u.name?.[0] || u.email[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white transition-colors duration-300">{u.name || u.email}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 transition-colors duration-300">{u.skills || "No skills listed"}</p>
                          </div>
                        </div>
                        <button onClick={() => handleInvite(u.email)} className="btn-primary py-1.5 px-5 text-xs flex items-center gap-2">
                          <FiPlus /> Invite
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MANAGEMENT */}
          {activeTab === "management" && isOwner && (
            <div className="card">
              <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8 border-b border-slate-100 dark:border-white/5 pb-4 transition-colors duration-300">Incoming Requests</h2>
              <div className="space-y-4">
                {requests.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-xl">
                    <FiUsers className="text-4xl text-slate-200 dark:text-slate-700 mx-auto mb-3 transition-colors duration-300" />
                    <p className="text-slate-400 text-sm font-medium">No pending join requests.</p>
                  </div>
                ) : (
                  requests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-6 rounded-xl bg-slate-50 dark:bg-[#0B0F0E]/50 border border-slate-100 dark:border-white/5 transition-colors duration-300">
                      <div className="flex items-center gap-5">
                        <div className="w-11 h-11 rounded-full bg-white dark:bg-[#0B0F0E] border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-slate-700 dark:text-white shadow-sm transition-colors duration-300">
                          {req.userEmail[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm transition-colors duration-300">{req.userEmail}</p>
                          <p className="text-[10px] text-slate-500 dark:text-emerald-500 font-black uppercase tracking-widest mt-0.5 transition-colors duration-300">{req.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleRequestAction(req.id, "accept")} className="bg-green-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition flex items-center gap-1.5"><FiCheck /> Accept</button>
                        <button onClick={() => handleRequestAction(req.id, "reject")} className="text-red-600 hover:text-red-700 font-bold text-sm px-5 py-2 border border-red-200 dark:border-red-900/30 bg-white dark:bg-transparent rounded-lg transition flex items-center gap-1.5"><FiX /> Decline</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          {/* Funding Card */}
          <div className="card bg-slate-900 dark:bg-emerald-950/20 text-white border-none relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 right-0 p-4">
              <FiTarget className="text-white/10 dark:text-emerald-500/10 text-6xl transition-colors duration-300" />
            </div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Capitalization Target</h3>
            <p className="text-4xl font-black mb-3 tracking-tighter">₹{startup.fundingGoal.toLocaleString()}</p>
            <p className="text-sm font-bold text-emerald-400 mb-4 tracking-tight">Committed: ₹{totalFunding.toLocaleString()}</p>
            <div className="w-full bg-slate-800 dark:bg-[#0B0F0E] rounded-full h-2.5 mb-3 shadow-inner">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.4)]" style={{ width: `${fundingPercent}%` }} />
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{fundingPercent}% Funded</p>
          </div>

          {/* Contacts */}
          <div className="card">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-white/5 pb-4 transition-colors duration-300">Contact & Links</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors duration-300">
                <FiMail className="text-slate-400 dark:text-emerald-500 transition-colors flex-shrink-0" />
                <span className="font-medium text-sm truncate">{startup.founderEmail}</span>
              </div>
              {startup.websiteUrl && (
                <a href={startup.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-emerald-400 transition-colors duration-300">
                  <FiGlobe className="text-slate-400 dark:text-emerald-500 flex-shrink-0" />
                  <span className="font-medium text-sm truncate">Venture Website</span>
                </a>
              )}
              {startup.linkedinUrl && (
                <a href={startup.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-emerald-400 transition-colors duration-300">
                  <FiLinkedin className="text-slate-400 dark:text-emerald-500 flex-shrink-0" />
                  <span className="font-medium text-sm truncate">LinkedIn Profile</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetails;