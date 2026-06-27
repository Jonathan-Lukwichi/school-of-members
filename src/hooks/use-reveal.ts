"use client";

import { useEffect, useRef } from "react";

/**
 * useReveal — translateY-only entrance reveal (opacity stays 1 for AA contrast).
 *
 * Attach the returned ref to an element that also has the `reveal-init` class.
 * When it scrolls into view, `is-revealed` is added and the element settles to
 * translateY(0). Honors `prefers-reduced-motion` (reveals immediately, no offset).
 *
 * @param once  reveal a single time (default) vs. re-trigger on every entry
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(once = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      el.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove("is-revealed");
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return ref;
}
