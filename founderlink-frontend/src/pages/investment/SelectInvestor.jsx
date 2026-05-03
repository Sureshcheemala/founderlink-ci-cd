import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllUsers } from "../../services/userService";
import { FiSearch, FiUser, FiArrowLeft, FiPlus } from "react-icons/fi";

const SelectInvestor = () => {
  const { startupId } = useParams();
  const navigate = useNavigate();

  const [investors, setInvestors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getAllUsers();
        const filtered = res.data.filter((u) => u.role === "INVESTOR");
        setInvestors(filtered);
      } catch {
        console.error("Failed to load investor directory.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredList = investors.filter((i) =>
    i.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 border-b border-slate-200 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4 font-bold text-sm">
          <FiArrowLeft /> Back
        </button>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Investor Directory</h1>
        <p className="text-slate-600 mt-2 font-medium">Select an institutional investor to submit a funding proposal.</p>
      </div>

      <div className="relative mb-10">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
        <input
          placeholder="Search by identity or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-12 py-4"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-300/50 border-t-slate-700 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="grid gap-6">
        {filteredList.length === 0 && !loading ? (
          <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 border-dashed rounded-xl py-20 text-center text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">
            No investors found matching your search.
          </div>
        ) : (
          filteredList.map((inv) => (
            <div
              key={inv.id}
              className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-slate-400 duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-slate-100 group-hover:text-slate-900 transition-colors">
                  {inv.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">{inv.email}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Institutional Investor</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/founder/startup/${startupId}/request/${inv.email}`)}
                className="btn-primary py-2.5 px-8 text-sm flex items-center gap-2"
              >
                <FiPlus /> Initiate Proposal
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectInvestor;