import React from "react";
import { TimeSeriesPoint } from "../../services/realTimeEngine";

interface LivePredictionChartProps {
  predictions: TimeSeriesPoint[];
  confidenceInterval: { lower: number; upper: number };
}

export default function LivePredictionChart({ predictions, confidenceInterval }: LivePredictionChartProps) {
  if (predictions.length === 0) return null;

  const width = 300;
  const height = 150;
  const padding = 10;

  const maxVal = Math.max(...predictions.map((p) => p.upperBound || p.value));
  const minVal = Math.min(...predictions.map((p) => p.lowerBound || p.value));
  const range = maxVal - minVal || 1;

  const xScale = (i: number) => padding + (i / (predictions.length - 1)) * (width - 2 * padding);
  const yScale = (v: number) => height - padding - ((v - minVal) / range) * (height - 2 * padding);

  const mainLine = predictions
    .map((p, i) => `${xScale(i)},${yScale(p.value)}`)
    .join(" ");

  const upperLine = predictions
    .map((p, i) => `${xScale(i)},${yScale(p.upperBound || p.value)}`)
    .join(" ");

  const lowerLine = predictions
    .map((p, i) => `${xScale(i)},${yScale(p.lowerBound || p.value)}`)
    .join(" ");

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">24h Risk Prediction</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
        {/* Confidence band */}
        <path
          d={`M${upperLine} L${lowerLine.split(" ").reverse().join(" ")} Z`}
          fill="rgba(59, 130, 246, 0.1)"
        />
        {/* Main line */}
        <polyline points={mainLine} fill="none" stroke="#3b82f6" strokeWidth="2" />
        {/* Current point */}
        <circle cx={xScale(0)} cy={yScale(predictions[0].value)} r="4" fill="#3b82f6" />
      </svg>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Now</span>
        <span>+6h</span>
        <span>+12h</span>
        <span>+24h</span>
      </div>
    </div>
  );
}
