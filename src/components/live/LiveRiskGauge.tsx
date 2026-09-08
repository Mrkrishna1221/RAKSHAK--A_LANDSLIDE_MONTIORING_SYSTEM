import React from "react";
import { ModelOutput } from "../../services/mlEngine";
import { getRiskColor } from "../../services/riskApi";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Current Risk Level</h3>
      
      {/* Main gauge */}
      <div className="relative w-48 h-48 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-gray-800"
          />
          <circle
            cx="96"
            cy="96"
            r="80"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={`${(probability / 100) * 502.65} 502.65`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-white">{probability.toFixed(1)}%</div>
          <div className="text-xs text-gray-400 mt-1">Risk Probability</div>
        </div>
      </div>

      {/* Risk level badge */}
      <div className="text-center mb-4">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-bold"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {prediction.riskLevel.replace("_", " ")}
        </span>
      </div>

      {/* Confidence and trend */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Model Confidence</span>
          <span className="text-white font-medium">{confidence.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Trend</span>
          <span className={`font-medium flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            {prediction.trend}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Confidence Interval</span>
          <span className="text-white font-medium">
            ±{(confidenceInterval.upper - probability).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Ensemble votes */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="text-xs text-gray-400 mb-2">Ensemble Model Votes</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-xs text-gray-500">RF</div>
            <div className="text-sm font-medium text-white">{ensembleVotes.randomForest.toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">XGB</div>
            <div className="text-sm font-medium text-white">{ensembleVotes.xgboost.toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">NN</div>
            <div className="text-sm font-medium text-white">{ensembleVotes.neuralNet.toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
