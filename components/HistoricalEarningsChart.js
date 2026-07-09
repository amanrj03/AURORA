export default function HistoricalEarningsChart({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex h-36 items-center justify-center rounded-xl bg-black/25 text-xs text-[#98A2B3] border border-white/5">
        No historical trends retrieved for this stock.
      </div>
    );
  }

  // Format data
  const data = history.map(item => ({
    year: item.date,
    revenue: item.revenue?.raw || 0,
    revenueFmt: item.revenue?.fmt || 'N/A',
    earnings: item.earnings?.raw || 0,
    earningsFmt: item.earnings?.fmt || 'N/A'
  }));

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const minRevenue = Math.min(...data.map(d => d.revenue)) * 0.9;
  const maxEarnings = Math.max(...data.map(d => d.earnings));
  const minEarnings = Math.min(...data.map(d => d.earnings)) * 0.9;

  const width = 450;
  const height = 160;
  const paddingLeft = 10;
  const paddingRight = 10;
  const paddingTop = 25;
  const paddingBottom = 25;

  const getX = (index) => {
    const space = (width - paddingLeft - paddingRight) / (data.length - 1);
    return paddingLeft + index * space;
  };

  const getY = (value, minVal, maxVal) => {
    if (maxVal === minVal) return height / 2;
    const range = maxVal - minVal;
    return height - paddingBottom - ((value - minVal) / range) * (height - paddingTop - paddingBottom);
  };

  const revenuePoints = data.map((d, i) => `${getX(i)},${getY(d.revenue, minRevenue, maxRevenue)}`).join(' ');
  const earningsPoints = data.map((d, i) => `${getX(i)},${getY(d.earnings, minEarnings, maxEarnings)}`).join(' ');

  const revenueArea = `${getX(0)},${height - paddingBottom} ${revenuePoints} ${getX(data.length - 1)},${height - paddingBottom}`;
  const earningsArea = `${getX(0)},${height - paddingBottom} ${earningsPoints} ${getX(data.length - 1)},${height - paddingBottom}`;

  return (
    <div className="rounded-xl border border-white/5 bg-[#11161D] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#98A2B3]">Financial Trajectory</h4>
          <span className="text-xs text-white/50">Historical Revenue &amp; Net Income</span>
        </div>
        <div className="flex gap-4 text-[10px] uppercase tracking-[0.15em]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FF7A3D]" />
            <span className="text-white/60">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FF4B2B]" />
            <span className="text-white/60">Earnings</span>
          </div>
        </div>
      </div>

      <div className="relative mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const yVal = paddingTop + ratio * (height - paddingTop - paddingBottom);
            return (
              <line
                key={ratio}
                x1={paddingLeft}
                y1={yVal}
                x2={width - paddingRight}
                y2={yVal}
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />
            );
          })}

          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF7A3D" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FF7A3D" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF4B2B" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FF4B2B" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          <polygon points={revenueArea} fill="url(#revGrad)" />
          <polyline points={revenuePoints} fill="none" stroke="#FF7A3D" strokeWidth="1.8" strokeLinecap="round" />

          <polygon points={earningsArea} fill="url(#earnGrad)" />
          <polyline points={earningsPoints} fill="none" stroke="#FF4B2B" strokeWidth="1.8" strokeLinecap="round" />

          {data.map((d, i) => (
            <g key={i}>
              <circle cx={getX(i)} cy={getY(d.revenue, minRevenue, maxRevenue)} r="3" fill="#050608" stroke="#FF7A3D" strokeWidth="1.5" />
              <circle cx={getX(i)} cy={getY(d.earnings, minEarnings, maxEarnings)} r="3" fill="#050608" stroke="#FF4B2B" strokeWidth="1.5" />
            </g>
          ))}
        </svg>

        <div className="mt-2 flex justify-between px-2 text-[10px] font-mono text-[#98A2B3]">
          {data.map((d, i) => (
            <div key={i} className="text-center">
              <div>{d.year}</div>
              <div className="text-[9px] text-[#FF7A3D]">{d.revenueFmt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
