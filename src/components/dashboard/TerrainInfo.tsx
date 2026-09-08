import React, { useEffect, useRef } from "react";
import anime from "animejs";
import { useInView, useReducedMotion } from "../../hooks/useAnimations";
import { RiskData } from "../../data/mockRiskData";
import { Mountain, Compass, Layers, Waves, ArrowDownCircle } from "lucide-react";

interface TerrainInfoProps {
  data: RiskData;
}

export default function TerrainInfo({ data }: TerrainInfoProps) {
  const { ref, isInView } = useInView(0.2);
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInView || reducedMotion || !containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(".terrain-card");
    anime({
      targets: cards,
      translateY: [40, 0],
      opacity: [0, 1],
      scale: [0.9, 1],
      delay: anime.stagger(100),
      duration: 800,
      easing: "easeOutExpo",
    });
  }, [isInView, reducedMotion]);

  const cards = [
    {
      icon: ArrowDownCircle,
      label: "Elevation",
      value: `${data.terrain.elevation.toLocaleString()} m`,
      color: "#3b82f6",
    },
    {
      icon: Mountain,
      label: "Slope",
      value: `${data.terrain.slope}°`,
      color: "#10b981",
    },
    {
      icon: Compass,
      label: "Aspect",
      value: data.terrain.aspect,
      color: "#8b5cf6",
    },
    {
      icon: Layers,
      label: "Roughness",
      value: data.terrain.roughness.toFixed(2),
      color: "#f97316",
    },
    {
      icon: Waves,
      label: "Curvature",
      value: data.terrain.curvature.toFixed(2),
      color: "#ec4899",
    },
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <div ref={containerRef} className="contents">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="terrain-card glass rounded-lg p-4"
              style={{ opacity: reducedMotion ? 1 : 0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-3.5 h-3.5" style={{ color: card.color }} />
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  {card.label}
                </span>
              </div>
              <div className="text-lg font-bold text-white">{card.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
