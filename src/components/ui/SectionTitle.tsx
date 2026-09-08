import React, { useEffect, useRef } from "react";
import anime from "animejs";
import { useReducedMotion } from "../../hooks/useAnimations";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function SectionTitle({ title, subtitle, icon, className = "" }: SectionTitleProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const timeline = anime.timeline({
      easing: "easeOutExpo",
    });

    // Line animation
    if (lineRef.current) {
      timeline.add({
        targets: lineRef.current,
        scaleX: [0, 1],
        opacity: [0, 1],
        duration: 600,
      });
    }

    // Title characters
    if (titleRef.current) {
      const text = titleRef.current.textContent || "";
      titleRef.current.innerHTML = "";
      text.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        titleRef.current!.appendChild(span);
      });

      timeline.add(
        {
          targets: titleRef.current.querySelectorAll("span"),
          opacity: [0, 1],
          translateY: [15, 0],
          delay: anime.stagger(25),
          duration: 500,
        },
        "-=300"
      );
    }

    // Subtitle
    if (subtitleRef.current) {
      timeline.add(
        {
          targets: subtitleRef.current,
          translateX: [-20, 0],
          opacity: [0, 1],
          duration: 600,
        },
        "-=200"
      );
    }
  }, [title, subtitle, reducedMotion]);

  return (
    <div className={className}>
      <div ref={lineRef} className="h-px w-12 bg-gradient-to-r from-blue-500 to-transparent mb-3 origin-left" style={{ opacity: reducedMotion ? 1 : 0 }} />
      <div className="flex items-center gap-2">
        {icon}
        <h2
          ref={titleRef}
          className="text-xl md:text-2xl font-bold text-white tracking-tight"
          style={{ perspective: "600px" }}
        >
          {title}
        </h2>
      </div>
      {subtitle && (
        <p ref={subtitleRef} className="text-sm text-gray-400 mt-2" style={{ opacity: reducedMotion ? 1 : 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
