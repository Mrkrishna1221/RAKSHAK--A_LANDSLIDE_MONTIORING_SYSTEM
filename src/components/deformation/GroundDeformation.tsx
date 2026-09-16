import React from "react";
import { TrendingUp, Activity } from "lucide-react";

interface GroundDeformationProps {
  deformation?: number;
}

export default function GroundDeformation({
  deformation = 0,
}: GroundDeformationProps) {
  const level =
    deformation > 8
      ? "Critical"
      : deformation > 5
      ? "High"
      : deformation > 2
      ? "Moderate"
      : "Stable";

  return (
    <div className="w-full h-full min-h-[260px] rounded-xl border border-white/10 bg-slate-950/60 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500">
            Ground Deformation
          </p>

          <h3 className="mt-1 text-lg font-semibold text-white">
            Surface Movement
          </h3>
        </div>

        <div className="rounded-lg bg-emerald-500/10 p-2">
          <Activity className="h-5 w-5 text-emerald-400" />
        </div>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold text-white">
          {deformation.toFixed(2)}
        </span>

        <span className="mb-1 text-sm text-gray-500">
          mm/month
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-emerald-400" />

        <span className="text-sm text-emerald-400">
          {level}
        </span>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-emerald-400 transition-all"
          style={{
            width: `${Math.min(100, Math.max(5, deformation * 8))}%`,
          }}
        />
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Monitoring satellite-based terrain displacement data
      </p>
    </div>
  );
}