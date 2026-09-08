import React from "react";
import { useInView } from "../../hooks/useAnimations";
import { RiskData } from "../../data/mockRiskData";
import { AlertTriangle, Zap } from "lucide-react";

interface RiskFactorsProps {
  data: RiskData;
}

const severityColors = {
  LOW: "#22c55e",
  MODERATE: "#eab308",
  HIGH: "#f97316",
  VERY_HIGH: "#ef4444",
};

export default function RiskFactors({ data }: RiskFactorsProps) {
  const { ref, isInView } = useInView(0.2);

  return (
    <div ref={ref} className="glass rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Zap className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">
          Why is the risk {data.riskLevel === "VERY_HIGH" ? "very high" : data.riskLevel.toLowerCase()}?
        </h3>
      </div>

      <div className="space-y-4">
        {data.factors.map((factor, index) => {
          const color = severityColors[factor.severity];
          return (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{factor.name}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
                  {factor.severity.replace("_", " ")}
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: isInView ? `${factor.value}%` : "0%",
                    backgroundColor: color,
                    transitionDelay: `${index * 150}ms`,
                    boxShadow: `0 0 8px ${color}40`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-3 rounded-lg bg-white/[0.03] border border-white/5">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Primary driver:</span>
            <p className="text-sm text-gray-300 mt-1">{data.primaryDriver}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
