import React from "react";
import { ModelOutput } from "../../services/mlEngine";
import { getRiskColor } from "../../services/riskApi";
import { TrendingUp, TrendingDown, Minus, Target, Shield } from "lucide-react";

interface LiveRiskGaugeProps {
  mlOutput: ModelOutput;
}

export default function LiveRiskGauge({ mlOutput }: LiveRiskGaugeProps) {
  const { prediction, confidenceInterval, ensembleVotes } = mlOutput;
  const color = getRiskColor(prediction.riskLevel);
  const probability = prediction.probability;
  const confidence = prediction.confidence * 100;

  const TrendIcon = prediction.trend === "INCREASING" ? TrendingUp :
                    prediction.trend === "DECREASING" ? TrendingDown : Minus;
  const trendColor = prediction.trend === "INCREASING" ? "text-red-400" :
                     prediction.trend === "DECREASING" ? "text-green-400" : "text-gray-400";

  const riskLabel = prediction.riskLevel.replace("_", " ");

  return (
    <div className="glass rounded-2xl p-6 relative overflow-hidden">
      {/* Decorative background glow */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl"
        style={{ background: color }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Risk Assessment
          </h3>
        </div>

        {/* Main gauge */}
        <div className="relative w-52 h-52 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="1" />
                <stop offset="100%" stopColor={color} stopOpacity="0.5" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="8"
              strokeDasharray={`${(probability / 100) * 326.73} 326.73`}
              strokeLinecap="round"
              filter="url(#glow)"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-white" style={{ textShadow: `0 0 20px ${color}40` }}>
              {probability.toFixed(1)}
              <span className="text-2xl text-gray-400">%</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">Risk Probability</div>
          </div>
        </div>

        {/* Risk level badge */}
        <div className="text-center mb-5">
          <span
            className="inline-block px-5 py-2 rounded-full text-sm font-bold tracking-wider"
            style={{
              backgroundColor: `${color}20`,
              color,
              border: `1px solid ${color}40`,
              boxShadow: `0 0 20px ${color}20`,
            }}
          >
            {riskLabel}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Confidence</span>
            </div>
            <div className="text-lg font-bold text-white">{confidence.toFixed(1)}%</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendIcon className={`w-3 h-3 ${trendColor}`} />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Trend</span>
            </div>
            <div className={`text-lg font-bold ${trendColor}`}>{prediction.trend}</div>
          </div>
        </div>

        {/* Confidence interval */}
        <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
            Confidence Interval
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">{confidenceInterval.lower.toFixed(1)}%</span>
            <div className="flex-1 mx-3 h-1.5 bg-black/30 rounded-full overflow-hidden relative">
              <div
                className="absolute h-full rounded-full"
                style={{
                  left: `${confidenceInterval.lower}%`,
                  width: `${confidenceInterval.upper - confidenceInterval.lower}%`,
                  background: `linear-gradient(90deg, ${color}80, ${color})`,
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"
                style={{
                  left: `${probability}%`,
                  boxShadow: `0 0 8px ${color}`,
                }}
              />
            </div>
            <span className="text-gray-300">{confidenceInterval.upper.toFixed(1)}%</span>
          </div>
        </div>

        {/* Ensemble votes */}
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
            Ensemble Model Votes
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Random Forest", short: "RF", value: ensembleVotes.randomForest, color: "#3b82f6" },
              { label: "XGBoost", short: "XGB", value: ensembleVotes.xgboost, color: "#8b5cf6" },
              { label: "Neural Net", short: "NN", value: ensembleVotes.neuralNet, color: "#06b6d4" },
            ].map((model) => (
              <div key={model.short} className="text-center p-2 rounded-lg bg-white/5">
                <div className="text-[10px] text-gray-500 mb-0.5">{model.short}</div>
                <div className="text-sm font-bold" style={{ color: model.color }}>
                  {model.value.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
