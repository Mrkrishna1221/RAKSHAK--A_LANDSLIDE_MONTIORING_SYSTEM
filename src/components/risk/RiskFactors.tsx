import React, { useEffect, useRef } from "react";
import anime from "animejs";
import {
  useInView,
  useReducedMotion,
} from "../../hooks/useAnimations";
import { RiskData } from "../../data/mockRiskData";
import { AlertTriangle, Zap } from "lucide-react";

interface RiskFactorsProps {
  data: RiskData;
}

type FactorSeverity = "LOW" | "MODERATE" | "HIGH";

interface RiskFactor {
  name: string;
  value: number;
  severity: FactorSeverity;
}

const severityColors: Record<FactorSeverity, string> = {
  LOW: "#22c55e",
  MODERATE: "#eab308",
  HIGH: "#f97316",
};

function getSeverity(value: number): FactorSeverity {
  if (value >= 70) return "HIGH";
  if (value >= 40) return "MODERATE";
  return "LOW";
}

export default function RiskFactors({ data }: RiskFactorsProps) {
  const { ref, isInView } = useInView(0.2);

  const barsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const driverRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  /*
   * Generate factors from the actual RiskData fields.
   * This avoids using data.factors because it does not exist
   * in your RiskData interface.
   */
  const rainfallValue = Math.min(
    100,
    Math.max(0, data?.rainfall?.twentyFourHour ?? 0)
  );

  const slopeValue = Math.min(
    100,
    Math.max(0, data?.terrain?.slope ?? 0)
  );

  const deformationValue = Math.min(
    100,
    Math.max(0, data?.deformation?.current ?? 0)
  );

  const factors: RiskFactor[] = [
    {
      name: "Rainfall Intensity",
      value: rainfallValue,
      severity: getSeverity(rainfallValue),
    },
    {
      name: "Terrain Slope",
      value: slopeValue,
      severity: getSeverity(slopeValue),
    },
    {
      name: "Ground Deformation",
      value: deformationValue,
      severity: getSeverity(deformationValue),
    },
  ];

  useEffect(() => {
    if (!isInView || reducedMotion) return;

    if (titleRef.current) {
      anime({
        targets: titleRef.current,
        translateX: [-20, 0],
        opacity: [0, 1],
        duration: 500,
        easing: "easeOutExpo",
      });
    }

    if (barsRef.current) {
      const bars =
        barsRef.current.querySelectorAll(".factor-bar");

      anime({
        targets: bars,
        width: (el: HTMLElement) =>
          `${el.dataset.value ?? 0}%`,
        opacity: [0, 1],
        delay: anime.stagger(100, { start: 200 }),
        duration: 800,
        easing: "easeOutExpo",
      });

      const labels =
        barsRef.current.querySelectorAll(".factor-label");

      anime({
        targets: labels,
        translateX: [-15, 0],
        opacity: [0, 1],
        delay: anime.stagger(80, { start: 150 }),
        duration: 400,
        easing: "easeOutExpo",
      });

      const badges =
        barsRef.current.querySelectorAll(".factor-badge");

      anime({
        targets: badges,
        scale: [0.5, 1],
        opacity: [0, 1],
        delay: anime.stagger(80, { start: 300 }),
        duration: 350,
        easing: "easeOutBack",
      });
    }

    if (driverRef.current) {
      anime({
        targets: driverRef.current,
        translateY: [15, 0],
        opacity: [0, 1],
        delay: 600,
        duration: 500,
        easing: "easeOutExpo",
      });
    }
  }, [isInView, reducedMotion]);

  const riskLevel = String(data?.riskLevel ?? "LOW");

  const readableRiskLevel = riskLevel
    .toLowerCase()
    .replace("_", " ");

  return (
    <div ref={ref} className="glass rounded-xl p-6">
      {/* Header */}
      <div
        ref={titleRef}
        className="flex items-center gap-2 mb-5"
        style={{
          opacity: reducedMotion ? 1 : 0,
        }}
      >
        <Zap className="w-4 h-4 text-amber-400" />

        <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">
          Why is the risk {readableRiskLevel}?
        </h3>
      </div>

      {/* Risk Factors */}
      <div ref={barsRef} className="space-y-4">
        {factors.map((factor: RiskFactor, index: number) => {
          const color = severityColors[factor.severity];

          return (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span
                  className="text-sm text-gray-300 factor-label"
                  style={{
                    opacity: reducedMotion ? 1 : 0,
                  }}
                >
                  {factor.name}
                </span>

                <span
                  className="text-xs font-medium px-2 py-0.5 rounded factor-badge"
                  style={{
                    color,
                    backgroundColor: `${color}15`,
                    opacity: reducedMotion ? 1 : 0,
                  }}
                >
                  {factor.severity.replace("_", " ")}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="factor-bar h-full rounded-full"
                  data-value={factor.value}
                  style={{
                    width: reducedMotion
                      ? `${factor.value}%`
                      : "0%",
                    backgroundColor: color,
                    boxShadow: `0 0 8px ${color}40`,
                    opacity: reducedMotion ? 1 : 0,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Driver */}
      <div
        ref={driverRef}
        className="mt-5 p-3 rounded-lg bg-white/[0.03] border border-white/5"
        style={{
          opacity: reducedMotion ? 1 : 0,
        }}
      >
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />

          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Primary driver:
            </span>

            <p className="text-sm text-gray-300 mt-1">
              {data?.primaryDriver ??
                "Rainfall and terrain conditions are being analyzed."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}