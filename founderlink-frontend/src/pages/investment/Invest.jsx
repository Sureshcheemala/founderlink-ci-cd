import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { invest } from "../../services/investmentService";
import { getStartupById } from "../../services/startupService";
import { FiArrowLeft, FiDollarSign, FiShield, FiTrendingUp, FiCheck } from "react-icons/fi";

const QUICK_AMOUNTS = [25000, 50000, 100000, 250000, 500000];

const Invest = () => {
  const { startupId } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const res = await getStartupById(startupId);
        setStartup(res.data);
      } catch { setStartup(null); }
    };
    fetchStartup();
  }, [startupId]);

  const handleInvest = async () => {
    setError(""); setSuccess("");
    if (!amount || Number(amount) <= 0) { setError("Please specify a valid investment amount."); return; }
    try {
      setLoading(true);
      await invest({ startupId: Number(startupId), amount: Number(amount) });
      setSuccess("Capital commitment registered! Redirecting...");
      setTimeout(() => navigate("/my-investments"), 1200);
    } catch { setError("Transaction failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F0E] py-12 px-4 transition-colors duration-300">
      <div className="max-w-lg w-full">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 font-bold text-xs uppercase tracking-widest">
          <FiArrowLeft /> Cancel
        </button>

        <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm transition-colors duration-300">
          {/* Header */}
          <div className="bg-slate-900 dark:bg-[#050807] p-8 relative overflow-hidden transition-colors duration-300">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Capital Commitment</p>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {startup ? startup.name : "Loading venture..."}
            </h1>
            {startup && (
              <div className="flex items-center gap-4 mt-3">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{startup.industry}</span>
                <span className="badge">{startup.stage}</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <FiTrendingUp /> Goal: ₹{startup.fundingGoal?.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Form body */}
          <div className="p-8 space-y-6">
            {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 p-4 rounded-lg text-sm font-medium transition-colors duration-300">{error}</div>}
            {success && <div className="bg-green-50 dark:bg-emerald-900/20 border border-green-200 dark:border-emerald-500/30 text-green-700 dark:text-emerald-400 p-4 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-300"><FiCheck /> {success}</div>}

            <div>
              <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-3 transition-colors duration-300">Investment Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">₹</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  className="input pl-10 text-2xl font-bold tracking-tight" placeholder="0" />
              </div>
            </div>

            {/* Quick-pick amounts */}
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 transition-colors duration-300">Quick Select</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map(v => (
                  <button key={v} onClick={() => setAmount(String(v))}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all duration-200 ${
                      Number(amount) === v
                        ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-[#0B0F0E] border-slate-900 dark:border-emerald-500'
                        : 'bg-slate-50 dark:bg-transparent border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-emerald-500/50'
                    }`}>
                    ₹{v.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 dark:bg-[#0B0F0E]/50 p-4 rounded-lg border border-slate-100 dark:border-white/5 transition-colors duration-300">
              <FiShield className="text-slate-500 dark:text-emerald-500 mt-0.5 flex-shrink-0 transition-colors" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed transition-colors duration-300">
                By proceeding, you acknowledge this is a formal capital commitment subject to verification and final approval by the venture founders.
              </p>
            </div>

            <button onClick={handleInvest} disabled={loading || !amount}
              className="w-full btn-primary py-4 text-base font-bold flex items-center justify-center gap-3 disabled:opacity-50">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (<>Submit Commitment <FiDollarSign /></>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invest;