import React from "react";
import { FeatureImportance } from "../../services/mlEngine";
import { Brain, TrendingUp } from "lucide-react";

interface LiveFeatureImportanceProps {
  features?: FeatureImportance[];
}

type FeatureStatus = "NORMAL" | "ELEVATED" | "CRITICAL";

interface SafeFeature {
  feature: string;
  value: number;
  contribution: number;
  importance: number;
  status: FeatureStatus;
}

const safeNumber = (value: unknown, fallback = 0): number => {
  const numberValue = Number(value);

  return Number.isFinite(numberValue)
    ? numberValue
    : fallback;
};

const normalizeStatus = (status: unknown): FeatureStatus => {
  if (status === "CRITICAL") return "CRITICAL";
  if (status === "ELEVATED") return "ELEVATED";
  return "NORMAL";
};

export default function LiveFeatureImportance({
  features = [],
}: LiveFeatureImportanceProps) {
  /*
   * Normalize all incoming feature values.
   * This prevents undefined, null, NaN and invalid numbers.
   */
  const safeFeatures: SafeFeature[] = (features ?? []).map(
    (feature, index) => ({
      feature:
        typeof feature?.feature === "string" &&
        feature.feature.trim().length > 0
          ? feature.feature
          : `Feature ${index + 1}`,

      value: safeNumber(feature?.value),

      contribution: Math.max(
        0,
        safeNumber(feature?.contribution)
      ),

      importance: Math.max(
        0,
        safeNumber(feature?.importance)
      ),

      status: normalizeStatus(feature?.status),
    })
  );

  const maxContribution = Math.max(
    ...safeFeatures.map((feature) => feature.contribution),
    1
  );

  const totalContribution = safeFeatures.reduce(
    (sum, feature) => sum + feature.contribution,
    0
  );

  const statusColors: Record<
    FeatureStatus,
    {
      bar: string;
      dot: string;
      text: string;
    }
  > = {
    NORMAL: {
      bar: "bg-gradient-to-r from-green-500 to-emerald-400",
      dot: "bg-green-400",
      text: "text-green-400",
    },
    ELEVATED: {
      bar: "bg-gradient-to-r from-yellow-500 to-amber-400",
      dot: "bg-yellow-400",
      text: "text-yellow-400",
    },
    CRITICAL: {
      bar: "bg-gradient-to-r from-red-500 to-orange-400",
      dot: "bg-red-400",
      text: "text-red-400",
    },
  };

  return (
    <div className="glass rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400" />

          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Feature Importance
          </h3>
        </div>

        <div className="text-[10px] text-gray-500 font-mono">
          SHAP Analysis
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        {safeFeatures.length > 0 ? (
          safeFeatures.map((feature, index) => {
            const width = Math.min(
              100,
              Math.max(
                0,
                (feature.contribution / maxContribution) * 100
              )
            );

            const percentage =
              totalContribution > 0
                ? Math.min(
                    100,
                    Math.max(
                      0,
                      (feature.contribution / totalContribution) *
                        100
                    )
                  )
                : 0;

            const colors = statusColors[feature.status];

            return (
              <div key={`${feature.feature}-${index}`} className="group">
                {/* Label row */}
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`}
                    />

                    <span className="text-xs text-gray-300 font-medium truncate">
                      {feature.feature}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-gray-500">
                      {feature.value.toFixed(2)}
                    </span>

                    <span className="text-xs font-bold text-white">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors.bar} transition-all duration-700 ease-out group-hover:opacity-80`}
                    style={{
                      width: `${width}%`,
                    }}
                  />
                </div>

                {/* Bottom information */}
                <div className="flex justify-between mt-0.5">
                  <span className="text-[9px] text-gray-500">
                    Weight:{" "}
                    {(feature.importance * 100).toFixed(0)}%
                  </span>

                  <span
                    className={`text-[9px] font-medium ${colors.text}`}
                  >
                    {feature.status}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-5 text-center text-xs text-gray-500">
            No feature importance data available.
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">
            Primary Driver
          </span>

          <span className="font-semibold text-white flex items-center gap-1 max-w-[65%] truncate">
            <TrendingUp className="w-3 h-3 text-blue-400 flex-shrink-0" />

            {safeFeatures[0]?.feature ?? "Not available"}
          </span>
        </div>
      </div>
    </div>
  );
}