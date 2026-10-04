import React, { useEffect, useRef, useState, useCallback } from "react";
import "./SidebarBackground.css";
import { useReducedMotion } from "../interactions/useReducedMotion";

interface SidebarBackgroundProps {
  /** Optional reference to the parent sidebar element to capture mouse tracking */
  containerRef?: React.RefObject<HTMLElement | null>;
}

interface ParticleConfig {
  id: number;
  left: string;
  top: string;
  size: number;
  color: string;
  duration: string;
  delay: string;
}

const PARTICLES: ParticleConfig[] = [
  {
    id: 1,
    left: "15%",
    top: "35%",
    size: 4,
    color: "rgba(185, 104, 62, 0.45)",
    duration: "11s",
    delay: "0s",
  },
  {
    id: 2,
    left: "75%",
    top: "60%",
    size: 5,
    color: "rgba(45, 91, 107, 0.40)",
    duration: "14s",
    delay: "3.5s",
  },
  {
    id: 3,
    left: "40%",
    top: "80%",
    size: 3.5,
    color: "rgba(183, 134, 45, 0.45)",
    duration: "12s",
    delay: "7s",
  },
  {
    id: 4,
    left: "82%",
    top: "22%",
    size: 4.5,
    color: "rgba(185, 104, 62, 0.35)",
    duration: "16s",
    delay: "1.8s",
  },
  {
    id: 5,
    left: "28%",
    top: "50%",
    size: 3,
    color: "rgba(255, 252, 246, 0.8)",
    duration: "13s",
    delay: "5.2s",
  },
];

export const SidebarBackground: React.FC<SidebarBackgroundProps> = ({ containerRef }) => {
  const reducedMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const rafId = useRef<number | null>(null);
  const internalRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const targetEl = containerRef?.current || internalRef.current;
      if (!targetEl) return;

      const rect = targetEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePos({ x, y });
      setIsHovered(true);
    });
  }, [containerRef]);

  const handlePointerLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setIsHovered(false);
  }, []);

  useEffect(() => {
    const targetEl = containerRef?.current;
    if (!targetEl || reducedMotion) return;

    targetEl.addEventListener("pointermove", handlePointerMove, { passive: true });
    targetEl.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      targetEl.removeEventListener("pointermove", handlePointerMove);
      targetEl.removeEventListener("pointerleave", handlePointerLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [containerRef, handlePointerMove, handlePointerLeave, reducedMotion]);

  return (
    <div
      ref={internalRef}
      className="sidebar-bg-container"
      aria-hidden="true"
    >
      {/* Underlying warm parchment ambient wash */}
      <div className="sidebar-bg-ambient-wash" />

      {/* Fluid Morphing Liquid Orbs */}
      <div className="sidebar-bg-orbs-layer">
        <div className="sb-orb-ocean" />
        <div className="sb-orb-copper" />
        <div className="sb-orb-amber" />
        <div className="sb-orb-light" />
      </div>

      {/* Dynamic Multi-color Flowing Mesh Stream */}
      <div className="sidebar-bg-mesh-stream" />

      {/* Floating Micro-Ember Particles (Disabled when reduced motion is preferred) */}
      {!reducedMotion && (
        <>
          {PARTICLES.map((p) => (
            <span
              key={p.id}
              className="sb-particle"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}

          {/* Diagonal Glass Sheen Sweep */}
          <div className="sidebar-bg-sheen" />
        </>
      )}

      {/* Interactive Cursor Spotlight Glow */}
      {!reducedMotion && (
        <div
          className="sidebar-bg-spotlight"
          style={{
            opacity: isHovered && mousePos ? 1 : 0,
            background: mousePos
              ? `radial-gradient(130px circle at ${mousePos.x}px ${mousePos.y}px, rgba(185, 104, 62, 0.20) 0%, rgba(45, 91, 107, 0.08) 45%, transparent 75%)`
              : "none",
          }}
        />
      )}

      {/* Paper Dot Texture Grid for Tactile KasBan Warmth */}
      <div className="sidebar-bg-texture" />

      {/* Vertical Glass Edge Glow */}
      <div className="sidebar-bg-edge-glow" />
    </div>
  );
};
