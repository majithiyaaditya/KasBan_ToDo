import React from "react";
import "./AuthPageBackground.css";
import { useReducedMotion } from "../interactions/useReducedMotion";

interface SparkleConfig {
  id: number;
  left: string;
  top: string;
  size: number;
  color: string;
  duration: string;
  delay: string;
}

const AUTH_SPARKLES: SparkleConfig[] = [
  { id: 1, left: "12%", top: "40%", size: 5, color: "rgba(185, 104, 62, 0.45)", duration: "14s", delay: "0s" },
  { id: 2, left: "85%", top: "30%", size: 6, color: "rgba(23, 59, 74, 0.40)", duration: "16s", delay: "3s" },
  { id: 3, left: "25%", top: "75%", size: 4, color: "rgba(183, 134, 45, 0.45)", duration: "13s", delay: "6s" },
  { id: 4, left: "70%", top: "70%", size: 5.5, color: "rgba(185, 104, 62, 0.35)", duration: "18s", delay: "2s" },
  { id: 5, left: "48%", top: "20%", size: 4.5, color: "rgba(79, 125, 97, 0.40)", duration: "15s", delay: "5s" },
  { id: 6, left: "90%", top: "60%", size: 5, color: "rgba(183, 134, 45, 0.35)", duration: "17s", delay: "8s" },
  { id: 7, left: "8%", top: "85%", size: 4, color: "rgba(255, 252, 246, 0.75)", duration: "12s", delay: "4s" },
];

export const AuthPageBackground: React.FC = () => {
  const reducedMotion = useReducedMotion();

  return (
    <div className="auth-page-bg" aria-hidden="true">
      {/* Dynamic Animated Gradient Mesh Layer */}
      <div className="auth-page-mesh" />

      {/* Morphing Liquid Orbs (Ocean, Copper, Amber, Sage, Pearl) */}
      <div className="auth-page-orbs">
        <div className="auth-orb-ocean" />
        <div className="auth-orb-copper" />
        <div className="auth-orb-amber" />
        <div className="auth-orb-sage" />
        <div className="auth-orb-pearl" />
      </div>

      {/* Ambient Floating Sparkles & Light Sweep */}
      {!reducedMotion && (
        <>
          <div className="auth-page-sheen" />
          {AUTH_SPARKLES.map((s) => (
            <span
              key={s.id}
              className="auth-bg-sparkle"
              style={{
                left: s.left,
                top: s.top,
                width: `${s.size}px`,
                height: `${s.size}px`,
                backgroundColor: s.color,
                boxShadow: `0 0 ${s.size * 2.5}px ${s.color}`,
                animationDuration: s.duration,
                animationDelay: s.delay,
              }}
            />
          ))}
        </>
      )}

      {/* Signature Tactile Paper Dot Grid */}
      <div className="auth-page-texture" />
    </div>
  );
};
