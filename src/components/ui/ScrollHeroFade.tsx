import React, { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useAnimations";

interface ScrollHeroFadeProps {
  children: React.ReactNode;
}

export default function ScrollHeroFade({ children }: ScrollHeroFadeProps) {
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

  if (reducedMotion) {
    return <>{children}</>;
  }

  const opacity = Math.max(0, 1 - scrollY / 600);
  const scale = Math.max(0.9, 1 - scrollY / 3000);
  const blur = Math.min(10, scrollY / 100);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        transition: "filter 0.1s linear",
      }}
    >
      {children}
    </div>
  );
}
