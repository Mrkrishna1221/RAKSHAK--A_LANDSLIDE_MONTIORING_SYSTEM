import React, { useEffect, useRef, useState } from "react";

interface VisibleCanvasProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps Three.js canvas to pause rendering when off-screen.
 * Uses IntersectionObserver for efficient visibility detection.
 */
export default function VisibleCanvas({ children, className = "" }: VisibleCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      data-visible={isVisible}
      style={{
        // Hint to Three.js via data attribute
        // The Canvas component can check this to pause rendering
      }}
    >
      {isVisible ? children : null}
    </div>
  );
}
