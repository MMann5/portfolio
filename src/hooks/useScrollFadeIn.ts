"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollFadeIn<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip animation: no IO support (SSR fallback) or user prefers reduced motion.
    const shouldSkip =
      typeof IntersectionObserver === "undefined" ||
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // Already in viewport at mount (anchor link to `#contact`, or section partially
    // visible on short mobile viewports): reveal immediately so the user never sees
    // an empty section. Matches the IO's `rootMargin: 0 0 -48px 0`.
    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight - 48 && rect.bottom > 0;

    if (shouldSkip || inViewport) {
      const id = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
