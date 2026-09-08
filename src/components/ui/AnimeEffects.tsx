import React from "react";
import { useAnimeScroll, useAnimeStagger, useAnimeCounter, useAnimeProgress, useAnimeTextSplit } from "../../hooks/useAnimeScroll";

interface AnimeRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "scale";
  delay?: number;
  duration?: number;
  distance?: number;
}

export function AnimeReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 1000,
  distance = 50,
}: AnimeRevealProps) {
  const translateMap = {
    up: [distance, 0],
    down: [-distance, 0],
    left: [distance, 0],
    right: [-distance, 0],
    scale: [1, 1],
  };

  const ref = useAnimeScroll(
    {
      opacity: [0, 1],
      translateY: direction === "up" || direction === "down" ? translateMap[direction] : [0, 0],
      translateX: direction === "left" || direction === "right" ? translateMap[direction] : [0, 0],
      scale: direction === "scale" ? [0.8, 1] : [1, 1],
      duration,
      easing: "easeOutExpo",
    },
    { delay, threshold: 0.15 }
  );

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

interface AnimeStaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  distance?: number;
}

export function AnimeStagger({
  children,
  className = "",
  stagger = 100,
  delay = 0,
  distance = 40,
}: AnimeStaggerProps) {
  const ref = useAnimeStagger({ stagger, delay, translateY: distance });

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child) => (
        <div style={{ opacity: 0 }}>{child}</div>
      ))}
    </div>
  );
}

interface AnimeCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}

export function AnimeCounter({ value, suffix = "", prefix = "", className = "", duration = 2000 }: AnimeCounterProps) {
  const ref = useAnimeCounter(value, duration);
  return (
    <span className={className}>
      {prefix}
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

interface AnimeProgressBarProps {
  value: number;
  className?: string;
  color?: string;
  duration?: number;
}

export function AnimeProgressBar({ value, className = "", color = "#3b82f6", duration = 1200 }: AnimeProgressBarProps) {
  const ref = useAnimeProgress(value, duration);
  return (
    <div className={`w-full h-2 rounded-full bg-white/5 overflow-hidden ${className}`}>
      <div
        ref={ref}
        className="h-full rounded-full transition-none"
        style={{ width: "0%", backgroundColor: color }}
      />
    </div>
  );
}

interface AnimeTextSplitProps {
  text: string;
  className?: string;
}

export function AnimeTextSplit({ text, className = "" }: AnimeTextSplitProps) {
  const ref = useAnimeTextSplit();
  return (
    <div ref={ref} className={className} style={{ perspective: "600px" }}>
      {text}
    </div>
  );
}
