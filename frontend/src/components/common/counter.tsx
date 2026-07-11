"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

interface CounterProps {
  value: number;
  suffix?: string;
  durationSeconds?: number;
  className?: string;
}

/** Animated number counter that starts when scrolled into view. */
export function Counter({ value, suffix = "", durationSeconds = 1.8, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    if (reduceMotion) {
      node.textContent = value.toLocaleString() + suffix;
      return;
    }
    const controls = animate(0, value, {
      duration: durationSeconds,
      ease: "easeOut",
      onUpdate: (latest) => {
        node.textContent = Math.round(latest).toLocaleString() + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, durationSeconds, reduceMotion]);

  return (
    <span ref={ref} className={className} aria-label={`${value.toLocaleString()}${suffix}`}>
      0{suffix}
    </span>
  );
}
