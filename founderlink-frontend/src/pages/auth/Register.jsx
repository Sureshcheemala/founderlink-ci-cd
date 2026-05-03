import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import { FiUser, FiMail, FiLock, FiBriefcase, FiArrowRight, FiCheckCircle } from "react-icons/fi";

const PERKS = [
  "Connect with verified institutional investors",
  "Build your executive team from a curated talent pool",
  "Track your funding rounds in real-time",
  "Access deal flow analytics and market intelligence",
];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "FOUNDER" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    setError(""); setSuccess("");
    if (!form.name || !form.email || !form.password) { setError("All fields are required."); return; }
    try {
      setLoading(true);
      await register({ ...form, role: `ROLE_${form.role}` });
      setSuccess("Account created successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-[#0B0F0E] transition-colors duration-300">
      {/* LEFT: Brand Info Panel — always dark for branding */}
      <div className="hidden lg:flex w-[55%] flex-col justify-between p-16 relative overflow-hidden
        bg-slate-50 dark:bg-[#050807] border-r border-slate-200 dark:border-transparent transition-colors duration-300">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Founder<span className="text-emerald-500">Link</span>
          </span>
        </div>

        <div className="relative z-10 space-y-3">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2">Join 500+ Founders</p>
          <h2 className="text-4xl xl:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            Build your venture{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
              the right way.
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base font-medium leading-relaxed max-w-md">
            Get access to India's most curated startup-investor marketplace — where deals are structured, teams are built, and growth is engineered.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">What you get</p>
          {PERKS.map((perk, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <FiCheckCircle className="text-emerald-400 text-xs" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">{perk}</p>
            </div>
          ))}
        </div>

        <div className="relative z-10 p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] shadow-sm dark:shadow-none transition-colors duration-300">
          <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-relaxed italic mb-4">
            "FounderLink completely changed how I think about building a team and raising capital. The quality of connections here is unmatched."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">R</div>
            <div>
              <p className="text-slate-900 dark:text-white font-bold text-sm">Rahul Sharma</p>
              <p className="text-slate-500 text-xs font-medium">Founder, NexusTech · Seed Round ₹1.2Cr</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Register Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 py-12 bg-white dark:bg-[#0f1513] transition-colors duration-300">
        <div className="mb-10 lg:hidden">
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Founder<span className="text-emerald-500">Link</span>
          </span>
        </div>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 transition-colors duration-300">Create your account</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 transition-colors duration-300">Join the FounderLink ecosystem today.</p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 p-4 rounded-lg text-sm font-medium mb-6 transition-colors duration-300">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-emerald-900/20 border border-green-200 dark:border-emerald-500/30 text-green-700 dark:text-emerald-400 p-4 rounded-lg text-sm font-medium mb-6 transition-colors duration-300">{success}</div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="name" value={form.name} onChange={handleChange} className="input pl-11" placeholder="Jane Doe" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="email" type="email" value={form.email} onChange={handleChange} className="input pl-11" placeholder="jane@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="password" type="password" value={form.password} onChange={handleChange} className="input pl-11" placeholder="••••••••" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Primary Role</label>
              <div className="relative">
                <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                <select name="role" value={form.role} onChange={handleChange} className="input pl-11 appearance-none font-medium cursor-pointer">
                  <option value="FOUNDER">Founder</option>
                  <option value="INVESTOR">Investor</option>
                  <option value="COFOUNDER">Co-founder / Executive</option>
                </select>
              </div>
            </div>

            <button onClick={handleRegister} disabled={loading}
              className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-3 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (<>Create Account <FiArrowRight /></>)}
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")}
                className="text-slate-800 dark:text-emerald-400 hover:underline font-bold transition-colors duration-300">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;