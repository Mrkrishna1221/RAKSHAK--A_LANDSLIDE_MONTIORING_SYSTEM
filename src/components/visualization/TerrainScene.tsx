import React from "react";
import type { RiskLevel } from "../../data/mockRiskData";

interface TerrainSceneProps {
  riskLevel: RiskLevel;
  rainfallIntensity?: number;
  deformationLevel?: number;
}

const riskColors: Record<RiskLevel, string> = {
  LOW: "#22c55e",
  MODERATE: "#eab308",
  HIGH: "#f97316",
  "VERY HIGH": "#ef4444",
  CRITICAL: "#dc2626",
};

export default function TerrainScene({
  riskLevel,
  rainfallIntensity = 0,
  deformationLevel = 0,
}: TerrainSceneProps) {
  const color = riskColors[riskLevel] ?? "#22c55e";

  const intensity = Math.min(
    100,
    Math.max(
      10,
      rainfallIntensity * 0.6 + deformationLevel * 10
    )
  );

  return (
    <div className="relative w-full h-full min-h-[260px] overflow-hidden rounded-xl bg-[#06141c]">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at center, ${color}55, transparent 65%)`,
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(${color}55 1px, transparent 1px),
            linear-gradient(90deg, ${color}55 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          transform: "perspective(500px) rotateX(58deg) scale(1.5)",
          transformOrigin: "center bottom",
        }}
      />

      {/* Mountain terrain */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative w-[85%] h-[65%]"
          style={{
            transform: "perspective(700px) rotateX(55deg) rotateZ(-5deg)",
          }}
        >
          {/* Mountain layers */}
          {[0, 1, 2, 3, 4].map((layer) => (
            <div
              key={layer}
              className="absolute left-1/2 top-1/2 rounded-full border"
              style={{
                width: `${90 - layer * 15}%`,
                height: `${75 - layer * 11}%`,
                transform: "translate(-50%, -50%)",
                borderColor: `${color}${35 + layer * 8}`,
                boxShadow: `0 0 25px ${color}22`,
                animation: `terrainPulse ${
                  4 + layer
                }s ease-in-out infinite alternate`,
              }}
            />
          ))}

          {/* Center peak */}
          <div
            className="absolute left-1/2 top-1/2 w-24 h-24 rounded-full"
            style={{
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, ${color}99, ${color}22, transparent 70%)`,
              boxShadow: `0 0 45px ${color}66`,
            }}
          />
        </div>
      </div>

      {/* Floating risk points */}
      {Array.from({ length: 12 }).map((_, index) => (
        <span
          key={index}
          className="absolute w-1.5 h-1.5 rounded-full animate-pulse"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
            left: `${15 + ((index * 37) % 70)}%`,
            top: `${18 + ((index * 23) % 65)}%`,
            animationDelay: `${index * 0.2}s`,
          }}
        />
      ))}

      {/* Header label */}
      <div className="absolute top-4 left-4 z-10">
        <div className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
          3D Terrain Simulation
        </div>

        <div
          className="mt-1 text-sm font-semibold"
          style={{ color }}
        >
          {riskLevel} RISK TERRAIN
        </div>
      </div>

      {/* Bottom data */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between text-[10px] text-gray-400">
        <span>
          Rainfall:{" "}
          <strong className="text-white">
            {rainfallIntensity.toFixed(1)}
          </strong>
        </span>

        <span>
          Deformation:{" "}
          <strong className="text-white">
            {deformationLevel.toFixed(2)}
          </strong>
        </span>

        <span style={{ color }}>
          Intensity: {intensity.toFixed(0)}%
        </span>
      </div>

      <style>
        {`
          @keyframes terrainPulse {
            from {
              opacity: 0.35;
              transform: translate(-50%, -50%) scale(0.96);
            }
            to {
              opacity: 0.9;
              transform: translate(-50%, -50%) scale(1.04);
            }
          }
        `}
      </style>
    </div>
  );
}