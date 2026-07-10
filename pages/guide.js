import Head from "next/head";
import { Search, ListFilter, Play, ShieldAlert, TrendingUp, HelpCircle, History, ArrowLeft, ExternalLink } from "lucide-react";
import PremiumLogo from "../components/PremiumLogo";

export default function UserGuide() {
  const steps = [
    {
      id: "search",
      title: "1. Search Company or Ticker",
      icon: <Search className="h-5 w-5 text-[#FF7A3D]" />,
      desc: "Type a company name (e.g. 'Apple', 'Tesla') or stock symbol in the search input box. The autocomplete engine searches listing options character-by-character.",
      details: "Our system resolves international tickers (e.g. '.KS' for Korean exchanges or '.NS' for Indian listings) and filters non-equity assets dynamically.",
    },
    {
      id: "select",
      title: "2. Select from Suggestion Dropdown",
      icon: <ListFilter className="h-5 w-5 text-[#FF7A3D]" />,
      desc: "Select the correct stock listing from the suggestion dropdown menu to lock in the ticker (e.g. AAPL, TSLA) and run the audit.",
      details: "Clicking a suggestion automatically fills the inputs, triggers a pipeline build, and avoids typos that could lead to analytical mismatches.",
    },
    {
      id: "pipeline",
      title: "3. Monitor Live Pipeline Stepper",
      icon: <Play className="h-5 w-5 text-[#FF7A3D]" />,
      desc: "Watch the active workflow progress bar. Five key auditing steps run sequentially: Ticker Resolution, Financial Fetching, News Scraping, AI Analysis, and Compilation.",
      details: "A terminal console log on the right side streams raw logs directly from the backend API, detailing data payloads and grounding checks.",
    },
    {
      id: "verdict",
      title: "4. Review Compliance Decision",
      icon: <ShieldAlert className="h-5 w-5 text-[#FF7A3D]" />,
      desc: "Check the top compliance block. AURORA displays a final rating ('INVEST' in green or 'PASS' in red/orange) alongside a circular SVG confidence gauge.",
      details: "The confidence rating (0% to 100%) represents the agent's margin of certainty matching metrics against selected risk tolerances.",
    },
    {
      id: "charts",
      title: "5. Financial Trajectory & Analyst Consensus",
      icon: <TrendingUp className="h-5 w-5 text-[#FF7A3D]" />,
      desc: "Analyze interactive charts. The Historical Earnings line graph renders 4 years of annual Revenue and Net Income trends. Wall Street Consensus aggregates buy/hold/sell trends.",
      details: "If Yahoo Finance is rate-limited or blocks international tickers, our system gracefully switches to mock fallback metrics to keep dashboards operational.",
    },
    {
      id: "history",
      title: "6. Manage Query History",
      icon: <History className="h-5 w-5 text-[#FF7A3D]" />,
      desc: "Re-hydrate previous audits instantly. The left sidebar stores past query logs. You can sync history profiles to the cloud database or clear them with a single click.",
      details: "When users log in from another device, their historical audits sync automatically from the PostgreSQL database, preserving their records.",
    },
  ];

  return (
    <>
      <Head>
        <title>AURORA — User Guide &amp; Workflow Manual</title>
        <meta name="description" content="Visual walkthrough manual for using the AURORA Investment Research Suite." />
      </Head>

      <div className="relative min-h-screen bg-[#050608] text-white">
        <div className="noise-overlay" />
        <div className="moving-grid" />

        {/* Header */}
        <nav className="border-b border-white/5 bg-[#050608]/90 backdrop-blur-md sticky top-0 z-40">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <PremiumLogo />
              <span className="hidden md:inline h-4 w-px bg-white/10" />
              <span className="text-xs text-[#98A2B3]">Onboarding Manual</span>
            </div>
            <a
              href="/"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4.5 py-2 text-[10px] uppercase tracking-wider text-[#98A2B3] hover:text-white transition hover:border-[#FF4B2B]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Console
            </a>
          </div>
        </nav>

        {/* Content Container */}
        <main className="relative z-10 mx-auto max-w-4xl px-6 py-16 space-y-12">
          
          {/* Hero Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF4B2B]/20 bg-[#FF4B2B]/5 px-3.5 py-1.5 text-[9px] uppercase tracking-wider text-[#FF7A3D]">
              <HelpCircle className="h-3.5 w-3.5 animate-pulse" />
              Platform Walkthrough
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl bg-gradient-to-r from-white via-white to-[#FF7A3D] bg-clip-text text-transparent">
              How AURORA Works
            </h1>
            <p className="max-w-xl mx-auto text-sm text-[#98A2B3] leading-relaxed">
              AURORA automates stock analysis using structured prompts and web crawlers. 
              Follow this step-by-step visual onboarding guide to leverage our research workspace.
            </p>
          </div>

          {/* Screenshot Preview */}
          <div className="rounded-2xl border border-white/5 bg-[#11161D] p-1.5 shadow-2xl relative overflow-hidden group">
            <img 
              src="/screenshots/research_dashboard.png" 
              alt="AURORA Workspace Dashboard" 
              className="w-full h-auto rounded-xl opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur rounded-lg px-3 py-1.5 text-[10px] tracking-wider text-[#98A2B3] border border-white/5 uppercase">
              AURORA Workspace Dashboard Interface
            </div>
          </div>

          {/* Onboarding Steps Card Grid */}
          <div className="grid gap-6">
            {steps.map((s, idx) => (
              <div key={s.id} className="rounded-xl border border-white/5 bg-[#11161D] p-6 space-y-3 relative hover:border-white/10 transition">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#FF4B2B]/10 border border-[#FF4B2B]/20 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">{s.title}</h3>
                </div>
                <p className="text-sm text-[#98A2B3] leading-relaxed">{s.desc}</p>
                <div className="mt-3 overflow-hidden rounded-xl border border-white/5 bg-[#050608]/30 max-w-2xl" style={{ display: 'none' }}>
                  <img
                    src={`/screenshots/guide_${s.id}.png`}
                    alt={s.title}
                    className="w-full h-auto object-cover opacity-95 hover:opacity-100 transition"
                    onLoad={(e) => {
                      e.target.parentElement.style.display = 'block';
                    }}
                    onError={(e) => {
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                </div>
                <div className="rounded-lg bg-[#050608]/40 border border-white/5 p-3.5 text-xs text-[#98A2B3]/80 leading-relaxed font-mono">
                  <span className="text-[#FF7A3D] font-bold">ℹ Pro Tip: </span>
                  {s.details}
                </div>
              </div>
            ))}
          </div>

          {/* Quick FAQ Section */}
          <div className="rounded-xl border border-[#FF4B2B]/20 bg-[#FF4B2B]/5 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Frequently Asked Questions</h3>
            <div className="space-y-4 text-xs leading-relaxed text-[#98A2B3]">
              <div className="space-y-1">
                <h4 className="font-semibold text-white">Q: Why do some searches return "No historical trends retrieved"?</h4>
                <p>A: Some tickers (especially international listings) do not publish yearly financials on public endpoints. The UI will render fallback indicators gracefully so the main analysis is still readable.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-white">Q: How do the Risk Tolerances (Low, Med, High) affect verdicts?</h4>
                <p>A: Low tolerance triggers strict solvency rules (e.g. rejecting high Debt-to-Equity companies). Med and High tolerances loosen criteria, allowing Gemini to focus on earnings growth potential.</p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}
