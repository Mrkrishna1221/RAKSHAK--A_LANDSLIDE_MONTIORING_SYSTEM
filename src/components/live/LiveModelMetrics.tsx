import React from "react";
import { Cpu, CheckCircle, Award } from "lucide-react";

interface LiveModelMetricsProps {
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    aucRoc: number;
  };
}

export default function LiveModelMetrics({ metrics }: LiveModelMetricsProps) {
  const metricList = [
    { label: "Accuracy", value: metrics.accuracy, icon: CheckCircle, color: "#22c55e" },
    { label: "Precision", value: metrics.precision, icon: Award, color: "#3b82f6" },
    { label: "Recall", value: metrics.recall, icon: CheckCircle, color: "#8b5cf6" },
    { label: "F1 Score", value: metrics.f1Score, icon: Award, color: "#06b6d4" },
    { label: "AUC-ROC", value: metrics.aucRoc, icon: Cpu, color: "#f59e0b" },
  ];

  const avgScore = Object.values(metrics).reduce((s, v) => s + v, 0) / Object.values(metrics).length;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Model Performance
          </h3>
        </div>
        <div className="text-[10px] text-gray-500 font-mono">
          Avg: {(avgScore * 100).toFixed(1)}%
        </div>
      </div>

      <div className="space-y-3">
        {metricList.map((metric, i) => {
          const Icon = metric.icon;
          const percentage = metric.value * 100;
          return (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-3 h-3" style={{ color: metric.color }} />
                  <span className="text-xs text-gray-400">{metric.label}</span>
                </div>
                <span className="text-sm font-bold text-white">{percentage.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${metric.color}80, ${metric.color})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Model info */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="p-2 rounded-lg bg-white/5">
            <div className="text-gray-500">Architecture</div>
            <div className="text-gray-300 font-medium">Ensemble v2.1</div>
          </div>
          <div className="p-2 rounded-lg bg-white/5">
            <div className="text-gray-500">Last Updated</div>
            <div className="text-gray-300 font-medium">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
