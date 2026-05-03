import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { requestFunding } from "../../services/investmentService";
import { FiArrowLeft, FiSend, FiDollarSign } from "react-icons/fi";

const RequestFunding = () => {
  const { startupId, email } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    try {
      setLoading(true);
      await requestFunding({
        startupId: Number(startupId),
        investorEmail: email,
        amount: Number(amount),
      });
      alert("Funding proposal transmitted successfully.");
      navigate("/dashboard");
    } catch {
      alert("Failed to transmit proposal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F0E] py-12 px-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-[#0f1513] p-10 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm transition-colors duration-300">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 font-bold text-xs uppercase tracking-widest">
          <FiArrowLeft /> Cancel
        </button>

        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Funding Proposal</h1>
        <p className="text-slate-500 font-medium mb-10 text-sm">Submit a capital request to your selected investor.</p>

        <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl mb-10">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Investor</p>
          <p className="text-lg font-bold text-slate-900">{email}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Institutional Investor Account</p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Requested Capital (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input pl-10 text-2xl font-bold tracking-tight"
                placeholder="1,000,000"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn-primary py-4 text-base font-bold flex items-center justify-center gap-3"
          >
            {loading ? "Transmitting..." : "Submit Proposal"} <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestFunding;