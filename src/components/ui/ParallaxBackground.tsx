import React, { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useAnimations";

export default function ParallaxBackground() {
  const reducedMotion = useReducedMotion();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="parallax-bg">
      {/* Top glow */}
      <div
        className="parallax-layer"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      />
      {/* Middle glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% ${30 + scrollY * 0.02}%, rgba(59, 130, 246, 0.04) 0%, transparent 50%)`,
        }}
      />
      {/* Bottom glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 70% ${60 + scrollY * 0.015}%, rgba(16, 185, 129, 0.03) 0%, transparent 40%)`,
        }}
      />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
      />
    </div>
  );
}
