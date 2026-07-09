import { useState, useEffect } from "react";
import { Search, Compass } from "lucide-react";
import DynamicParticleSphere from "./DynamicParticleSphere";
import PremiumLogo from "./PremiumLogo";

export default function LandingPage({ onLaunch, onDirectSearch }) {
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onDirectSearch(query.trim());
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050608] text-white">
      {/* Background patterns */}
      <div className="moving-grid" />
      <div className="noise-overlay" />
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#FF4B2B]/5 via-transparent to-transparent pointer-events-none" />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled ? "bg-[#050608]/75 backdrop-blur-md border-white/5 py-4 shadow-lg" : "bg-transparent border-transparent py-6"
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <PremiumLogo />
          
          <div className="hidden items-center gap-9 text-[10px] uppercase tracking-[0.2em] text-[#98A2B3] md:flex">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#experience" className="hover:text-white transition">Experience</a>
            <a href="#preview" className="hover:text-white transition">Preview</a>
            <a href="#technology" className="hover:text-white transition">Technology</a>
          </div>

          <button
            onClick={onLaunch}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/15 px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-white/90 transition hover:border-[#FF4B2B] hover:text-white"
          >
            Launch Console
            <span className="absolute inset-0 bg-[#FF4B2B]/10 opacity-0 group-hover:opacity-100 transition" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative flex min-h-screen flex-col justify-center px-6 pt-24 max-w-7xl mx-auto z-10">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 text-left space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-[9px] uppercase tracking-[0.25em] text-[#98A2B3] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF4B2B] animate-pulse" />
              Autonomous Asset Research Suite
            </div>
            
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
              AI Investment <br />
              <span className="bg-gradient-to-r from-white via-white to-[#FF7A3D] bg-clip-text text-transparent">
                Intelligence
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-[#98A2B3]">
              Research equities with absolute clarity, confidence, and intelligent insights. 
              Designed for modern institutional auditors and analysts.
            </p>

            {/* Living Search Field */}
            <form onSubmit={handleSearchSubmit} className="max-w-lg">
              <div className="relative group flex items-center p-1.5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 focus-within:border-[#FF4B2B] focus-within:ring-2 focus-within:ring-[#FF4B2B]/20">
                <Search className="h-5 w-5 text-white/40 ml-4" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search any company or ticker..."
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                />
                <button
                  type="submit"
                  className="relative group overflow-hidden rounded-lg bg-[#FF4B2B] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Launch →</span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />
                </button>
              </div>
            </form>

            {/* Checklist */}
            <div className="grid grid-cols-2 gap-y-3.5 max-w-lg text-[10px] uppercase tracking-[0.18em] text-[#98A2B3]">
              <div className="flex items-center gap-2">
                <span className="text-[#FF4B2B] text-base">✓</span> Beautiful Reports
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#FF4B2B] text-base">✓</span> Interactive Visuals
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#FF4B2B] text-base">✓</span> AI-Powered Insights
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#FF4B2B] text-base">✓</span> Modern Research Experience
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-5 h-[400px] flex items-center justify-center">
            <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" 
              style={{ background: 'radial-gradient(circle at center, rgba(255, 75, 43, 0.22), transparent 70%)' }} />
            <DynamicParticleSphere />
          </div>
        </div>
      </header>

      {/* Feature Section */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#FF7A3D]">Auditing Engine</span>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl mt-3">Precision Scraped &amp; Analyzed</h2>
        </div>

        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#FF4B2B]/10 border border-[#FF4B2B]/20">
              <Compass className="h-5 w-5 text-[#FF7A3D]" />
            </div>
            <h3 className="text-2xl font-bold text-white">Powerful Research Experience</h3>
            <p className="text-[#98A2B3] leading-relaxed">
              Aurora replaces complex spreadsheets and convoluted dashboards with interactive, publication-quality intelligence. 
              Our auditor scrapes financial statements, matches indicators against strict margin and debt policies, and evaluates current risks.
            </p>
            <ul className="space-y-3.5 text-sm text-[#98A2B3]">
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF4B2B]" />
                Solvency &amp; Debt-to-Equity guidelines audit
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF4B2B]" />
                Wall Street analyst recommendation compiling
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF4B2B]" />
                RAG grounded news summary indexing
              </li>
            </ul>
          </div>

          <div id="preview" className="rounded-2xl border border-white/85 p-1 bg-[#11161D] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <div className="rounded-xl bg-[#050608] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <span className="text-[10px] text-emerald-400 font-bold">A</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Apple Inc.</div>
                    <div className="text-[9px] text-[#98A2B3]">NASDAQ · AAPL</div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 text-[9px] uppercase tracking-wider text-emerald-400 font-semibold">
                  BUY Recommendation
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border border-white/5 bg-[#11161D] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[#98A2B3]">Confidence</div>
                  <div className="text-lg font-bold text-white mt-1">94%</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-[#11161D] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[#98A2B3]">P/E Ratio</div>
                  <div className="text-lg font-bold text-white mt-1">31.20</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-[#11161D] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[#98A2B3]">FCF Yield</div>
                  <div className="text-lg font-bold text-white mt-1">Strong</div>
                </div>
              </div>
              <p className="text-xs text-[#98A2B3] leading-relaxed">
                Apple demonstrates highly robust solvency ratios and steady growth, making it a perfect fit for a conservative strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="experience" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#FF7A3D]">The Difference</span>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl mt-3 font-sans">Designed to Focus</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-black/40 p-8 space-y-6 relative opacity-60 hover:opacity-80 transition-opacity">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-red-400/80">Traditional Dashboards</h4>
            <div className="grid grid-cols-4 gap-2 text-[10px] font-mono">
              {[12.5, 45.2, 0.82, 31.4, 1.05, 94.6, 6.2, 14.5, 0.35, 2.1, 75.8, 18.4].map((val, i) => (
                <div key={i} className="rounded border border-red-500/10 bg-red-950/5 p-2 text-red-300">
                  METRIC_{i}: {val.toFixed(2)}
                </div>
              ))}
            </div>
            <p className="text-xs text-[#98A2B3] leading-relaxed">
              Legacy systems rely on visual overload, displaying hundreds of static mathematical cells with zero guidance. 
              They are crowded, complex, static, and difficult to parse.
            </p>
          </div>

          <div className="rounded-2xl border border-[#FF4B2B]/30 bg-[#11161D] p-8 space-y-6 relative shadow-glow">
            <div className="absolute top-4 right-4 rounded-full bg-[#FF4B2B]/20 border border-[#FF4B2B]/30 px-2 py-0.5 text-[8px] uppercase tracking-wider text-white">
              Aurora Standard
            </div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#FF7A3D]">Minimalist Auditing</h4>
            <div className="flex h-6 w-full items-center overflow-hidden rounded bg-white/5">
              <div className="h-full bg-emerald-500" style={{ width: '70%' }} />
              <div className="h-full bg-[#FF4B2B]" style={{ width: '30%' }} />
            </div>
            <p className="text-xs text-[#98A2B3] leading-relaxed">
              We extract only critical signals. Financial metrics are cross-referenced with your chosen risk profile, 
              delivering an interactive layout designed to keep you focused.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#FF7A3D]">Technology Stack</span>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl mt-3">Engineered for Performance</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/5 bg-[#11161D] p-6 space-y-3">
            <div className="text-xl font-bold text-white">Google Gemini</div>
            <p className="text-xs text-[#98A2B3] leading-relaxed">
              Leverages gemini-2.5-flash models to digest real-time financials, audit risk metrics, and compile compliance verdict summaries.
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-[#11161D] p-6 space-y-3">
            <div className="text-xl font-bold text-white">LangChain Core</div>
            <p className="text-xs text-[#98A2B3] leading-relaxed">
              Orchestrates prompt templates, maps risk levels, and binds Zod validation schemas for native structured output coercion.
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-[#11161D] p-6 space-y-3">
            <div className="text-xl font-bold text-white">Yahoo Financials</div>
            <p className="text-xs text-[#98A2B3] leading-relaxed">
              Scrapes trailing P/E ratios, free cash flows, Wall Street recommendation trends, and historical yearly statements.
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-[#11161D] p-6 space-y-3">
            <div className="text-xl font-bold text-white">HTML5 Canvas</div>
            <p className="text-xs text-[#98A2B3] leading-relaxed">
              Renders orbital particle graphs and real-time connection nodes tracking cursor grids at high device-pixel ratios.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto text-center border-t border-white/5 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#FF4B2B]/10 blur-[100px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            Ready to Experience <br />
            Modern Investment Research?
          </h2>
          <p className="max-w-lg mx-auto text-sm text-[#98A2B3]">
            Instantly deploy our multi-agent research pipeline on any listed equity ticker or customized Suggestion.
          </p>
          <div className="flex justify-center">
            <button
              onClick={onLaunch}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#FF4B2B] px-10 py-4.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-2xl transition hover:-translate-y-0.5"
            >
              Launch Research Console
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20 py-16 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid gap-8 md:grid-cols-2 pb-12">
          <div className="space-y-4">
            <PremiumLogo />
            <p className="text-xs text-[#98A2B3] max-w-sm leading-relaxed">
              Aurora is an autonomous, multi-agent investment research suite designed to audit equities against compliance and risk rules.
            </p>
          </div>
          <div className="flex md:justify-end items-start">
            <div className="grid grid-cols-2 gap-x-16 gap-y-3.5 text-xs text-[#98A2B3] font-semibold">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#experience" className="hover:text-white transition">Experience</a>
              <a href="#preview" className="hover:text-white transition">Preview</a>
              <a href="#technology" className="hover:text-white transition">Technology</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-wider text-[#98A2B3]/50">
          <span>© {new Date().getFullYear()} Aurora. All rights reserved.</span>
          <div className="flex gap-6 font-semibold">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Altuni Labs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
