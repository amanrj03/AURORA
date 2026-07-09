export default function ConfidenceGauge({ score = 0.5 }) {
  const percentage = Math.round(score * 100);
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score * circumference);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-[#11161D]">
      <div className="text-[10px] uppercase tracking-[0.25em] text-[#98A2B3] mb-3">Model Confidence</div>
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF7A3D" />
              <stop offset="100%" stopColor="#FF4B2B" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tracking-tight text-white">{percentage}%</span>
          <span className="text-[8px] uppercase tracking-wider text-[#98A2B3]">Rating</span>
        </div>
      </div>
    </div>
  );
}
