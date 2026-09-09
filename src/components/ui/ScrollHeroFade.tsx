import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useAnimations";

interface ScrollHeroFadeProps {
  children: React.ReactNode;
}

export default function ScrollHeroFade({ children }: ScrollHeroFadeProps) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const opacity = Math.max(0, 1 - scrollY / 600);
          const scale = Math.max(0.9, 1 - scrollY / 3000);
          const blur = Math.min(10, scrollY / 100);

          if (containerRef.current) {
            containerRef.current.style.opacity = String(opacity);
            containerRef.current.style.transform = `scale(${scale})`;
            containerRef.current.style.filter = `blur(${blur}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} style={{ willChange: "transform, opacity, filter" }}>
      {children}
    </div>
  );
}
