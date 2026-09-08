import React from "react";
import { useInView } from "../../hooks/useAnimations";
import { Cloud, Mountain, Satellite, Database, Brain, ShieldAlert, AlertTriangle } from "lucide-react";

export default function DataPipeline() {
  const { ref, isInView } = useInView(0.2);

  const stages = [
    { icon: Cloud, label: "Rainfall Data", color: "#3b82f6" },
    { icon: Mountain, label: "Terrain Analysis", color: "#10b981" },
    { icon: Satellite, label: "Satellite Deformation", color: "#8b5cf6" },
    { icon: Database, label: "Historical Records", color: "#f97316" },
    { icon: Brain, label: "ML Risk Engine", color: "#ec4899" },
    { icon: ShieldAlert, label: "Risk Assessment", color: "#eab308" },
    { icon: AlertTriangle, label: "Early Warning", color: "#ef4444" },
  ];

  return (
    <div ref={ref} className="glass rounded-xl p-6 md:p-8">
      <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase mb-6 text-center">
        How RAKSHAK Works
      </h3>

      <div className="flex flex-col items-center gap-2">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <React.Fragment key={i}>
              <div
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/5 w-full max-w-xs transition-all duration-500"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateX(0)" : "translateX(-20px)",
                  transitionDelay: `${i * 120}ms`,
                }}
              >
                <div
                  className="p-1.5 rounded-md"
                  style={{ backgroundColor: `${stage.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: stage.color }} />
                </div>
                <span className="text-sm text-gray-300 font-medium">{stage.label}</span>
              </div>
              {i < stages.length - 1 && (
                <div
                  className="w-px h-4 transition-all duration-500"
                  style={{
                    backgroundColor: `${stage.color}40`,
                    opacity: isInView ? 1 : 0,
                    transitionDelay: `${i * 120 + 60}ms`,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 text-center mt-6 max-w-md mx-auto">
        RAKSHAK integrates multiple geospatial and environmental data sources through a machine learning risk engine to produce dynamic landslide susceptibility estimates.
      </p>
    </div>
  );
}
