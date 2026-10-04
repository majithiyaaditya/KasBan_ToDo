import React, { useEffect, useRef, useState, useCallback } from "react";
import "./AuthCardBackground.css";
import { useReducedMotion } from "../interactions/useReducedMotion";

interface AuthCardBackgroundProps {
  /** Reference to the form card element to capture cursor tracking */
  containerRef?: React.RefObject<HTMLElement | null>;
}

interface CardParticleConfig {
  id: number;
  left: string;
  top: string;
  size: number;
  color: string;
  duration: string;
  delay: string;
}

const CARD_PARTICLES: CardParticleConfig[] = [
  { id: 1, left: "20%", top: "45%", size: 4, color: "rgba(185, 104, 62, 0.45)", duration: "10s", delay: "0s" },
  { id: 2, left: "80%", top: "65%", size: 5, color: "rgba(45, 91, 107, 0.40)", duration: "13s", delay: "2.5s" },
  { id: 3, left: "45%", top: "82%", size: 3.5, color: "rgba(183, 134, 45, 0.45)", duration: "11s", delay: "5s" },
  { id: 4, left: "85%", top: "25%", size: 4.5, color: "rgba(185, 104, 62, 0.35)", duration: "15s", delay: "1.2s" },
];

export const AuthCardBackground: React.FC<AuthCardBackgroundProps> = ({ containerRef }) => {
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
      className="auth-card-bg-container"
      aria-hidden="true"
    >
      {/* Base warm frosted glass surface wash */}
      <div className="auth-card-bg-wash" />

      {/* Fluid Morphing Liquid Orbs */}
      <div className="auth-card-orbs-layer">
        <div className="card-orb-copper" />
        <div className="card-orb-ocean" />
        <div className="card-orb-amber" />
      </div>

      {/* Multi-Stop Flowing Gradient Mesh Stream */}
      <div className="auth-card-mesh-stream" />

      {/* Floating Micro-Ember Particles */}
      {!reducedMotion && (
        <>
          {CARD_PARTICLES.map((p) => (
            <span
              key={p.id}
              className="card-particle"
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
          <div className="auth-card-sheen" />
        </>
      )}

      {/* Interactive Cursor Spotlight Glow */}
      {!reducedMotion && (
        <div
          className="auth-card-spotlight"
          style={{
            opacity: isHovered && mousePos ? 1 : 0,
            background: mousePos
              ? `radial-gradient(140px circle at ${mousePos.x}px ${mousePos.y}px, rgba(185, 104, 62, 0.20) 0%, rgba(45, 91, 107, 0.08) 45%, transparent 75%)`
              : "none",
          }}
        />
      )}

      {/* Paper Dot Texture Grid */}
      <div className="auth-card-texture" />

      {/* Specular Top Border Glow */}
      <div className="auth-card-top-glow" />
    </div>
  );
};
