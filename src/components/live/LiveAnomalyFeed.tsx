import React from "react";
import { Anomaly } from "../../services/realTimeEngine";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface LiveAnomalyFeedProps {
  anomalies: Anomaly[];
}

export default function LiveAnomalyFeed({ anomalies }: LiveAnomalyFeedProps) {
  const recentAnomalies = anomalies.slice(-5).reverse();

  const severityConfig = {
    LOW: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10" },
    MODERATE: { icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    HIGH: { icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10" },
    CRITICAL: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Anomaly Detection</h3>
      {recentAnomalies.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-4">No anomalies detected</div>
      ) : (
        <div className="space-y-2">
          {recentAnomalies.map((anomaly, i) => {
            const config = severityConfig[anomaly.severity];
            const Icon = config.icon;
            const timeAgo = Math.floor((Date.now() - anomaly.timestamp) / 1000);
            const timeStr = timeAgo < 60 ? `${timeAgo}s ago` : `${Math.floor(timeAgo / 60)}m ago`;

            return (
              <div key={anomaly.id} className={`${config.bg} rounded-lg p-3 border border-gray-800`}>
                <div className="flex items-start gap-2">
                  <Icon className={`w-4 h-4 ${config.color} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-medium ${config.color}`}>{anomaly.severity}</span>
                      <span className="text-xs text-gray-500">{timeStr}</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">{anomaly.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
