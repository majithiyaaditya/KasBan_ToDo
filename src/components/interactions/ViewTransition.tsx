import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";

interface ViewTransitionProps {
  viewKey: string;
  children: React.ReactNode;
}

/**
 * 6️⃣ GSAP View Mode Transition
 *
 * Smooth fade & soft glide when switching between Kanban Board,
 * List View, and Analytics. Respects prefers-reduced-motion.
 */
export const ViewTransition: React.FC<ViewTransitionProps> = ({ viewKey, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reducedMotion) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" }
    );
  }, [viewKey, reducedMotion]);

  return (
    <div ref={containerRef} key={viewKey} className="w-full will-change-transform">
      {children}
    </div>
  );
};
