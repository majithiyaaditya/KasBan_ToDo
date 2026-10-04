import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

/**
 * Animated KPI Numbers
 *
 * Smooth numeric roll/count-up using GSAP tweening.
 * Fluidly animates when tasks are created, completed, or moved.
 * Respects prefers-reduced-motion.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = "",
  prefix = "",
  duration = 0.6,
  className = "",
}) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const objRef = useRef<{ val: number }>({ val: value });
  const reducedMotion = useReducedMotion();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;

    if (reducedMotion) {
      el.textContent = `${prefix}${Math.round(value)}${suffix}`;
      objRef.current.val = value;
      return;
    }

    const startVal = isFirstRender.current ? 0 : objRef.current.val;
    isFirstRender.current = false;
    objRef.current.val = startVal;

    const tween = gsap.to(objRef.current, {
      val: value,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (el) {
          el.textContent = `${prefix}${Math.round(objRef.current.val)}${suffix}`;
        }
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, suffix, prefix, duration, reducedMotion]);

  return (
    <span ref={nodeRef} className={`tabular-nums ${className}`}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
};
