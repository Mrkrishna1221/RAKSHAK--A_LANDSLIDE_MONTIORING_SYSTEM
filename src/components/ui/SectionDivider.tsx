import React from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useAnimations";

interface SectionDividerProps {
  variant?: "line" | "gradient" | "dots" | "wave";
}

export default function SectionDivider({ variant = "line" }: SectionDividerProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className="h-px bg-white/5 my-8" />;
  }

  if (variant === "gradient") {
    return (
      <motion.div
        className="flex items-center justify-center py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </motion.div>
    );
  }

  if (variant === "dots") {
    return (
      <motion.div
        className="flex items-center justify-center gap-2 py-8"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
        <div className="w-1 h-1 rounded-full bg-blue-500/30" />
        <div className="w-0.5 h-0.5 rounded-full bg-blue-500/20" />
      </motion.div>
    );
  }

  if (variant === "wave") {
    return (
      <motion.div
        className="py-8 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <svg
          className="w-full h-8 text-white/5"
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,20 Q300,0 600,20 T1200,20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    );
  }

  // Default: line
  return (
    <motion.div
      className="flex items-center justify-center py-6"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </motion.div>
  );
}
