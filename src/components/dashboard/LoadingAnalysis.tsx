import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import { Check, Loader2 } from "lucide-react";
import { useReducedMotion } from "../../hooks/useAnimations";

interface LoadingAnalysisProps {
  onComplete: () => void;
}

const steps = [
  { label: "Loading terrain data", duration: 300 },
  { label: "Processing rainfall accumulation", duration: 350 },
  { label: "Checking ground deformation", duration: 400 },
  { label: "Comparing historical records", duration: 300 },
  { label: "Running risk model", duration: 450 },
];

export default function LoadingAnalysis({ onComplete }: LoadingAnalysisProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const runStep = (step: number) => {
      if (step >= steps.length) {
        setTimeout(onComplete, 200);
        return;
      }

      timeout = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, step]);
        setCurrentStep(step + 1);

        // Anime.js animation for completed step
        if (!reducedMotion && containerRef.current) {
          const stepEl = containerRef.current.querySelector(`[data-step="${step}"]`);
          if (stepEl) {
            anime({
              targets: stepEl,
              translateX: [10, 0],
              opacity: [0.5, 1],
              duration: 400,
              easing: "easeOutExpo",
            });
          }
        }

        runStep(step + 1);
      }, steps[step].duration);
    };

    runStep(0);
    return () => clearTimeout(timeout);
  }, [onComplete, reducedMotion]);

  // Entrance animation
  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    anime({
      targets: containerRef.current,
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 600,
      easing: "easeOutExpo",
    });
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="glass-strong rounded-xl p-8 max-w-md mx-auto" style={{ opacity: reducedMotion ? 1 : 0 }}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-3">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
        </div>
        <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">
          Analyzing Location
        </h3>
        <div className="mt-3 w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const isCompleted = completedSteps.includes(i);
          const isCurrent = currentStep === i && !isCompleted;

          return (
            <div
              key={i}
              data-step={i}
              className={`flex items-center gap-3 transition-all duration-300 ${
                isCompleted ? "opacity-100" : isCurrent ? "opacity-100" : "opacity-30"
              }`}
            >
              {isCompleted ? (
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-400" />
                </div>
              ) : isCurrent ? (
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-white/5" />
              )}
              <span className={`text-sm ${isCompleted ? "text-gray-300" : isCurrent ? "text-gray-200" : "text-gray-500"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
