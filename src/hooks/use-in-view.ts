"use client";

import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.7) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isInView) return;

    const clampedThreshold = Math.min(Math.max(threshold, 0), 1);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= clampedThreshold) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: [clampedThreshold] },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [isInView, threshold]);

  return { ref, isInView };
}
