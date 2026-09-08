import React from "react";
import { RiskData } from "../../data/mockRiskData";
import { AlertTriangle, ShieldAlert } from "lucide-react";

interface EarlyWarningProps {
  data: RiskData;
}

export default function EarlyWarning({ data }: EarlyWarningProps) {
  if (data.riskLevel !== "HIGH" && data.riskLevel !== "VERY_HIGH") return null;

  const isVeryHigh = data.riskLevel === "VERY_HIGH";

  return (
    <div
      className={`rounded-xl p-5 border ${
        isVeryHigh
          ? "bg-red-950/30 border-red-500/30"
          : "bg-amber-950/20 border-amber-500/20"
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isVeryHigh ? "bg-red-500/20" : "bg-amber-500/20"}`}>
          {isVeryHigh ? (
            <ShieldAlert className={`w-5 h-5 text-red-400`} />
          ) : (
            <AlertTriangle className={`w-5 h-5 text-amber-400`} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold uppercase tracking-widest ${isVeryHigh ? "text-red-400" : "text-amber-400"}`}>
              ⚠ Early Warning
            </span>
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${isVeryHigh ? "text-red-200" : "text-amber-200"}`}>
            {isVeryHigh ? "Landslide Risk Critically Elevated" : "Landslide Risk Elevated"}
          </h3>
          <p className="text-sm text-gray-300 mb-3">
            Risk probability: <span className="font-semibold text-white">{data.probability}%</span>
          </p>
          <p className="text-sm text-gray-400 mb-3">
            Current environmental and terrain conditions indicate {isVeryHigh ? "critically" : ""} increasing slope instability.
          </p>
          <div className="p-2.5 rounded-md bg-black/20 border border-white/5">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Primary driver:</span>
            <p className="text-sm text-gray-300 mt-1">{data.primaryDriver}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
