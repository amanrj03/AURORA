export default function AnalystConsensus({ trends }) {
  if (!trends) {
    return (
      <div className="rounded-xl border border-white/5 bg-[#11161D] p-5 text-xs text-[#98A2B3] text-center">
        Analyst recommendation feed not active.
      </div>
    );
  }

  const buy = (trends.strongBuy || 0) + (trends.buy || 0);
  const hold = trends.hold || 0;
  const sell = (trends.sell || 0) + (trends.strongSell || 0);
  const total = buy + hold + sell || 1;

  const buyPct = (buy / total) * 100;
  const holdPct = (hold / total) * 100;
  const sellPct = (sell / total) * 100;

  return (
    <div className="rounded-xl border border-white/5 bg-[#11161D] p-5">
      <div className="text-[10px] uppercase tracking-[0.25em] text-[#98A2B3]">Wall Street Consensus</div>
      <div className="mt-2 text-xs text-white/50">Recommendations trend compiled from {total} analyst inputs</div>
      
      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white/5">
        {buy > 0 && <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${buyPct}%` }} title={`Buy: ${buy}`} />}
        {hold > 0 && <div className="h-full bg-gray-500 transition-all duration-500" style={{ width: `${holdPct}%` }} title={`Hold: ${hold}`} />}
        {sell > 0 && <div className="h-full bg-[#FF4B2B] transition-all duration-500" style={{ width: `${sellPct}%` }} title={`Sell: ${sell}`} />}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-wider">
        <div>
          <div className="text-emerald-400 font-bold">{buyPct.toFixed(0)}%</div>
          <div className="text-white/40 mt-0.5">Buy ({buy})</div>
        </div>
        <div>
          <div className="text-gray-300 font-bold">{holdPct.toFixed(0)}%</div>
          <div className="text-white/40 mt-0.5">Hold ({hold})</div>
        </div>
        <div>
          <div className="text-[#FF4B2B] font-bold">{sellPct.toFixed(0)}%</div>
          <div className="text-white/40 mt-0.5">Sell ({sell})</div>
        </div>
      </div>
    </div>
  );
}
