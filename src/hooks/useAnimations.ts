import { useEffect, useRef, useState, useCallback } from "react";

export function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

export function useAnimatedNumber(target: number, duration = 1500, trigger = true) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    const steps = 30;
    const stepDuration = duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(target * eased));

      if (step >= steps) {
        clearInterval(interval);
        setCurrent(target);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [target, duration, trigger]);

  return current;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return mobile;
}

export function useToast() {
  const [toast, setToast] = useState<{
    visible: boolean;
    title: string;
    message: string;
    detail?: string;
  }>({ visible: false, title: "", message: "" });

  const showToast = useCallback(
    (title: string, message: string, detail?: string) => {
      setToast({ visible: true, title, message, detail });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 5000);
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((t) => ({ ...t, visible: false }));
  }, []);

  return { toast, showToast, hideToast };
}
