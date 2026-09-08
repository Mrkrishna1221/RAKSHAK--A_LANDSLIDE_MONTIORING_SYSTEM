import React from "react";
import { useInView } from "../../hooks/useAnimations";
import { RiskData } from "../../data/mockRiskData";
import { Droplets, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RainfallAnalysisProps {
  data: RiskData;
}

export default function RainfallAnalysis({ data }: RainfallAnalysisProps) {
  const { ref, isInView } = useInView(0.2);

  const chartData = [
    { label: "1h", value: data.rainfall.oneHour, fill: "#3b82f6" },
    { label: "6h", value: data.rainfall.sixHour, fill: "#3b82f6" },
    { label: "24h", value: data.rainfall.twentyFourHour, fill: "#60a5fa" },
    { label: "3d", value: data.rainfall.threeDay, fill: "#93c5fd" },
    { label: "7d", value: data.rainfall.sevenDay, fill: "#bfdbfe" },
    { label: "30d", value: data.rainfall.thirtyDay, fill: "#dbeafe" },
  ];

  const barData = [
    { name: "1h", mm: data.rainfall.oneHour },
    { name: "6h", mm: data.rainfall.sixHour },
    { name: "24h", mm: data.rainfall.twentyFourHour },
    { name: "3d", mm: data.rainfall.threeDay },
    { name: "7d", mm: data.rainfall.sevenDay },
    { name: "30d", mm: data.rainfall.thirtyDay },
  ];

  return (
    <div ref={ref} className="glass rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Droplets className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">
          Rainfall Analysis
        </h3>
      </div>

      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={barData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: "#8a8a95", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#8a8a95", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(17,17,19,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#e4e4e7",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value} mm`, "Rainfall"]}
            />
            <Area
              type="monotone"
              dataKey="mm"
              stroke="#3b82f6"
              fill="url(#rainGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {chartData.map((item, i) => (
          <div
            key={i}
            className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/5"
          >
            <div className="text-xs text-gray-500 mb-1">{item.label}</div>
            <div className="text-sm font-semibold text-gray-200">{item.value} mm</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-white/[0.02] rounded-md p-2.5">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-blue-400/60" />
        <span>Rainfall is one contributing factor to dynamic landslide risk. Accumulated rainfall over extended periods increases soil saturation and pore water pressure.</span>
      </div>
    </div>
  );
}
