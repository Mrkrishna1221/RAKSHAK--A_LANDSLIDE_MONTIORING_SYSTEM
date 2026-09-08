import React, { useEffect, useRef } from "react";
import anime from "animejs";
import { useInView, useReducedMotion } from "../../hooks/useAnimations";
import { Cloud, Mountain, Satellite, Database, Brain, ShieldAlert, AlertTriangle } from "lucide-react";

export default function DataPipeline() {
  const { ref, isInView } = useInView(0.2);
  const reducedMotion = useReducedMotion();
  const stagesRef = useRef<HTMLDivElement>(null);

  const stages = [
    { icon: Cloud, label: "Rainfall Data", color: "#3b82f6" },
    { icon: Mountain, label: "Terrain Analysis", color: "#10b981" },
    { icon: Satellite, label: "Satellite Deformation", color: "#8b5cf6" },
    { icon: Database, label: "Historical Records", color: "#f97316" },
    { icon: Brain, label: "ML Risk Engine", color: "#ec4899" },
    { icon: ShieldAlert, label: "Risk Assessment", color: "#eab308" },
    { icon: AlertTriangle, label: "Early Warning", color: "#ef4444" },
  ];

  useEffect(() => {
    if (!isInView || reducedMotion || !stagesRef.current) return;

    const items = stagesRef.current.querySelectorAll(".pipeline-stage");
    const connectors = stagesRef.current.querySelectorAll(".pipeline-connector");

    // Animate stages
    anime({
      targets: items,
      translateX: [-40, 0],
      opacity: [0, 1],
      delay: anime.stagger(120),
      duration: 800,
      easing: "easeOutExpo",
    });

    // Animate connectors
    anime({
      targets: connectors,
      scaleY: [0, 1],
      opacity: [0, 1],
      delay: anime.stagger(120, { start: 60 }),
      duration: 400,
      easing: "easeOutExpo",
    });

    // Animate particle (data flow)
    const particle = stagesRef.current.querySelector(".data-particle");
    if (particle) {
      anime({
        targets: particle,
        translateY: [0, (stages.length - 1) * 56],
        opacity: [0, 1, 1, 0],
        delay: 1200,
        duration: 2500,
        easing: "easeInOutSine",
        loop: true,
        direction: "alternate",
        loopDelay: 1000,
      });
    }
  }, [isInView, reducedMotion, stages.length]);

  return (
    <div ref={ref} className="glass rounded-xl p-6 md:p-8">
      <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase mb-6 text-center">
        How RAKSHAK Works
      </h3>

      <div ref={stagesRef} className="flex flex-col items-center gap-2 relative">
        {/* Animated data particle */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400 data-particle z-10"
          style={{
            boxShadow: "0 0 10px #3b82f6, 0 0 20px #3b82f6",
            opacity: reducedMotion ? 0 : 0,
            top: "20px",
          }}
        />

        {stages.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <React.Fragment key={i}>
              <div
                className="pipeline-stage flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/5 w-full max-w-xs"
                style={{ opacity: reducedMotion ? 1 : 0 }}
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
                  className="pipeline-connector w-px h-6 origin-top"
                  style={{
                    backgroundColor: `${stage.color}40`,
                    opacity: reducedMotion ? 1 : 0,
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
