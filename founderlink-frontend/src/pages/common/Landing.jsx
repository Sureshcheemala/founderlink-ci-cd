import { Link } from "react-router-dom";
import { FiArrowRight, FiUsers, FiSearch, FiShield, FiBriefcase, FiTarget, FiZap, FiBarChart2, FiGlobe, FiClock, FiFileText, FiTrendingUp } from "react-icons/fi";

const Landing = () => {
  return (
    <div className="bg-white dark:bg-[#0B0F0E] min-h-screen font-sans selection:bg-blue-100 dark:selection:bg-emerald-500/30 selection:text-blue-900 dark:selection:text-emerald-200 transition-colors duration-300">
      
      {/* DARK MODE BACKGROUND TEXTURE / GRID */}
      <div className="hidden dark:block fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="hidden dark:block fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#0B0F0E]/80 to-[#0B0F0E]"></div>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-24 pb-32 overflow-hidden border-b border-slate-100 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-emerald-500/10 text-slate-800 dark:text-emerald-400 border border-transparent dark:border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-8 dark:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-colors duration-300">
                 <FiZap className="fill-current" /> 2026 Ecosystem Report Published
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.95] mb-10 transition-colors duration-300">
                Architecting the future of <br className="hidden md:block dark:hidden" /><span className="text-blue-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-emerald-500 dark:to-emerald-400 transition-colors duration-300">venture capital</span>.
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed font-medium transition-colors duration-300">
                FounderLink is the institutional-grade marketplace connecting world-class founders with strategic capital and executive partners.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/register" className="btn-primary px-12 py-5 text-lg font-black uppercase tracking-widest flex items-center justify-center gap-3">
                  Initialize Profile <FiArrowRight />
                </Link>
                <Link to="/browse-startups" className="btn-secondary px-12 py-5 text-lg font-black uppercase tracking-widest text-center">
                  Explore Ventures
                </Link>
              </div>

              <div className="mt-16 flex flex-wrap items-center gap-10 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] transition-colors duration-300">
                <div className="flex items-center gap-2"><FiShield className="text-blue-600 dark:text-emerald-500 text-lg transition-colors duration-300" /> Verified Network</div>
                <div className="flex items-center gap-2"><FiBarChart2 className="text-blue-600 dark:text-emerald-500 text-lg transition-colors duration-300" /> ₹4.2B+ Deployed</div>
                <div className="flex items-center gap-2"><FiGlobe className="text-blue-600 dark:text-emerald-500 text-lg transition-colors duration-300" /> Global Operations</div>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-5 relative mt-16 lg:mt-0">
               <div className="relative z-10">
                  <div className="bg-white dark:bg-transparent dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-white/[0.01] dark:backdrop-blur-xl rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transform rotate-2 hover:rotate-0 transition-all duration-500">
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-white/5 transition-colors duration-300">
                      <div className="w-16 h-16 rounded-2xl bg-slate-900 dark:bg-emerald-500 flex items-center justify-center text-white dark:text-[#0B0F0E] text-2xl font-black transition-colors duration-300">ND</div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-xl tracking-tight transition-colors duration-300">Nexus Dynamics</p>
                        <p className="text-xs text-blue-600 dark:text-emerald-400 font-black uppercase tracking-widest mt-1 transition-colors duration-300">Venture ID: #8421</p>
                      </div>
                      <span className="ml-auto badge dark:bg-emerald-500/10 dark:text-emerald-400 dark:border dark:border-emerald-500/20 bg-slate-100 text-slate-800 border border-slate-200">Series A</span>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors duration-300">Funding Progress</p>
                          <p className="text-sm font-black text-slate-900 dark:text-emerald-400 transition-colors duration-300">₹8.4M / ₹12M</p>
                       </div>
                       <div className="w-full bg-slate-100 dark:bg-[#0B0F0E] h-2.5 rounded-full overflow-hidden shadow-inner dark:border dark:border-white/5 transition-colors duration-300">
                          <div className="bg-slate-800 dark:bg-gradient-to-r dark:from-emerald-500 dark:to-emerald-400 h-full w-[70%] dark:shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-colors duration-300"></div>
                       </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-8 font-medium italic leading-relaxed transition-colors duration-300">
                      "Leveraging decentralized architecture to redefine global cross-border payments."
                    </p>
                  </div>
               </div>
               
               {/* Decorative background gradients */}
               <div className="absolute -top-20 -right-20 w-80 h-80 bg-slate-100 dark:bg-emerald-500/20 rounded-full blur-[100px] -z-0 transition-colors duration-300"></div>
               <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-slate-100 dark:bg-emerald-900/40 rounded-full blur-[100px] -z-0 transition-colors duration-300"></div>
            </div>

          </div>
        </div>
      </section>

      {/* TRUSTED BY / SOCIAL PROOF - LIGHT MODE ONLY, hidden in dark mode for cleaner look */}
      <section className="py-16 border-b border-slate-100 bg-slate-50/50 dark:hidden">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Institutional Partners & Backers</p>
            <div className="flex flex-wrap justify-center items-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
               <span className="text-2xl font-black tracking-tighter text-slate-900">SEQUOIA <span className="text-slate-700">CAPITAL</span></span>
               <span className="text-2xl font-black tracking-tighter text-slate-900">TIGER <span className="text-slate-700">GLOBAL</span></span>
               <span className="text-2xl font-black tracking-tighter text-slate-900">SOFT<span className="text-slate-700">BANK</span></span>
               <span className="text-2xl font-black tracking-tighter text-slate-900">ACCEL</span>
               <span className="text-2xl font-black tracking-tighter text-slate-900">LIGHTSPEED</span>
            </div>
         </div>
      </section>

      {/* STRATEGIC CAPABILITIES / FEATURES GRID */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center dark:text-left max-w-3xl mx-auto dark:mx-0 mb-24 dark:mb-20">
            <h2 className="text-xs font-black text-blue-600 dark:text-emerald-500 uppercase tracking-[0.4em] mb-4 transition-colors duration-300">Strategic Framework</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">Built for institutional venture operations.</h3>
            <p className="hidden dark:block text-slate-400 mt-6 max-w-xl text-lg font-medium">
              From first pitch to final close — FounderLink gives you the tools to move faster and raise smarter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 dark:gap-6">
            {[
              {
                title: "Venture Discovery",
                desc: "Navigate an exclusive marketplace of high-growth assets. Filter by vertical, stage, and institutional interest.",
                icon: <FiSearch />,
                stat: "850+ Startups"
              },
              {
                title: "Executive Recruitment",
                desc: "Identify and secure technical co-founders or strategic executives from our verified talent pool.",
                icon: <FiUsers />,
                stat: "12k+ Executives"
              },
              {
                title: "Capital Deployment",
                desc: "Seamlessly transmit funding proposals and manage capitalization tables within a secure ecosystem.",
                icon: <FiTarget />,
                stat: "₹4.2B Invested"
              },
              {
                title: "Smart deal room",
                desc: "Secure, structured data rooms with version control and investor-ready formatting built in.",
                icon: <FiBriefcase />,
                stat: "Bank-Grade Security"
              },
              {
                title: "Live funding tracker",
                desc: "Real-time progress tracking for your round with milestone alerts and commitment visibility.",
                icon: <FiTrendingUp />,
                stat: "Real-time sync"
              },
              {
                title: "Fast closings",
                desc: "Streamlined term sheets and e-signatures mean you close rounds in days, not months.",
                icon: <FiClock />,
                stat: "10x Faster"
              }
            ].map((f, i) => (
              <div key={i} className="group dark:card dark:hover:-translate-y-1 dark:duration-300">
                <div className="w-16 h-16 dark:w-12 dark:h-12 bg-slate-100 dark:bg-[#0B0F0E] text-blue-600 dark:text-emerald-400 rounded-2xl dark:rounded-xl dark:border dark:border-white/10 flex items-center justify-center text-3xl dark:text-xl mb-8 dark:mb-6 group-hover:bg-slate-800 dark:group-hover:bg-[#0B0F0E] group-hover:text-white dark:group-hover:text-emerald-300 dark:group-hover:border-emerald-500/50 dark:group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300 shadow-sm dark:shadow-none">
                   {f.icon}
                </div>
                <h3 className="text-2xl dark:text-xl font-black dark:font-bold text-slate-900 dark:text-white mb-4 dark:mb-3 tracking-tight transition-colors duration-300">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6 dark:mb-0 dark:text-sm transition-colors duration-300">{f.desc}</p>
                <p className="text-xs font-black text-blue-600 dark:hidden uppercase tracking-widest transition-colors duration-300">{f.stat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM STATS */}
      <section className="py-32 bg-slate-900 dark:bg-[#0B0F0E]/50 text-white relative overflow-hidden dark:border-y dark:border-white/5 dark:backdrop-blur-sm transition-colors duration-300">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 dark:from-emerald-500 via-transparent to-transparent transition-colors duration-300"></div>
         </div>
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
               <div>
                  <p className="text-5xl font-black mb-2 tracking-tighter transition-colors duration-300">142<span className="hidden dark:inline text-emerald-500">+</span></p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Exits Facilitated</p>
               </div>
               <div>
                  <p className="text-5xl font-black mb-2 tracking-tighter transition-colors duration-300"><span className="hidden dark:inline text-emerald-500">₹</span>850M</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Raised Last Quarter</p>
               </div>
               <div>
                  <p className="text-5xl font-black mb-2 tracking-tighter transition-colors duration-300">98.2<span className="hidden dark:inline text-emerald-500">%</span><span className="dark:hidden">%</span></p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Member Satisfaction</p>
               </div>
               <div>
                  <p className="text-5xl font-black mb-2 tracking-tighter transition-colors duration-300">24/7</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Institutional Support</p>
               </div>
            </div>
         </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-32 dark:py-24 relative z-10 px-4">
        <div className="max-w-5xl mx-auto dark:rounded-3xl dark:p-1 dark:relative dark:overflow-hidden">
          {/* Dark Mode Gradient Border Illusion */}
          <div className="hidden dark:block absolute inset-0 bg-gradient-to-r from-emerald-600/30 via-emerald-400/30 to-emerald-600/30 opacity-50"></div>
          
          <div className="text-center bg-slate-800 dark:bg-[#0f1513] rounded-[3rem] dark:rounded-[1.4rem] py-24 px-8 text-white dark:border dark:border-white/5 shadow-[0_50px_100px_rgba(37,99,235,0.3)] dark:shadow-none relative overflow-hidden dark:backdrop-blur-xl transition-colors duration-300">
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl dark:hidden"></div>
            <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none"></div>

            <h2 className="text-5xl font-black mb-8 tracking-tighter">Ready to architect your venture?</h2>
            <p className="text-xl text-slate-200 dark:text-slate-400 mb-12 font-medium max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
              Join the world's most elite startup ecosystem and accelerate your journey from seed to exit.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/register" className="bg-white dark:bg-emerald-500 text-blue-600 dark:text-[#0B0F0E] px-12 py-5 text-sm font-black uppercase tracking-[0.2em] rounded-xl dark:rounded-md hover:bg-slate-100 dark:hover:bg-emerald-400 transition-colors dark:shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)]">
                Establish Profile
              </Link>
              <Link to="/browse-startups" className="bg-blue-700 dark:bg-transparent text-white dark:text-emerald-50 px-12 py-5 text-sm font-black uppercase tracking-[0.2em] rounded-xl dark:rounded-md hover:bg-blue-800 dark:hover:bg-emerald-500/10 transition-colors border border-blue-500/30 dark:border-emerald-500/30">
                Explore Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 dark:py-12 border-t border-slate-100 dark:border-white/5 relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex flex-col md:flex-row justify-between items-center gap-10 dark:gap-6">
              <div className="text-xl font-black tracking-tighter text-slate-900 dark:text-white transition-colors duration-300">
                 FOUNDER<span className="text-blue-600 dark:text-emerald-500 transition-colors duration-300">LINK</span>
              </div>
              <div className="flex gap-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] dark:hidden">
                 <a href="#" className="hover:text-slate-900">Privacy Policy</a>
                 <a href="#" className="hover:text-slate-900">Terms of Operation</a>
                 <a href="#" className="hover:text-slate-900">Ecosystem Status</a>
                 <a href="#" className="hover:text-slate-900">Contact Infrastructure</a>
              </div>
              <p className="text-[10px] font-black dark:font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest transition-colors duration-300">© 2026 FounderLink Institutional. All Rights Reserved.</p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;