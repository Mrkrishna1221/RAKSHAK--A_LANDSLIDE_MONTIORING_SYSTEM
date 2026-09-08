import React, { useRef } from "react";
import anime from "animejs";
import { useReducedMotion } from "../../hooks/useAnimations";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  strength?: number;
  disabled?: boolean;
}

export default function MagneticButton({
  children,
  onClick,
  className = "",
  strength = 0.3,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    anime({
      targets: ref.current,
      translateX: x * strength,
      translateY: y * strength,
      duration: 300,
      easing: "easeOutExpo",
    });
  };

  const handleMouseLeave = () => {
    if (reducedMotion || !ref.current) return;
    anime({
      targets: ref.current,
      translateX: 0,
      translateY: 0,
      duration: 600,
      easing: "easeOutElastic(1, .5)",
    });
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}
