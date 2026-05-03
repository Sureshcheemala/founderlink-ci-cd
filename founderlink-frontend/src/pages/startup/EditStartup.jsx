import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStartupById, updateStartup } from "../../services/startupService";
import { FiArrowLeft, FiSave, FiCpu, FiTarget, FiZap, FiGlobe } from "react-icons/fi";

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-7">
    <span className="text-slate-400 dark:text-emerald-500 transition-colors">{icon}</span>
    <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] transition-colors duration-300">{title}</h3>
    <div className="h-[1px] bg-slate-100 dark:bg-white/5 flex-1 transition-colors duration-300" />
  </div>
);

const Label = ({ children, required }) => (
  <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 transition-colors duration-300">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const EditStartup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", tagline: "", description: "", industry: "",
    websiteUrl: "", linkedinUrl: "", logoUrl: "",
    problemStatement: "", solution: "", fundingGoal: "", stage: "IDEA"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const res = await getStartupById(id);
        const d = res.data;
        setForm({
          name: d.name || "", tagline: d.tagline || "", description: d.description || "",
          industry: d.industry || "", websiteUrl: d.websiteUrl || "", linkedinUrl: d.linkedinUrl || "",
          logoUrl: d.logoUrl || "", problemStatement: d.problemStatement || "",
          solution: d.solution || "", fundingGoal: d.fundingGoal || "", stage: d.stage || "IDEA"
        });
      } catch { setError("Failed to load venture data."); }
      finally { setLoading(false); }
    };
    fetchStartup();
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    setError("");
    if (!form.name || !form.description || !form.industry) {
      setError("Name, summary, and industry are required.");
      return;
    }
    try {
      setSaving(true);
      await updateStartup(id, { ...form, fundingGoal: Number(form.fundingGoal) || 0 });
      navigate(`/startup/${id}`);
    } catch { setError("Failed to save changes."); }
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
        <FiArrowLeft /> Discard Changes
      </button>

      <div className="bg-white dark:bg-[#0f1513] border border-slate-200 dark:border-white/5 rounded-xl p-10 shadow-sm transition-colors duration-300">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 transition-colors duration-300">Edit Venture Asset</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 transition-colors duration-300">Refine your startup's marketplace profile and strategic outlook.</p>

        {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 p-4 rounded-lg text-sm font-medium mb-8 transition-colors duration-300">{error}</div>}

        <div className="space-y-12">
          {/* IDENTITY */}
          <section>
            <SectionHeader icon={<FiCpu />} title="Asset Identity" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label required>Startup Name</Label>
                <input name="name" value={form.name} onChange={handleChange} className="input" />
              </div>
              <div className="md:col-span-2">
                <Label>Tagline</Label>
                <input name="tagline" value={form.tagline} onChange={handleChange} className="input" />
              </div>
              <div className="md:col-span-2">
                <Label required>Executive Summary</Label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="input" />
              </div>
              <div>
                <Label required>Industry Vertical</Label>
                <input name="industry" value={form.industry} onChange={handleChange} className="input" />
              </div>
              <div>
                <Label>Venture Maturity</Label>
                <select name="stage" value={form.stage} onChange={handleChange} className="input appearance-none font-medium">
                  <option value="IDEA">Idea Phase</option>
                  <option value="SEED">Seed Stage</option>
                  <option value="MVP">MVP Validated</option>
                  <option value="GROWTH">Growth & Scaling</option>
                  <option value="SERIES_A">Series A</option>
                </select>
              </div>
            </div>
          </section>

          {/* DIGITAL PRESENCE */}
          <section>
            <SectionHeader icon={<FiGlobe />} title="Digital Presence" />
            <div className="grid md:grid-cols-2 gap-6">
              <div><Label>Website URL</Label><input name="websiteUrl" value={form.websiteUrl} onChange={handleChange} className="input" /></div>
              <div><Label>LinkedIn URL</Label><input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} className="input" /></div>
              <div className="md:col-span-2"><Label>Logo URL</Label><input name="logoUrl" value={form.logoUrl} onChange={handleChange} className="input" /></div>
            </div>
          </section>

          {/* THESIS */}
          <section>
            <SectionHeader icon={<FiTarget />} title="Strategic Thesis" />
            <div className="grid md:grid-cols-2 gap-6">
              <div><Label>The Market Gap (Problem)</Label><textarea name="problemStatement" value={form.problemStatement} onChange={handleChange} rows="5" className="input" /></div>
              <div><Label>The Architecture (Solution)</Label><textarea name="solution" value={form.solution} onChange={handleChange} rows="5" className="input" /></div>
            </div>
          </section>

          {/* CAPITAL */}
          <section>
            <SectionHeader icon={<FiZap />} title="Capital Target" />
            <div className="max-w-sm">
              <Label>Funding Goal (₹)</Label>
              <input name="fundingGoal" type="number" value={form.fundingGoal} onChange={handleChange} className="input font-bold text-lg" />
            </div>
          </section>

          <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex gap-5 transition-colors duration-300">
            <button onClick={handleUpdate} disabled={saving} className="btn-primary flex-1 py-4 text-base flex items-center justify-center gap-3">
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (<>Update Records <FiSave /></>)}
            </button>
            <button onClick={() => navigate(-1)} className="btn-secondary px-10 text-sm font-bold uppercase tracking-wider">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStartup;