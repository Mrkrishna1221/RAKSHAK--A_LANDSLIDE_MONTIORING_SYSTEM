import React from "react";

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
    { label: "Accuracy", value: metrics.accuracy },
    { label: "Precision", value: metrics.precision },
    { label: "Recall", value: metrics.recall },
    { label: "F1 Score", value: metrics.f1Score },
    { label: "AUC-ROC", value: metrics.aucRoc },
  ];

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Model Performance</h3>
      <div className="space-y-2">
        {metricList.map((metric, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{metric.label}</span>
            <span className="text-sm font-medium text-white">{(metric.value * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
