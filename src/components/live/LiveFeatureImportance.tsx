import React from "react";
import { FeatureImportance } from "../../services/mlEngine";

interface LiveFeatureImportanceProps {
  features: FeatureImportance[];
}

export default function LiveFeatureImportance({ features }: LiveFeatureImportanceProps) {
  const maxContribution = Math.max(...features.map((f) => f.contribution));

  const statusColors = {
    NORMAL: "bg-green-500",
    ELEVATED: "bg-yellow-500",
    CRITICAL: "bg-red-500",
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Feature Importance (SHAP)</h3>
      <div className="space-y-3">
        {features.map((feature, i) => {
          const width = (feature.contribution / maxContribution) * 100;
          return (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-300">{feature.feature}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{feature.contribution.toFixed(1)}</span>
                  <div className={`w-2 h-2 rounded-full ${statusColors[feature.status]}`} />
                </div>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
