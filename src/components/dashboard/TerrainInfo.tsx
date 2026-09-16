import React, { useEffect, useRef } from "react";
import anime from "animejs";
import { Mountain, MapPin, TrendingUp } from "lucide-react";
import { useInView, useReducedMotion } from "../../hooks/useAnimations";
import { RiskData } from "../../data/mockRiskData";

interface TerrainInfoProps {
  data: RiskData;
}

export default function TerrainInfo({ data }: TerrainInfoProps) {
  const { ref, isInView } = useInView(0.2);
  const reducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);

  /*
   * Safe numeric values.
   * If any property is undefined, fallback value will be used.
   */
  const terrain = data?.terrain as
    | {
        elevation?: number;
        slope?: number;
        aspect?: number;
        roughness?: number;
      }
    | undefined;

  const elevation = Number(terrain?.elevation ?? 0);
  const slope = Number(terrain?.slope ?? 0);
  const aspect = Number(terrain?.aspect ?? 0);
  const roughness = Number(terrain?.roughness ?? 0);

  useEffect(() => {
    if (!isInView || reducedMotion || !containerRef.current) return;

    anime({
      targets: containerRef.current.querySelectorAll(".terrain-item"),
      translateY: [15, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 500,
      easing: "easeOutExpo",
    });
  }, [isInView, reducedMotion]);

  return (
    <div ref={ref} className="glass rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Mountain className="w-5 h-5 text-emerald-400" />

        <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">
          Terrain Information
        </h3>
      </div>

      <div ref={containerRef} className="grid grid-cols-2 gap-4">
        {/* Elevation */}
        <div
          className="terrain-item p-3 rounded-lg bg-white/[0.03] border border-white/5"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Mountain className="w-4 h-4 text-cyan-400" />

            <span className="text-xs text-gray-500 uppercase">
              Elevation
            </span>
          </div>

          <p className="text-lg font-semibold text-gray-200">
            {elevation.toFixed(0)}
            <span className="text-xs text-gray-500 ml-1">m</span>
          </p>
        </div>

        {/* Slope */}
        <div
          className="terrain-item p-3 rounded-lg bg-white/[0.03] border border-white/5"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />

            <span className="text-xs text-gray-500 uppercase">
              Slope
            </span>
          </div>

          <p className="text-lg font-semibold text-gray-200">
            {slope.toFixed(1)}
            <span className="text-xs text-gray-500 ml-1">°</span>
          </p>
        </div>

        {/* Aspect */}
        <div
          className="terrain-item p-3 rounded-lg bg-white/[0.03] border border-white/5"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-violet-400" />

            <span className="text-xs text-gray-500 uppercase">
              Aspect
            </span>
          </div>

          <p className="text-lg font-semibold text-gray-200">
            {aspect.toFixed(0)}
            <span className="text-xs text-gray-500 ml-1">°</span>
          </p>
        </div>

        {/* Roughness */}
        <div
          className="terrain-item p-3 rounded-lg bg-white/[0.03] border border-white/5"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Mountain className="w-4 h-4 text-rose-400" />

            <span className="text-xs text-gray-500 uppercase">
              Roughness
            </span>
          </div>

          <p className="text-lg font-semibold text-gray-200">
            {roughness.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}