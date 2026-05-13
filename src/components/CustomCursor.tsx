"use client";

import { useEffect, useRef, useState } from "react";

// Custom cursor (dot + ring) — ported from `Portfolio.html` L37-80 (CSS) and L114-150 (JS).
// Mounted only on fine-pointer devices that don't request reduced motion (AC #1, #2, #3).
// Loaded via `next/dynamic({ ssr: false })` through `CursorMount.tsx`: no markup ends up in
// the prerendered HTML (NFR3, AC #6), `window` is guaranteed available in the lazy
// `useState` initializer below, and there is no hydration mismatch.
function computeEligibility() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(computeEligibility);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Eligibility: combined `(hover: hover) and (pointer: fine)` AND not reduced-motion.
  // Watched via `matchMedia('change')` so the cursor mounts/unmounts as the user
  // plugs in a mouse, toggles the OS reduced-motion preference, or DevTools-emulates
  // a touch device in-session (AC #3, UX-DR15).
  useEffect(() => {
    const hoverFineMQL = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionMQL = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onChange = () => setEnabled(computeEligibility());

    hoverFineMQL.addEventListener("change", onChange);
    reducedMotionMQL.addEventListener("change", onChange);

    return () => {
      hoverFineMQL.removeEventListener("change", onChange);
      reducedMotionMQL.removeEventListener("change", onChange);
    };
  }, []);

  // Tracking + `cursor-none` HTML class — only runs while eligible. Cleanup runs when
  // the component unmounts OR when `enabled` flips back to false (AC #3): the system
  // cursor is restored immediately, listeners are detached, the RAF loop stops.
  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const html = document.documentElement;
    html.classList.add("cursor-none");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;
    // Dot/ring stay invisible until the first real `mousemove` so they don't flash at
    // viewport center on initial mount or after an `enabled: false → true` cycle.
    let firstMove = true;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (firstMove) {
        // Snap the ring to the cursor on first frame — avoids a visible lerp from
        // the viewport center toward the user's actual pointer position.
        rx = x;
        ry = y;
        firstMove = false;
        dot.classList.add("cursor-dot--visible");
        ring.classList.add("cursor-ring--visible");
      }
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    };

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    // Delegated hover detection: any `<a>`, `<button>`, or `[data-cursor="hover"]`
    // ancestor of the event target toggles the hover state on dot+ring. The
    // `relatedTarget` ancestry guard suppresses spurious toggles when the cursor
    // crosses between descendants of the same interactive ancestor (e.g. moving
    // between the `<span>` and the text node inside `<a><span>$ </span>cd ./about</a>`).
    const onOver = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const target = e.target.closest("a, button, [data-cursor='hover']");
      if (!target) return;
      if (e.relatedTarget instanceof Node && target.contains(e.relatedTarget)) return;
      dot.classList.add("cursor-dot--hover");
      ring.classList.add("cursor-ring--hover");
    };
    const onOut = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const target = e.target.closest("a, button, [data-cursor='hover']");
      if (!target) return;
      if (e.relatedTarget instanceof Node && target.contains(e.relatedTarget)) return;
      dot.classList.remove("cursor-dot--hover");
      ring.classList.remove("cursor-ring--hover");
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
      html.classList.remove("cursor-none");
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
    </>
  );
}
