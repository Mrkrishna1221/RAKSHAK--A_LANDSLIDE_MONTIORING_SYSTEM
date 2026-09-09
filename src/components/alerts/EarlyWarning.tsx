import React, { useEffect, useRef } from "react";
import anime from "animejs";
import { useReducedMotion } from "../../hooks/useAnimations";
import { RiskData } from "../../data/mockRiskData";
import { AlertTriangle, ShieldAlert } from "lucide-react";

interface EarlyWarningProps {
  data: RiskData;
}

export default function EarlyWarning({ data }: EarlyWarningProps) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    // Entrance animation
    anime({
      targets: containerRef.current,
      translateX: [-20, 0],
      opacity: [0, 1],
      duration: 500,
      easing: "easeOutExpo",
    });

    // Pulse effect for VERY_HIGH - reduced intensity for performance
    if (data.riskLevel === "VERY_HIGH") {
      anime({
        targets: containerRef.current,
        boxShadow: [
          "0 0 0px rgba(239, 68, 68, 0)",
          "0 0 20px rgba(239, 68, 68, 0.15)",
          "0 0 0px rgba(239, 68, 68, 0)",
        ],
        duration: 2500,
        easing: "easeInOutSine",
        loop: true,
      });
    }
  }, [data.riskLevel, reducedMotion]);

  if (data.riskLevel !== "HIGH" && data.riskLevel !== "VERY_HIGH") return null;

  const isVeryHigh = data.riskLevel === "VERY_HIGH";

  return (
    <div
      ref={containerRef}
      className={`rounded-xl p-5 border ${
        isVeryHigh
          ? "bg-red-950/30 border-red-500/30"
          : "bg-amber-950/20 border-amber-500/20"
      }`}
      role="alert"
      aria-live="polite"
      style={{ opacity: reducedMotion ? 1 : 0 }}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-lg flex-shrink-0 ${isVeryHigh ? "bg-red-500/20" : "bg-amber-500/20"}`}>
          {isVeryHigh ? (
            <ShieldAlert className="w-5 h-5 text-red-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-xs font-bold uppercase tracking-widest block ${isVeryHigh ? "text-red-400" : "text-amber-400"}`}>
            ⚠ Early Warning
          </span>
          <h3 className={`text-base md:text-lg font-semibold mt-0.5 ${isVeryHigh ? "text-red-200" : "text-amber-200"}`}>
            {isVeryHigh ? "Landslide Risk Critically Elevated" : "Landslide Risk Elevated"}
          </h3>
        </div>
        {/* Risk score badge */}
        <div className={`flex-shrink-0 text-center px-4 py-2 rounded-lg ${isVeryHigh ? "bg-red-500/20" : "bg-amber-500/20"}`}>
          <div className={`text-2xl font-bold ${isVeryHigh ? "text-red-300" : "text-amber-300"}`}>
            {data.probability}%
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">Risk Score</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-4 leading-relaxed">
        Current environmental and terrain conditions indicate {isVeryHigh ? "critically " : ""}increasing slope instability.
      </p>

      {/* Primary driver */}
      <div className="p-3 rounded-lg bg-black/20 border border-white/5">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Primary driver</span>
        <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">{data.primaryDriver}</p>
      </div>
    </div>
  );
}
