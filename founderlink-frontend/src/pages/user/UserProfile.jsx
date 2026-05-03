import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../../services/userService";
import { FiArrowLeft, FiInfo, FiBriefcase, FiMail, FiLinkedin } from "react-icons/fi";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getUserById(id);
        setUser(res.data);
      } catch { console.error("Failed to load user profile."); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-slate-300/50 dark:border-emerald-500/20 border-t-slate-700 dark:border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="max-w-md mx-auto py-20 text-center">
      <p className="text-slate-500 dark:text-slate-400 font-medium">User profile not found.</p>
      <button onClick={() => navigate(-1)} className="mt-4 btn-secondary px-6">Go Back</button>
    </div>
  );

  const initials = (user.name || user.email || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const skills = user.skills ? user.skills.split(",").map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-10 font-bold text-sm">
        <FiArrowLeft /> Back
      </button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT SIDEBAR */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 rounded-xl p-8 text-center shadow-sm transition-colors duration-300">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-[#0B0F0E] border border-slate-200 dark:border-white/10 flex items-center justify-center text-3xl font-bold text-slate-600 dark:text-emerald-500 mx-auto mb-5 shadow-inner transition-colors duration-300">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-300">{user.name || "Anonymous Executive"}</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-4 transition-colors duration-300">Verified Executive</p>
            {user.email && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                <FiMail className="text-slate-400 dark:text-emerald-500 text-xs" />
                <span className="truncate font-medium text-xs">{user.email}</span>
              </div>
            )}
            {user.linkedinUrl && (
              <a href={user.linkedinUrl} target="_blank" rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-emerald-400 transition-colors duration-300">
                <FiLinkedin className="text-slate-400 dark:text-emerald-500 text-xs" /> LinkedIn Profile
              </a>
            )}
          </div>

          {skills.length > 0 && (
            <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 rounded-xl p-6 shadow-sm transition-colors duration-300">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-4 transition-colors duration-300">Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => <span key={i} className="badge">{skill}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* MAIN CONTENT */}
        <div className="md:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-5 border-b border-slate-100 dark:border-white/5 pb-4 transition-colors duration-300">
              <FiInfo className="text-slate-400 dark:text-emerald-500 transition-colors" />
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors duration-300">About</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-sm transition-colors duration-300">
              {user.bio || <span className="italic text-slate-400">No bio provided.</span>}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-5 border-b border-slate-100 dark:border-white/5 pb-4 transition-colors duration-300">
              <FiBriefcase className="text-slate-400 dark:text-emerald-500 transition-colors" />
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors duration-300">Credentials</h3>
            </div>
            <div className="space-y-5">
              {user.experience && (
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-2 transition-colors duration-300">Experience</p>
                  <p className="text-slate-700 dark:text-slate-300 font-medium text-sm transition-colors duration-300">{user.experience}</p>
                </div>
              )}
              {skills.length === 0 && !user.experience && (
                <p className="text-slate-400 italic text-sm">No professional details shared.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;