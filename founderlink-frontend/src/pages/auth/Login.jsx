import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { loginSuccess } from "../../features/auth/authSlice";
import { getProfile } from "../../services/userService";
import { FiMail, FiLock, FiArrowRight, FiTrendingUp, FiUsers, FiShield, FiZap } from "react-icons/fi";

const FEATURES = [
  { icon: <FiTrendingUp />, title: "Smart Capital Matching", desc: "AI-powered matchmaking connects founders with investors at the right stage." },
  { icon: <FiUsers />, title: "Executive Team Builder", desc: "Discover vetted co-founders and domain experts aligned with your mission." },
  { icon: <FiShield />, title: "Verified Ecosystem", desc: "Every founder, investor, and co-founder is identity-verified." },
  { icon: <FiZap />, title: "Real-time Deal Flow", desc: "Track funding rounds, team requests, and portfolio events live." },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) { setError("Please enter your credentials."); return; }
    try {
      setLoading(true);
      const res = await login({ email: email.trim(), password: password.trim() });
      dispatch(loginSuccess({ token: res.data.accessToken, email, role: res.data.role }));
      try {
        const profileRes = await getProfile();
        navigate(profileRes.data ? "/dashboard" : "/profile/edit");
      } catch { navigate("/profile/edit"); }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-[#0B0F0E] transition-colors duration-300">
      {/* LEFT: Brand Info Panel — theme-aware */}
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

        <div className="relative z-10 space-y-4">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2">The Venture Ecosystem</p>
          <h2 className="text-4xl xl:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            Where capital meets{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
              ambition.
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base font-medium leading-relaxed max-w-md">
            FounderLink is the institutional-grade platform connecting visionary founders with strategic investors and world-class co-founders.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:bg-slate-50 dark:hover:bg-white/[0.05] hover:shadow-sm dark:hover:shadow-none transition-all duration-300">
              <div className="mt-0.5 w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">{f.title}</p>
                <p className="text-slate-600 dark:text-slate-500 text-xs font-medium leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 flex gap-10 pt-8 border-t border-slate-200 dark:border-white/5">
          {[["500+", "Verified Founders"], ["₹2Cr+", "Capital Deployed"], ["98%", "Success Rate"]].map(([val, label]) => (
            <div key={label}>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{val}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Login Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 py-12 bg-white dark:bg-[#0f1513] transition-colors duration-300">
        <div className="mb-10 lg:hidden">
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Founder<span className="text-emerald-500">Link</span>
          </span>
        </div>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 transition-colors duration-300">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 transition-colors duration-300">Sign in to your FounderLink account</p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 p-4 rounded-lg text-sm font-medium mb-6 transition-colors duration-300">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()} className="input pl-11" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()} className="input pl-11" placeholder="••••••••" />
              </div>
            </div>

            <button onClick={handleLogin} disabled={loading}
              className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-3 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (<>Sign In <FiArrowRight /></>)}
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
              Don't have an account?{" "}
              <button onClick={() => navigate("/register")}
                className="text-slate-800 dark:text-emerald-400 hover:underline font-bold transition-colors duration-300">
                Create one free
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;