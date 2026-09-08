import React from "react";
import { useInView } from "../../hooks/useAnimations";
import { RiskData } from "../../data/mockRiskData";
import { Mountain, Compass, Waves, Layers } from "lucide-react";

interface TerrainInfoProps {
  data: RiskData;
}

export default function TerrainInfo({ data }: TerrainInfoProps) {
  const { ref, isInView } = useInView(0.2);

  const metrics = [
    { label: "Elevation", value: `${data.terrain.elevation.toLocaleString()} m`, icon: Mountain, color: "#3b82f6" },
    { label: "Slope", value: `${data.terrain.slope}°`, icon: Mountain, color: "#f97316" },
    { label: "Aspect", value: data.terrain.aspect, icon: Compass, color: "#8b5cf6" },
    { label: "Roughness", value: data.terrain.roughness.toFixed(2), icon: Waves, color: "#06b6d4" },
    { label: "Curvature", value: data.terrain.curvature.toFixed(2), icon: Layers, color: "#10b981" },
  ];

  return (
    <div ref={ref} className="glass rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Mountain className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">
          Terrain Information
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-center transition-all duration-500"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(10px)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <Icon className="w-4 h-4 mx-auto mb-2" style={{ color: metric.color }} />
              <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
              <div className="text-lg font-bold text-gray-200">{metric.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
