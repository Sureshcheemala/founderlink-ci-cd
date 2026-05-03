import { useEffect, useState } from "react";
import { getProfile, createOrUpdateProfile } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { FiUser, FiArrowLeft, FiCheck, FiInfo, FiMapPin, FiLinkedin, FiBriefcase, FiImage } from "react-icons/fi";

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-8">
    <span className="text-slate-400 dark:text-emerald-500 transition-colors">{icon}</span>
    <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] transition-colors duration-300">{title}</h3>
    <div className="h-[1px] bg-slate-100 dark:bg-white/5 flex-1 transition-colors duration-300" />
  </div>
);

const Label = ({ children }) => (
  <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 transition-colors duration-300">{children}</label>
);

const ProfileForm = () => {
  const [form, setForm] = useState({
    fullName: "", headline: "", location: "", bio: "",
    skills: "", experience: "", linkedinUrl: "", avatarUrl: "", portfolioLinks: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.data) {
          const data = res.data;
          setForm({
            fullName: data.fullName || data.name || "",
            headline: data.headline || "",
            location: data.location || "",
            bio: data.bio || "",
            skills: data.skills || "",
            experience: data.experience || "",
            linkedinUrl: data.linkedinUrl || "",
            avatarUrl: data.avatarUrl || "",
            portfolioLinks: data.portfolioLinks || ""
          });
          setIsNewUser(false);
        }
      } catch { setIsNewUser(true); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setError(""); setSuccess("");
    if (!form.fullName) { setError("Full name is required for platform verification."); return; }
    try {
      setSaving(true);
      await createOrUpdateProfile({ ...form, name: form.fullName });
      setSuccess(isNewUser ? "Profile initialized. Redirecting to dashboard..." : "Profile updated successfully.");
      if (isNewUser) setTimeout(() => navigate("/dashboard"), 1000);
    } catch { setError("Failed to save profile. Please try again."); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-slate-300/50 dark:border-emerald-500/20 border-t-slate-700 dark:border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-10 font-bold text-sm">
        <FiArrowLeft /> Back
      </button>

      <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 rounded-xl p-10 shadow-sm transition-colors duration-300">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 transition-colors duration-300">
          {isNewUser ? "Establish Your Professional Identity" : "Update Profile Records"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 transition-colors duration-300">
          Provide your credentials to engage with the FounderLink ecosystem.
        </p>

        {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 p-4 rounded-lg text-sm font-medium mb-8 transition-colors duration-300">{error}</div>}
        {success && <div className="bg-green-50 dark:bg-emerald-900/20 border border-green-200 dark:border-emerald-500/30 text-green-700 dark:text-emerald-400 p-4 rounded-lg text-sm font-medium mb-8 transition-colors duration-300">{success}</div>}

        <div className="space-y-12">
          {/* PERSONAL IDENTITY */}
          <section>
            <SectionHeader icon={<FiUser />} title="Personal Identity" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label>Legal Full Name <span className="text-red-500">*</span></Label>
                <input name="fullName" value={form.fullName} onChange={handleChange} className="input" placeholder="e.g. Jane Doe" />
              </div>
              <div className="md:col-span-2">
                <Label>Professional Headline</Label>
                <input name="headline" value={form.headline} onChange={handleChange} className="input" placeholder="e.g. Serial Entrepreneur | FinTech Specialist | Ex-Google" />
              </div>
              <div>
                <Label>Location</Label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="location" value={form.location} onChange={handleChange} className="input pl-11" placeholder="e.g. Bengaluru, India" />
                </div>
              </div>
              <div>
                <Label>Avatar URL</Label>
                <div className="relative">
                  <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="avatarUrl" value={form.avatarUrl} onChange={handleChange} className="input pl-11" placeholder="https://profile.com/avatar.jpg" />
                </div>
              </div>
            </div>
          </section>

          {/* CREDENTIALS */}
          <section>
            <SectionHeader icon={<FiBriefcase />} title="Credentials & Experience" />
            <div className="space-y-6">
              <div>
                <Label>Professional Bio</Label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows="5" className="input" placeholder="Describe your journey, achievements, and what you bring to a venture..." />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Core Skills & Verticals</Label>
                  <input name="skills" value={form.skills} onChange={handleChange} className="input" placeholder="e.g. AI, React, Fundraising (comma-separated)" />
                </div>
                <div>
                  <Label>Years of Domain Experience</Label>
                  <input name="experience" value={form.experience} onChange={handleChange} className="input" placeholder="e.g. 12+ Years in Enterprise SaaS" />
                </div>
              </div>
            </div>
          </section>

          {/* CONNECTIVITY */}
          <section>
            <SectionHeader icon={<FiLinkedin />} title="Connectivity" />
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>LinkedIn Profile URL</Label>
                <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} className="input" placeholder="https://linkedin.com/in/janedoe" />
              </div>
              <div>
                <Label>Portfolio / Personal Website</Label>
                <input name="portfolioLinks" value={form.portfolioLinks} onChange={handleChange} className="input" placeholder="https://janedoe.com" />
              </div>
            </div>
          </section>

          <div className="pt-8 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
            <button onClick={handleSave} disabled={saving}
              className="w-full btn-primary py-4 text-base font-bold uppercase tracking-widest flex items-center justify-center gap-3">
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (<>{isNewUser ? "Establish Identity" : "Update Records"} <FiCheck /></>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;