import { useState } from "react";
import { TrendingUp } from "lucide-react";

export default function PremiumLogo({ className = "" }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {!imgError ? (
        <img
          src="/logo.png"
          alt="Aurora Logo"
          className="h-16 md:h-20 w-auto object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <>
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF4B2B] to-[#FF7A3D] p-1.5 shadow-md">
            <TrendingUp className="h-5 w-5 text-white" />
            <div className="absolute inset-0 rounded-lg border border-white/20 animate-pulse" />
          </div>
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-white">AURORA</span>
        </>
      )}
    </div>
  );
}
