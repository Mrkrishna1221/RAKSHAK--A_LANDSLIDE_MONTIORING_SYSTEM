import React from "react";
import { Anomaly } from "../../services/realTimeEngine";
import { AlertTriangle, AlertCircle, Info, Bell, Clock, Radio } from "lucide-react";

interface LiveAnomalyFeedProps {
  anomalies: Anomaly[];
}

export default function LiveAnomalyFeed({ anomalies }: LiveAnomalyFeedProps) {
  const recentAnomalies = anomalies.slice(-8).reverse();

  const severityConfig = {
    LOW: {
      icon: Info,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      badge: "bg-blue-500/20 text-blue-300",
    },
    MODERATE: {
      icon: AlertCircle,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      badge: "bg-yellow-500/20 text-yellow-300",
    },
    HIGH: {
      icon: AlertTriangle,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      badge: "bg-orange-500/20 text-orange-300",
    },
    CRITICAL: {
      icon: Bell,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      badge: "bg-red-500/20 text-red-300",
    },
  };

  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Anomaly Detection
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5">
          <Radio className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] text-gray-400">
            {anomalies.length} detected
          </span>
        </div>
      </div>

      {recentAnomalies.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Info className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-sm text-gray-400">No anomalies detected</p>
          <p className="text-xs text-gray-500 mt-1">All sensors reporting normal values</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {recentAnomalies.map((anomaly) => {
            const config = severityConfig[anomaly.severity];
            const Icon = config.icon;

            return (
              <div
                key={anomaly.id}
                className={`${config.bg} rounded-xl p-3 border ${config.border} transition-all hover:scale-[1.01]`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-1.5 rounded-lg ${config.badge} flex-shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${config.badge}`}>
                          {anomaly.severity}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {anomaly.sensorId}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(anomaly.timestamp)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {anomaly.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                      <span>Value: <span className="text-gray-300 font-medium">{anomaly.value.toFixed(2)}</span></span>
                      <span>Threshold: <span className="text-gray-300 font-medium">{anomaly.threshold.toFixed(2)}</span></span>
                    </div>
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
