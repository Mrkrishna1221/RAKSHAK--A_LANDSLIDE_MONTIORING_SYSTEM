import React, { useEffect, useRef } from "react";
import anime from "animejs";
import { useInView, useReducedMotion } from "../../hooks/useAnimations";
import { RiskData } from "../../data/mockRiskData";
import { getRiskColor, getRiskLabel } from "../../services/riskApi";
import { AlertTriangle, TrendingUp, TrendingDown, Shield, Activity } from "lucide-react";

interface RiskScoreProps {
  data: RiskData;
}

export default function RiskScore({ data }: RiskScoreProps) {
  const { ref, isInView } = useInView(0.2);
  const reducedMotion = useReducedMotion();
  const numberRef = useRef<HTMLSpanElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const trendRef = useRef<HTMLDivElement>(null);
  const color = getRiskColor(data.riskLevel);
  const label = getRiskLabel(data.riskLevel);
  const circumference = 2 * Math.PI * 54;

  useEffect(() => {
    if (!isInView || reducedMotion) return;

    const obj = { value: 0 };

    // Animate the number
    if (numberRef.current) {
      anime({
        targets: obj,
        value: data.probability,
        round: 1,
        duration: 2000,
        easing: "easeOutExpo",
        update: () => {
          if (numberRef.current) {
            numberRef.current.textContent = `${obj.value}%`;
          }
        },
      });
    }

    // Animate the circle
    if (circleRef.current) {
      anime({
        targets: circleRef.current,
        strokeDashoffset: [circumference, circumference * (1 - data.probability / 100)],
        duration: 2000,
        easing: "easeOutExpo",
      });
    }

    // Animate card entrance
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: "easeOutExpo",
      });
    }

    // Animate trend
    if (trendRef.current) {
      anime({
        targets: trendRef.current,
        translateX: [-20, 0],
        opacity: [0, 1],
        delay: 800,
        duration: 600,
        easing: "easeOutExpo",
      });
    }
  }, [isInView, data.probability, reducedMotion, circumference]);

  return (
    <div ref={ref} className="glass rounded-xl p-6 relative overflow-hidden">
      <div ref={cardRef} style={{ opacity: reducedMotion ? 1 : 0 }}>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Landslide Risk
          </span>
        </div>

        <div className="flex items-center gap-8">
          {/* Circular indicator */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
              />
              <circle
                ref={circleRef}
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={reducedMotion ? circumference * (1 - data.probability / 100) : circumference}
                style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span ref={numberRef} className="text-3xl font-bold text-white">
                {reducedMotion ? `${data.probability}%` : "0%"}
              </span>
            </div>
          </div>

          {/* Risk info */}
          <div className="flex-1">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold mb-3"
              style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}
            >
              <Activity className="w-3.5 h-3.5" />
              {label}
            </div>

            <div ref={trendRef} className="flex items-center gap-2 text-sm" style={{ opacity: reducedMotion ? 1 : 0 }}>
              {data.riskChange24h > 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-medium">
                    ↑ {data.riskChange24h}% compared with yesterday
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">
                    ↓ {Math.abs(data.riskChange24h)}% compared with yesterday
                  </span>
                </>
              )}
            </div>

            {(data.riskLevel === "HIGH" || data.riskLevel === "VERY_HIGH") && (
              <div className="mt-3 flex items-start gap-2 text-xs text-gray-400 bg-white/5 rounded-md p-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span>Current conditions indicate elevated slope instability.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
