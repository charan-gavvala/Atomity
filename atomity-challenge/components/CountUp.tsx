"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export interface CountUpProps {
  to: number;
  duration?: number; // in seconds
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function CountUp({
  to,
  duration = 1.4,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    if (!isInView) return;

    let rAFId: number;
    const start = performance.now();

    const updateValue = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * to);

      if (progress < 1) {
        rAFId = requestAnimationFrame(updateValue);
      }
    };

    rAFId = requestAnimationFrame(updateValue);

    return () => {
      if (rAFId) {
        cancelAnimationFrame(rAFId);
      }
    };
  }, [isInView, to, duration]);

  const formatted = value
    .toFixed(decimals)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
