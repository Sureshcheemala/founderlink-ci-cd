import { useDispatch, useSelector } from "react-redux";
import {
  setSearch,
  setIndustry,
  setStage,
  setFundingRange,
  setSort,
  resetFilters
} from "../../features/startup/startupFilterSlice";
import { FiFilter, FiRefreshCw } from "react-icons/fi";

const FilterBar = () => {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.startupFilters);

  return (
    <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 rounded-xl p-6 shadow-sm mb-10 transition-colors duration-300">
      <div className="flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[280px]">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Market Search</label>
          <div className="relative">
             <input
               type="text"
               placeholder="Identify ventures by name, sector or thesis..."
               value={filters.search}
               onChange={(e) => dispatch(setSearch(e.target.value.trimStart()))}
               className="input py-3"
             />
          </div>
        </div>

        <div className="w-48">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Industry Vertical</label>
          <select
            value={filters.industry}
            onChange={(e) => dispatch(setIndustry(e.target.value))}
            className="input appearance-none py-3 font-medium"
          >
            <option value="">All Verticals</option>
            <option value="tech">Technology</option>
            <option value="fintech">Fintech</option>
            <option value="health">Healthcare</option>
            <option value="ai">AI & Machine Learning</option>
          </select>
        </div>

        <div className="w-48">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Venture Stage</label>
          <select
            value={filters.stage}
            onChange={(e) => dispatch(setStage(e.target.value))}
            className="input appearance-none py-3 font-medium"
          >
            <option value="">All Maturity Levels</option>
            <option value="idea">Idea Phase</option>
            <option value="seed">Seed Phase</option>
            <option value="growth">Growth Phase</option>
          </select>
        </div>

        <div className="w-48">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Sort Strategy</label>
          <select
            value={filters.sortBy === "fundingGoal" ? "funding" : "created"}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "funding") {
                dispatch(setSort({ sortBy: "fundingGoal", sortDir: "desc" }));
              } else {
                dispatch(setSort({ sortBy: "createdAt", sortDir: "desc" }));
              }
            }}
            className="input appearance-none py-3 font-medium"
          >
            <option value="created">Recently Published</option>
            <option value="funding">Highest Target</option>
          </select>
        </div>

        <button
          onClick={() => dispatch(resetFilters())}
          className="btn-secondary h-[46px] px-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
          title="Reset Parameters"
        >
          <FiRefreshCw /> Reset
        </button>
      </div>
    </div>
  );
};

export default FilterBar;