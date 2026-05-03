import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyStartups, deleteStartup } from "../../services/startupService";
import { FiPlus, FiEye, FiEdit3, FiTrash2, FiBriefcase } from "react-icons/fi";

const MyStartups = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await getMyStartups();
        setStartups(res.data);
      } catch (err) {
        setError("Failed to synchronize venture records.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this startup profile? This action cannot be undone.")) return;
    try {
      await deleteStartup(id);
      setStartups((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Delete operation failed.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-slate-200 dark:border-white/5 pb-10 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">My Ventures</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium transition-colors duration-300">Manage and monitor your active startup profiles.</p>
        </div>
        <Link to="/create-startup" className="btn-primary flex items-center gap-2">
          <FiPlus /> Create New Startup
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-300/50 dark:border-emerald-500/20 border-t-slate-700 dark:border-t-emerald-500 rounded-full animate-spin transition-colors duration-300"></div>
        </div>
      )}

      {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg mb-8 font-medium transition-colors duration-300">{error}</div>}

      {!loading && startups.length === 0 && (
        <div className="bg-white dark:bg-[#0B0F0E] border border-slate-200 dark:border-white/10 border-dashed rounded-xl py-32 text-center transition-colors duration-300">
          <FiBriefcase className="text-5xl text-slate-300 dark:text-slate-700 mx-auto mb-6 transition-colors duration-300" />
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 font-medium transition-colors duration-300">You haven't listed any startups yet.</p>
          <Link to="/create-startup" className="btn-primary px-8">Launch Your First Venture</Link>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {startups.map((s) => (
          <div key={s.id} className="card group hover:border-slate-400 dark:hover:border-emerald-500/30 duration-300 flex flex-col h-full transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-emerald-500/10 flex items-center justify-center text-xl font-bold text-blue-600 dark:text-emerald-500 border border-slate-200 dark:border-emerald-500/20 transition-colors duration-300">
                  {s.name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{s.name}</h3>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors duration-300">{s.industry}</span>
                    <span className="badge">{s.stage}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed line-clamp-2 font-medium flex-1 transition-colors duration-300">
              {s.description}
            </p>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center transition-colors duration-300">
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-0.5 transition-colors duration-300">Target Capital</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">₹{s.fundingGoal.toLocaleString()}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => navigate(`/startup/${s.id}`)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-emerald-500 transition-colors" title="View Profile">
                  <FiEye className="text-xl" />
                </button>
                <button onClick={() => navigate(`/founder/edit/${s.id}`)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-emerald-500 transition-colors" title="Edit Profile">
                  <FiEdit3 className="text-xl" />
                </button>
                <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Delete Profile">
                  <FiTrash2 className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyStartups;