import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStartups } from "../../features/startup/startupSlice";
import FilterBar from "../../components/startup/FilterBar";
import { FiBriefcase, FiTrendingUp } from "react-icons/fi";

const BrowseStartups = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { startups, loading, error, page, totalPages } = useSelector(state => state.startups);
  const filters = useSelector(state => state.startupFilters);

  useEffect(() => { dispatch(fetchStartups(filters, 0)); }, [filters, dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 transition-colors duration-300">Startup Marketplace</h1>
        <p className="text-slate-600 dark:text-slate-400 text-base font-medium transition-colors duration-300">
          Discover high-potential ventures and connect with founders building the future.
        </p>
      </div>

      <div className="mb-8">
        <FilterBar />
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-300/50 dark:border-emerald-500/20 border-t-slate-700 dark:border-t-emerald-500 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg mb-8 font-medium transition-colors duration-300">
          {error}
        </div>
      )}

      {!loading && (startups?.length ?? 0) === 0 && (
        <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 rounded-xl py-20 text-center transition-colors duration-300">
          <FiTrendingUp className="text-5xl text-slate-200 dark:text-slate-700 mx-auto mb-4 transition-colors duration-300" />
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-4 font-medium">No startups found matching your criteria.</p>
          <button onClick={() => window.location.reload()} className="btn-primary px-8 py-2.5 text-sm">
            Clear all filters
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map((s) => (
          <div key={s.id} className="card group flex flex-col h-full hover:border-slate-400 dark:hover:border-emerald-500/30 duration-300">
            <div className="flex justify-between items-start mb-5">
              <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-[#0B0F0E] flex items-center justify-center text-lg font-bold text-slate-600 dark:text-emerald-500 border border-slate-200 dark:border-white/10 transition-colors duration-300">
                {s.name[0]}
              </div>
              <span className="badge">{s.stage}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">{s.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5 line-clamp-3 leading-relaxed flex-1 font-medium transition-colors duration-300">{s.description}</p>

            <div className="pt-5 border-t border-slate-100 dark:border-white/5 mt-auto transition-colors duration-300">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-semibold mb-4 transition-colors duration-300">
                <FiBriefcase className="text-slate-400 dark:text-slate-500 transition-colors" />
                <span>{s.industry}</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5 transition-colors duration-300">Target</p>
                  <p className="text-slate-900 dark:text-white font-bold transition-colors duration-300">₹{s.fundingGoal.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/startup/${s.id}`)}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold px-3 py-1.5 text-xs border border-slate-200 dark:border-white/10 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300">
                    View
                  </button>
                  <button onClick={() => navigate(`/invest/${s.id}`)}
                    className="btn-primary px-4 py-1.5 text-xs">
                    Invest
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-14 gap-4">
          <button disabled={page === 0} onClick={() => dispatch(fetchStartups(filters, page - 1))}
            className="btn-secondary px-6 text-sm disabled:opacity-40">← Previous</button>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 transition-colors duration-300">Page {page + 1} of {totalPages}</span>
          <button disabled={page + 1 >= totalPages} onClick={() => dispatch(fetchStartups(filters, page + 1))}
            className="btn-secondary px-6 text-sm disabled:opacity-40">Next →</button>
        </div>
      )}
    </div>
  );
};

export default BrowseStartups;