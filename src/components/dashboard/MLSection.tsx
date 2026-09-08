import React from "react";
import { useInView } from "../../hooks/useAnimations";
import { Brain, Database, BarChart3 } from "lucide-react";

export default function MLSection() {
  const { ref, isInView } = useInView(0.2);

  const inputs = [
    { label: "Terrain Features", icon: "⛰" },
    { label: "Rainfall Data", icon: "🌧" },
    { label: "Ground Deformation", icon: "📡" },
    { label: "Geology", icon: "🪨" },
    { label: "Historical Landslides", icon: "📊" },
  ];

  return (
    <div ref={ref} className="glass rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">
          ML Risk Engine
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-4 items-center">
        {/* Inputs */}
        <div className="space-y-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Input Features</div>
          {inputs.map((input, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/[0.03] border border-white/5 transition-all duration-500"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateX(0)" : "translateX(-10px)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <span className="text-sm">{input.icon}</span>
              <span className="text-xs text-gray-300">{input.label}</span>
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-2">
          <div className="hidden md:flex flex-col items-center gap-1">
            <div className="w-px h-6 bg-purple-500/30" />
            <Database className="w-8 h-8 p-2 rounded-lg bg-purple-500/10 text-purple-400" />
            <div className="text-xs text-gray-500 text-center">
              Random Forest / XGBoost
            </div>
            <div className="w-px h-6 bg-purple-500/30" />
          </div>
          <div className="md:hidden flex items-center gap-2">
            <div className="h-px w-6 bg-purple-500/30" />
            <Database className="w-6 h-6 p-1 rounded bg-purple-500/10 text-purple-400" />
            <div className="h-px w-6 bg-purple-500/30" />
          </div>
        </div>

        {/* Output */}
        <div className="text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Output</div>
          <div
            className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 transition-all duration-700"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "scale(1)" : "scale(0.9)",
            }}
          >
            <BarChart3 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-sm font-semibold text-gray-200">Dynamic Risk Probability</div>
            <div className="text-xs text-gray-500 mt-1">Estimated landslide susceptibility</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-3 rounded-lg bg-white/[0.02] border border-white/5">
        <p className="text-xs text-gray-500">
          <span className="text-gray-400 font-medium">Note:</span> This demo interface displays mock data. The ML risk engine (Random Forest / XGBoost) processes geospatial features to produce dynamic risk probability estimates. The frontend displays model output — it does not run inference locally.
        </p>
      </div>
    </div>
  );
}
