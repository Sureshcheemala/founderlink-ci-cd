import { useEffect, useState } from "react";
import { getProfile } from "../../services/userService";
import { Link, Navigate } from "react-router-dom";
import { FiEdit3, FiInfo, FiBriefcase, FiMail } from "react-icons/fi";

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch { console.error("Failed to load profile"); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-slate-300/50 dark:border-emerald-500/20 border-t-slate-700 dark:border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  if (!profile) return <Navigate to="/profile/edit" replace />;

  const initials = (profile.name || profile.email || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const skills = profile.skills ? profile.skills.split(",").map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="flex justify-between items-center mb-10 border-b border-slate-200 dark:border-white/5 pb-8 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">My Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium transition-colors duration-300">Your professional presence in the ecosystem.</p>
        </div>
        <Link to="/profile/edit" className="btn-secondary flex items-center gap-2">
          <FiEdit3 /> Edit Profile
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT SIDEBAR */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 rounded-xl p-8 text-center shadow-sm transition-colors duration-300">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-[#0B0F0E] border border-slate-200 dark:border-white/10 flex items-center justify-center text-3xl font-bold text-slate-600 dark:text-emerald-500 mx-auto mb-5 shadow-inner transition-colors duration-300">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-300">{profile.name || "Anonymous User"}</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-4 transition-colors duration-300">Verified Member</p>
            {profile.email && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                <FiMail className="text-slate-400 dark:text-emerald-500 transition-colors" />
                <span className="truncate font-medium">{profile.email}</span>
              </div>
            )}
          </div>

          {skills.length > 0 && (
            <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 rounded-xl p-6 shadow-sm transition-colors duration-300">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-4 transition-colors duration-300">Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="badge">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MAIN CONTENT */}
        <div className="md:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-5 border-b border-slate-100 dark:border-white/5 pb-4 transition-colors duration-300">
              <FiInfo className="text-slate-400 dark:text-emerald-500 transition-colors" />
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors duration-300">Biography</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-sm transition-colors duration-300">
              {profile.bio || <span className="italic text-slate-400">No bio provided. <Link to="/profile/edit" className="underline hover:text-slate-900 dark:hover:text-emerald-400 transition-colors">Add one →</Link></span>}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-5 border-b border-slate-100 dark:border-white/5 pb-4 transition-colors duration-300">
              <FiBriefcase className="text-slate-400 dark:text-emerald-500 transition-colors" />
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors duration-300">Professional Details</h3>
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-2 transition-colors duration-300">Experience</p>
                <p className="text-slate-700 dark:text-slate-300 font-medium text-sm transition-colors duration-300">
                  {profile.experience || <span className="italic text-slate-400">Not provided</span>}
                </p>
              </div>
              {skills.length === 0 && (
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-2 transition-colors duration-300">Core Expertise</p>
                  <p className="text-slate-400 italic text-sm">
                    No skills listed. <Link to="/profile/edit" className="underline hover:text-slate-900 dark:hover:text-emerald-400 transition-colors">Add skills →</Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;