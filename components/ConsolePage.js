import { useState, useEffect } from "react";
import { 
  Search, 
  History, 
  Plus, 
  ExternalLink, 
  LogOut,
  Notebook,
  User
} from "lucide-react";
import PremiumLogo from "./PremiumLogo";
import HistoricalEarningsChart from "./HistoricalEarningsChart";
import ConfidenceGauge from "./ConfidenceGauge";
import AnalystConsensus from "./AnalystConsensus";
import ProfileModal from "./ProfileModal";

const STEPS = [
  "Resolving ticker",
  "Scraping metrics",
  "Grounding on news",
  "Compliance audit",
  "Compiling report",
];

const METRIC_LABELS = {
  peRatio: 'Trailing P/E',
  forwardPE: 'Forward P/E',
  pegRatio: 'PEG Ratio',
  priceToBook: 'Price to Book',
  trailingEps: 'Trailing EPS',
  forwardEps: 'Forward EPS',
  profitMargin: 'Profit Margin',
  operatingMargin: 'Operating Margin',
  freeCashFlow: 'Free Cash Flow',
  debtToEquity: 'Debt to Equity',
  currentRatio: 'Current Ratio',
  revenueGrowth: 'Revenue Growth',
  totalRevenue: 'Total Revenue'
};

const renderMarkdown = (md) => {
  if (!md) return null;
  
  // Basic HTML sanitization
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Format headers
  html = html.replace(/^### (.*?)$/gm, '<h4 class="text-xs font-semibold text-white mt-4 mb-2 uppercase tracking-wider">$1</h4>');
  html = html.replace(/^## (.*?)$/gm, '<h3 class="text-xs font-bold text-[#FF7A3D] mt-5 mb-2.5 uppercase tracking-widest border-b border-white/5 pb-1">$1</h3>');
  html = html.replace(/^# (.*?)$/gm, '<h2 class="text-sm font-extrabold text-white mt-6 mb-3 uppercase tracking-[0.2em] border-b border-[#FF4B2B]/20 pb-2">$1</h2>');

  // Format bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');

  // Format list items
  html = html.replace(/^\*\s+(.*?)$/gm, '<li class="ml-4 list-disc pl-1 mb-1.5 text-white/80">$1</li>');

  // Format newlines
  html = html.replace(/\n/g, '<br />');

  return (
    <div 
      className="space-y-1.5 font-sans text-xs leading-relaxed text-[#98A2B3] overflow-wrap-break-word"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};

export default function ConsolePage({ onBack, initialQuery = "", user, token, onUpdateUser, onLogout }) {
  const [company, setCompany] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [riskTolerance, setRiskTolerance] = useState("med");
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [userNotes, setUserNotes] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  // Autocomplete suggestions states
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
  const [validationWarning, setValidationWarning] = useState(null);

  const pushLog = (m) =>
    setLogs((l) => [...l, `[${new Date().toLocaleTimeString()}] ${m}`]);

  useEffect(() => {
    const savedRisk = localStorage.getItem('invest_risk');
    if (savedRisk) {
      setRiskTolerance(savedRisk);
    }

    const loadDbHistory = async () => {
      if (!token || token === "guest") return;
      try {
        const res = await fetch("/api/auth/history", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (e) {
        console.error("Failed loading database history:", e);
      }
    };

    loadDbHistory();

    if (initialQuery) {
      setCompany(initialQuery);
      analyze(initialQuery);
    }
  }, [initialQuery, user, token]);

  // Debounced search suggestions effect
  useEffect(() => {
    if (hasSelected || !company.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const res = await fetch(`/api/search-suggestions?q=${encodeURIComponent(company)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowDropdown(data.length > 0);
        }
      } catch (err) {
        console.error("Failed fetching suggestions:", err);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [company, hasSelected]);

  // Outside click detector to close search suggestions dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const container = document.getElementById("search-input-container");
      if (container && !container.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleInputChange = (val) => {
    setCompany(val);
    setHasSelected(false);
    setValidationWarning(null);
  };

  const handleSelectSuggestion = (item) => {
    setHasSelected(true);
    setValidationWarning(null);
    setCompany(`${item.name} (${item.symbol})`);
    setSuggestions([]);
    setShowDropdown(false);
    analyze(item.symbol);
  };

  const handleSearchClick = (e) => {
    if (e) e.preventDefault();
    setValidationWarning("Please select a company from the suggestions list below to run the audit.");
    setShowDropdown(suggestions.length > 0);
  };

  const changeRiskTolerance = (r) => {
    setRiskTolerance(r);
    localStorage.setItem('invest_risk', r);
  };

  const analyze = async (targetQuery = null) => {
    const searchVal = targetQuery || company;
    if (!searchVal.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setLogs([]);
    setCurrentStep(0);
    pushLog(`> analyze("${searchVal}", risk=${riskTolerance})`);

    let stepCount = 0;
    const stepTimer = setInterval(() => {
      if (stepCount < STEPS.length - 1) {
        pushLog(`✓ ${STEPS[stepCount]}`);
        stepCount += 1;
        setCurrentStep(stepCount);
      }
    }, 700);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: searchVal, riskTolerance }),
      });
      clearInterval(stepTimer);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.details || `API error ${res.status}`);
      }
      const data = await res.json();
      setResult(data);
      setCurrentStep(STEPS.length);
      pushLog("✓ Report compiled successfully");

      if (data.decision === 'Invest') {
        try {
          const confetti = (await import('canvas-confetti')).default;
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (confettiErr) {
          console.warn('Confetti error:', confettiErr);
        }
      }

      if (token && token !== "guest") {
        const newItem = {
          company: searchVal,
          risk: riskTolerance,
          result: data
        };
        fetch("/api/auth/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(newItem)
        }).then(async (res) => {
          if (res.ok) {
            const savedLog = await res.json();
            setHistory((h) => {
              const filtered = h.filter((item) => item.company !== searchVal);
              return [savedLog, ...filtered].slice(0, 10);
            });
          }
        }).catch(err => console.error("Error saving history:", err));
      } else if (token === "guest") {
        const localItem = {
          id: `guest-${Date.now()}`,
          company: searchVal,
          risk: riskTolerance,
          result: data
        };
        setHistory((h) => {
          const filtered = h.filter((item) => item.company !== searchVal);
          return [localItem, ...filtered].slice(0, 10);
        });
      }
    } catch (e) {
      clearInterval(stepTimer);
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      pushLog(`✗ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item) => {
    setResult(item.result);
    setCompany(item.company);
    setRiskTolerance(item.risk);
    setError(null);
  };

  const clearHistory = async () => {
    if (!token) return;
    setHistory([]);
    if (token === "guest") {
      pushLog("✓ Guest local session history cleared");
      return;
    }
    try {
      const res = await fetch("/api/auth/history", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        pushLog("✓ History cleared in database");
      }
    } catch (e) {
      console.error("Failed clearing history:", e);
      pushLog("✗ Failed clearing history in database");
    }
  };

  const pros = result?.positives || result?.pros || [];
  const cons = result?.negatives || result?.cons || [];

  return (
    <div className="relative min-h-screen bg-[#050608] text-white">
      <div className="noise-overlay" />
      <div className="moving-grid" />

      {/* Top Header */}
      <nav className="border-b border-white/5 bg-[#050608]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <PremiumLogo />
            <span className="hidden md:inline h-4 w-px bg-white/10" />
            <span className="hidden md:inline text-xs text-[#98A2B3]">Research Suite</span>
            <span className="hidden md:inline h-4 w-px bg-white/10" />
            <a href="/guide" className="text-xs text-[#FF7A3D] hover:underline font-semibold transition">User Guide</a>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={() => setProfileOpen(true)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-[10px] uppercase font-semibold text-white transition hover:border-[#FF7A3D]"
              >
                <div className="h-5 w-5 shrink-0 rounded-full bg-gradient-to-br from-[#FF4B2B] to-[#FF7A3D] flex items-center justify-center text-[8px] font-bold text-white uppercase">
                  {user.name ? user.name[0] : "U"}
                </div>
                <span className="hidden sm:inline font-semibold">{user.name || "Profile"}</span>
              </button>
            )}

            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] pl-3.5 pr-5 py-2 text-[10px] uppercase text-[#98A2B3] transition hover:border-[#FF4B2B] hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="tracking-[0.2em]">Exit Workspace</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Workspace Frame */}
      <div className="mx-auto max-w-7xl px-6 py-8 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[250px_1fr_320px]">
          
          {/* COLUMN 1: SIDEBAR */}
          <aside className="space-y-6">
            <button
              onClick={() => {
                setResult(null);
                setCompany("");
                setError(null);
                setLogs([]);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF4B2B] py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#FF4B2B]/90"
            >
              <Plus className="h-4 w-4" />
              New Research
            </button>

            <div className="rounded-xl border border-white/5 bg-[#11161D] p-5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[#98A2B3]">
                <span className="flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5" />
                  History
                </span>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="hover:text-red-400 transition text-[9px]">
                    Clear
                  </button>
                )}
              </div>
              
              {history.length === 0 ? (
                <div className="mt-4 text-center text-xs text-[#98A2B3]/50 py-6">
                  No audits logged.
                </div>
              ) : (
                <ul className="mt-4 space-y-2.5">
                  {history.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="group cursor-pointer rounded-lg border border-white/5 bg-[#050608]/40 p-3 transition hover:border-[#FF4B2B]/40 hover:bg-[#11161D]"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-white/95">
                        <span className="truncate max-w-[100px]">{item.company}</span>
                        <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[8px] uppercase tracking-wider text-[#98A2B3]">
                          {item.risk}
                        </span>
                      </div>
                      <div className="mt-1 text-[9px] text-[#98A2B3]/60">
                        {item.createdAt 
                          ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                          : item.at}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          {/* COLUMN 2: WORKSPACE CENTER */}
          <main className="space-y-6">
            
            <div className="rounded-xl border border-white/5 bg-[#11161D] p-6 shadow-xl">
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#98A2B3]">Target Query</h3>
              <div className="mt-3 flex gap-3 items-start">
                <div id="search-input-container" className="relative flex-1 flex flex-col">
                  <div className="relative flex items-center p-1 rounded-xl border border-white/10 bg-[#050608]/50 focus-within:border-[#FF4B2B] transition duration-200">
                    <Search className="h-5 w-5 text-white/30 ml-3.5" />
                    <input
                      value={company}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearchClick(e)}
                      onFocus={() => setShowDropdown(suggestions.length > 0)}
                      placeholder="Search company (e.g. Apple, Tesla, Google)"
                      className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20"
                    />
                  </div>

                  {/* Suggestions Dropdown */}
                  {showDropdown && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1.5 rounded-xl border border-white/5 bg-[#11161D] p-1.5 shadow-2xl space-y-0.5 max-h-60 overflow-y-auto">
                      {suggestions.map((item) => (
                        <button
                          key={item.symbol}
                          onClick={() => handleSelectSuggestion(item)}
                          className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-white/[0.03] transition group"
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-white group-hover:text-[#FF7A3D] transition">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-[#98A2B3]/50">
                              {item.exchange} • {item.type}
                            </span>
                          </div>
                          <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-bold text-white group-hover:bg-[#FF4B2B]/10 group-hover:text-[#FF4B2B] transition">
                            {item.symbol}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSearchClick}
                  disabled={loading || !company.trim()}
                  className="rounded-xl bg-[#FF4B2B] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-40 hover:bg-[#FF4B2B]/90 transition"
                >
                  {loading ? "Auditing…" : "Run Audit"}
                </button>
              </div>

              {validationWarning && (
                <div className="mt-2 text-xs text-amber-500/90 font-medium">
                  ⚠️ {validationWarning}
                </div>
              )}

              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#98A2B3]">Auditor Risk Constraint</span>
                <div className="inline-flex rounded-full border border-white/5 bg-[#050608]/50 p-1">
                  {["low", "med", "high"].map((r) => (
                    <button
                      key={r}
                      onClick={() => changeRiskTolerance(r)}
                      className={`rounded-full px-3.5 py-1.5 text-[9px] uppercase tracking-wider font-semibold transition ${
                        riskTolerance === r ? "bg-[#FF4B2B] text-white" : "text-[#98A2B3] hover:text-white"
                      }`}
                    >
                      {r === 'med' ? 'medium' : r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {(loading || result) && (
              <div className="rounded-xl border border-white/5 bg-[#11161D] p-5">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[#98A2B3] mb-4">
                  <span>Auditor Steps</span>
                  <span>{Math.min(currentStep, STEPS.length)} / {STEPS.length}</span>
                </div>
                <div className="grid gap-2 grid-cols-5 text-[9px] uppercase tracking-wider font-semibold">
                  {STEPS.map((s, i) => {
                    const done = i < currentStep;
                    const active = i === currentStep && loading;
                    return (
                      <div
                        key={s}
                        className={`rounded-lg border p-3 text-center transition-all ${
                          done ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" :
                          active ? "border-[#FF4B2B]/30 bg-[#FF4B2B]/5 text-[#FF7A3D]" :
                          "border-white/5 bg-transparent text-white/30"
                        }`}
                      >
                        <div className="text-[8px] text-[#98A2B3]/50 mb-1">Step {i + 1}</div>
                        <div className="truncate">{s.split(" ")[0]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400">
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-6">
                
                <div className={`rounded-xl border p-6 flex items-center justify-between ${
                  result.decision === 'Invest' 
                    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                    : "border-[#FF4B2B]/20 bg-[#FF4B2B]/5 text-[#FF7A3D]"
                }`}>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#98A2B3]">Compliance Decision</span>
                    <h2 className="text-3xl font-extrabold uppercase tracking-widest mt-1">{result.decision}</h2>
                  </div>
                  {result.confidence && (
                    <ConfidenceGauge score={parseFloat(result.confidence)} />
                  )}
                </div>

                <div className="rounded-xl border border-white/5 bg-[#11161D] p-6 space-y-4">
                  <div className="flex justify-between items-start border-b border-white/5 pb-4">
                    <div>
                      <div className="text-xl font-bold flex items-center gap-2">
                        {result.company}
                        {result.ticker && <span className="text-xs text-[#98A2B3]">· {result.ticker}</span>}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-[#98A2B3]/60">{result.sector || 'Unclassified Sector'}</span>
                    </div>
                    {result.website && (
                      <a
                        href={result.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-semibold text-[#FF7A3D] hover:underline"
                      >
                        Visit Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  {result.businessSummary && (
                    <p className="text-xs text-[#98A2B3] leading-relaxed">{result.businessSummary}</p>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <HistoricalEarningsChart history={result.earningsHistory} />
                  <AnalystConsensus trends={result.recommendationTrend} />
                </div>

                <div className="rounded-xl border border-white/5 bg-[#11161D] p-6 space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#98A2B3]">Audited Financial Indicators</h4>
                  <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                    {result.metrics && Object.entries(result.metrics).map(([key, val]) => (
                      <div key={key} className="rounded-lg border border-white/5 bg-[#050608]/40 p-3.5">
                        <div className="text-[9px] uppercase tracking-wider text-[#98A2B3]/60">{METRIC_LABELS[key] || key}</div>
                        <div className="text-sm font-semibold text-white mt-1">{String(val || 'N/A')}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {(pros.length > 0 || cons.length > 0) && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] p-5">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-bold mb-3">Positive Catalysts</div>
                      <ul className="space-y-2.5 text-xs text-[#98A2B3]">
                        {pros.map((p, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-emerald-400 font-bold">＋</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-red-500/10 bg-red-500/[0.02] p-5">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#FF4B2B] font-bold mb-3">Risk Catalysts</div>
                      <ul className="space-y-2.5 text-xs text-[#98A2B3]">
                        {cons.map((c, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-[#FF4B2B] font-bold">−</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {result.transcript && (
                  <div className="rounded-xl border border-white/5 bg-[#11161D] overflow-hidden">
                    <div className="flex items-center gap-2 border-b border-white/5 bg-[#050608]/50 px-4 py-3 text-[9px] uppercase tracking-wider text-[#98A2B3]">
                      <span className="h-2 w-2 rounded-full bg-red-500/70" />
                      <span className="h-2 w-2 rounded-full bg-yellow-500/70" />
                      <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                      <span className="ml-2 font-mono">agent@console ~ reasoning.md</span>
                    </div>
                    <div className="max-h-[500px] overflow-auto p-6 bg-[#0B1016]/40 leading-relaxed text-[#98A2B3]">
                      {renderMarkdown(result.transcript)}
                    </div>
                  </div>
                )}

              </div>
            )}
          </main>

          {/* COLUMN 3: INSIGHTS & TIMELINE PANEL */}
          <aside className="space-y-6">
            {result && (
              <div className="rounded-xl border border-white/5 bg-[#11161D] p-5 space-y-4">
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#98A2B3]">Quick Statistics</div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/40">Market Price:</span>
                    <span className="font-semibold text-white">{result.priceFmt || 'N/A'} {result.currency || ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Exchange:</span>
                    <span className="font-semibold text-white">{result.exchange || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Sector:</span>
                    <span className="font-semibold text-white truncate max-w-[120px]">{result.sector || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Industry:</span>
                    <span className="font-semibold text-white truncate max-w-[120px]">{result.industry || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-white/5 bg-[#11161D] p-5 space-y-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-[#98A2B3]">
                <Notebook className="h-3.5 w-3.5" />
                Auditor Notes
              </div>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Jot down notes or target ideas for this stock..."
                className="w-full h-32 rounded-lg border border-white/5 bg-[#050608]/40 p-3 text-xs text-white outline-none placeholder:text-[#98A2B3]/30 focus:border-[#FF4B2B]"
              />
              <span className="text-[9px] text-[#98A2B3]/50 block text-right uppercase tracking-wider">Saved locally</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-[#11161D] overflow-hidden">
              <div className="flex items-center gap-2 border-b border-white/5 bg-[#050608]/50 px-4 py-2 text-[9px] uppercase tracking-wider text-[#98A2B3]">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Console Log</span>
              </div>
              <pre className="max-h-56 overflow-auto p-4 font-mono text-[9px] leading-relaxed text-[#FF7A3D]/95 bg-black/20">
                {logs.length === 0 ? "// waiting for run..." : logs.join("\n")}
              </pre>
            </div>
          </aside>

        </div>
      </div>
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        token={token}
        onUpdateUser={onUpdateUser}
        onLogout={onLogout}
      />
    </div>
  );
}
