import { useEffect, useRef, useCallback } from "react";
import anime from "animejs";
import { useReducedMotion } from "./useAnimations";

/**
 * Anime.js scroll-triggered animation hook.
 * Triggers an anime.js animation when the element enters the viewport.
 */
export function useAnimeScroll(
  animationConfig: anime.AnimeParams,
  options: { threshold?: number; delay?: number; triggerOnce?: boolean } = {}
) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { threshold = 0.2, delay = 0, triggerOnce = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            anime({
              targets: el,
              ...animationConfig,
            });
          }, delay);

          if (triggerOnce) {
            observer.unobserve(el);
          }
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, threshold, delay, triggerOnce]);

  return ref;
}

/**
 * Stagger animation for children using anime.js
 */
export function useAnimeStagger(
  options: {
    threshold?: number;
    delay?: number;
    stagger?: number;
    translateY?: number;
    opacity?: [number, number];
    duration?: number;
    easing?: string;
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const {
    threshold = 0.15,
    delay = 0,
    stagger = 80,
    translateY = 40,
    opacity = [0, 1],
    duration = 800,
    easing = "easeOutExpo",
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            anime({
              targets: el.children,
              translateY: [translateY, 0],
              opacity: opacity,
              delay: anime.stagger(stagger),
              duration,
              easing,
            });
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, threshold, delay, stagger, translateY, opacity, duration, easing]);

  return ref;
}

/**
 * Anime.js number counter
 */
export function useAnimeCounter(target: number, duration = 2000) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) {
      if (el) el.textContent = String(target);
      return;
    }

    const obj = { value: 0 };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          anime({
            targets: obj,
            value: target,
            round: 1,
            duration,
            easing: "easeOutExpo",
            update: () => {
              el.textContent = String(obj.value);
            },
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, reducedMotion]);

  return ref;
}

/**
 * Anime.js progress bar animation
 */
export function useAnimeProgress(value: number, duration = 1200) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      el.style.width = `${value}%`;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          anime({
            targets: el,
            width: [`${0}%`, `${value}%`],
            duration,
            easing: "easeOutExpo",
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, reducedMotion]);

  return ref;
}

/**
 * Anime.js text split animation - characters animate in one by one
 */
export function useAnimeTextSplit() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    // Wrap each character in a span
    const text = el.textContent || "";
    el.innerHTML = "";
    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      el.appendChild(span);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          anime({
            targets: el.querySelectorAll("span"),
            opacity: [0, 1],
            translateY: [20, 0],
            rotateX: [90, 0],
            delay: anime.stagger(30),
            duration: 600,
            easing: "easeOutExpo",
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return ref;
}

/**
 * Anime.js line drawing animation for SVG paths
 */
export function useAnimeLineDraw() {
  const ref = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const length = el.getTotalLength();
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length}`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          anime({
            targets: el,
            strokeDashoffset: [length, 0],
            duration: 2000,
            easing: "easeInOutSine",
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return ref;
}

/**
 * Anime.js parallax scroll effect
 */
export function useAnimeParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, reducedMotion]);

  return ref;
}

/**
 * Anime.js magnetic hover effect
 */
export function useAnimeMagnetic(strength = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      anime({
        targets: el,
        translateX: x * strength,
        translateY: y * strength,
        duration: 400,
        easing: "easeOutExpo",
      });
    };

    const handleMouseLeave = () => {
      anime({
        targets: el,
        translateX: 0,
        translateY: 0,
        duration: 600,
        easing: "easeOutElastic(1, .5)",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return ref;
}
