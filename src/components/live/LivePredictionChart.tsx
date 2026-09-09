import React from "react";
import { TimeSeriesPoint } from "../../services/realTimeEngine";
import { TrendingUp, Clock } from "lucide-react";

interface LivePredictionChartProps {
  predictions: TimeSeriesPoint[];
  confidenceInterval: { lower: number; upper: number };
}

export default function LivePredictionChart({ predictions, confidenceInterval }: LivePredictionChartProps) {
  if (predictions.length === 0) return null;

  const width = 300;
  const height = 150;
  const padding = 15;

  const allValues = predictions.flatMap((p) => [
    p.value,
    p.upperBound || p.value,
    p.lowerBound || p.value,
  ]);
  const maxVal = Math.max(...allValues);
  const minVal = Math.min(...allValues);
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

  const currentPrediction = predictions[0].value;
  const futurePrediction = predictions[predictions.length - 1].value;
  const change = futurePrediction - currentPrediction;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            24h Prediction
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-gray-500" />
          <span className="text-[10px] text-gray-500">
            {change > 0 ? "+" : ""}{change.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
          <defs>
            <linearGradient id="predGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <filter id="predGlow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((ratio, i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + ratio * (height - 2 * padding)}
              x2={width - padding}
              y2={padding + ratio * (height - 2 * padding)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          ))}

          {/* Confidence band */}
          <path
            d={`M${upperLine} L${lowerLine.split(" ").reverse().join(" ")} Z`}
            fill="rgba(59, 130, 246, 0.1)"
          />

          {/* Area under curve */}
          <polygon
            points={`${xScale(0)},${height - padding} ${mainLine} ${xScale(predictions.length - 1)},${height - padding}`}
            fill="url(#predGradient)"
          />

          {/* Main prediction line */}
          <polyline
            points={mainLine}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            filter="url(#predGlow)"
          />

          {/* Current point */}
          <circle
            cx={xScale(0)}
            cy={yScale(predictions[0].value)}
            r="5"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="2"
          />
          <circle
            cx={xScale(0)}
            cy={yScale(predictions[0].value)}
            r="8"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            opacity="0.5"
          >
            <animate attributeName="r" from="5" to="12" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Time markers */}
        <div className="flex justify-between text-[10px] text-gray-500 mt-2 px-2">
          <span>Now</span>
          <span>+6h</span>
          <span>+12h</span>
          <span>+18h</span>
          <span>+24h</span>
        </div>
      </div>

      {/* Prediction summary */}
      <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="text-[10px] text-gray-500">Current</div>
          <div className="text-sm font-bold text-white">{currentPrediction.toFixed(1)}%</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-500">+12h</div>
          <div className="text-sm font-bold text-white">
            {predictions[Math.floor(predictions.length / 2)]?.value.toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-500">+24h</div>
          <div className={`text-sm font-bold ${change > 0 ? "text-red-400" : "text-green-400"}`}>
            {futurePrediction.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
