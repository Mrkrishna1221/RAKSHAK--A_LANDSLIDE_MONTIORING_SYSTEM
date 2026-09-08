import React from "react";
import { useInView } from "../../hooks/useAnimations";
import { RiskData } from "../../data/mockRiskData";
import { deformationTimeline } from "../../data/mockRiskData";
import { Activity, TrendingUp, ArrowUpRight, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DeformationProps {
  data: RiskData;
}

const trendLabels = {
  STABLE: "Stable",
  INCREASING: "Increasing Movement",
  ACCELERATING: "Accelerating Movement",
};

const trendColors = {
  STABLE: "#22c55e",
  INCREASING: "#eab308",
  ACCELERATING: "#ef4444",
};

export default function GroundDeformation({ data }: DeformationProps) {
  const { ref, isInView } = useInView(0.2);
  const trend = data.deformation.trend;
  const color = trendColors[trend];

  const stages = [
    { label: "Stable", active: true },
    { label: "Slow Movement", active: trend !== "STABLE" },
    { label: "Increasing Movement", active: trend === "INCREASING" || trend === "ACCELERATING" },
    { label: "Accelerating Movement", active: trend === "ACCELERATING" },
    { label: "Potential Instability", active: trend === "ACCELERATING" && data.deformation.acceleration > 0.2 },
  ];

  return (
    <div ref={ref} className="glass rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Activity className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">
          Ground Deformation
        </h3>
      </div>

      {/* Trend indicator */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold"
          style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          {trendLabels[trend]}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-center">
          <div className="text-xs text-gray-500 mb-1">Current</div>
          <div className="text-lg font-bold text-gray-200">{data.deformation.current} <span className="text-xs text-gray-500">mm</span></div>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-center">
          <div className="text-xs text-gray-500 mb-1">Velocity</div>
          <div className="text-lg font-bold text-gray-200">{data.deformation.velocity} <span className="text-xs text-gray-500">mm/day</span></div>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-center">
          <div className="text-xs text-gray-500 mb-1">Acceleration</div>
          <div className="text-lg font-bold text-gray-200">{data.deformation.acceleration} <span className="text-xs text-gray-500">mm/day²</span></div>
        </div>
      </div>

      {/* Progression stages */}
      <div className="mb-5">
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Deformation Progression</div>
        <div className="flex items-center gap-1">
          {stages.map((stage, i) => (
            <React.Fragment key={i}>
              <div
                className={`flex-1 h-1.5 rounded-full transition-all duration-700 ${
                  stage.active ? "" : "bg-white/5"
                }`}
                style={{
                  backgroundColor: stage.active ? color : undefined,
                  transitionDelay: `${i * 100}ms`,
                  opacity: stage.active ? 1 : 0.3,
                }}
              />
              {i < stages.length - 1 && (
                <div className="w-1 h-1 rounded-full bg-white/10" />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          {stages.map((stage, i) => (
            <span key={i} className={`text-[9px] ${stage.active ? "text-gray-400" : "text-gray-600"}`}>
              {stage.label}
            </span>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-36 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={deformationTimeline} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: "#8a8a95", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#8a8a95", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(17,17,19,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#e4e4e7",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value} mm`, "Deformation"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-start gap-2 text-xs text-gray-500 bg-white/[0.02] rounded-md p-2.5">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-blue-400/60" />
        <span>Ground deformation represents observed surface movement. Increasing velocity or acceleration may indicate changing slope stability. This is one indicator among multiple factors used in risk assessment.</span>
      </div>
    </div>
  );
}
