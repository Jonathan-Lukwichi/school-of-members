"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ParallaxProps {
  children: ReactNode;
  /** Differential speed: negative drifts up faster, positive lags. ~ -0.15 to 0.15 */
  speed?: number;
  className?: string;
}

/**
 * Parallax — differential translateY on scroll (hero only, per v2.1 motion rules).
 * Opacity untouched; disabled under `prefers-reduced-motion`. Uses rAF + transform
 * for smoothness and never blocks layout.
 */
export function Parallax({ children, speed = -0.12, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      // distance of element center from viewport center
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${offset * speed}px)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
