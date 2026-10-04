import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";

/**
 * 1️⃣ Mouse Cursor System & Ambient Glow
 *
 * Smooth mouse-following ambient copper/ocean glow.
 * Powered by GSAP quickTo interpolation for 60-120fps fluid tracking.
 * Strictly non-interactive (pointer-events: none), highly subtle,
 * using the Warm Paper + Deep Ocean + Copper palette.
 */
export const AmbientCursorGlow: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const glowRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) return;
    if (typeof window === "undefined") return;

    // Disable ambient glow on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const glowEl = glowRef.current;
    if (!glowEl) return;

    // GSAP quickTo setters for fluid, lag-free physics interpolation
    const setGlowX = gsap.quickTo(glowEl, "x", { duration: 0.75, ease: "power2.out" });
    const setGlowY = gsap.quickTo(glowEl, "y", { duration: 0.75, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        gsap.to(glowEl, { opacity: 1, duration: 0.4, overwrite: "auto" });
      }

      setGlowX(e.clientX);
      setGlowY(e.clientY);
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      gsap.to(glowEl, { opacity: 0, duration: 0.4, overwrite: "auto" });
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      gsap.to(glowEl, { opacity: 1, duration: 0.4, overwrite: "auto" });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 z-[1] will-change-transform hidden sm:block"
      style={{
        width: "560px",
        height: "560px",
        background:
          "radial-gradient(circle, rgba(185, 104, 62, 0.07) 0%, rgba(45, 91, 107, 0.035) 45%, transparent 70%)",
        filter: "blur(48px)",
      }}
    />
  );
};
