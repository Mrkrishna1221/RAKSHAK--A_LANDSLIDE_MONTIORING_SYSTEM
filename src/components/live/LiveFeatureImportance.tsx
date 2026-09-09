import React from "react";
import { FeatureImportance } from "../../services/mlEngine";
import { Brain, TrendingUp } from "lucide-react";

interface LiveFeatureImportanceProps {
  features: FeatureImportance[];
}

export default function LiveFeatureImportance({ features }: LiveFeatureImportanceProps) {
  const maxContribution = Math.max(...features.map((f) => f.contribution));
  const totalContribution = features.reduce((sum, f) => sum + f.contribution, 0);

  const statusColors = {
    NORMAL: { bar: "bg-gradient-to-r from-green-500 to-emerald-400", dot: "bg-green-400" },
    ELEVATED: { bar: "bg-gradient-to-r from-yellow-500 to-amber-400", dot: "bg-yellow-400" },
    CRITICAL: { bar: "bg-gradient-to-r from-red-500 to-orange-400", dot: "bg-red-400" },
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Feature Importance
          </h3>
        </div>
        <div className="text-[10px] text-gray-500 font-mono">SHAP Analysis</div>
      </div>

      <div className="space-y-3">
        {features.map((feature, i) => {
          const width = (feature.contribution / maxContribution) * 100;
          const percentage = (feature.contribution / totalContribution) * 100;
          const colors = statusColors[feature.status];

          return (
            <div key={i} className="group">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                  <span className="text-xs text-gray-300 font-medium">{feature.feature}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500">{feature.value.toFixed(2)}</span>
                  <span className="text-xs font-bold text-white">{percentage.toFixed(0)}%</span>
                </div>
              </div>
              <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${colors.bar} transition-all duration-700 ease-out group-hover:opacity-80`}
                  style={{ width: `${width}%` }}
                />
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-[9px] text-gray-500">
                  Weight: {(feature.importance * 100).toFixed(0)}%
                </span>
                <span className={`text-[9px] font-medium ${
                  feature.status === "CRITICAL" ? "text-red-400" :
                  feature.status === "ELEVATED" ? "text-yellow-400" : "text-green-400"
                }`}>
                  {feature.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Primary Driver</span>
          <span className="font-semibold text-white flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-blue-400" />
            {features[0]?.feature}
          </span>
        </div>
      </div>
    </div>
  );
}
