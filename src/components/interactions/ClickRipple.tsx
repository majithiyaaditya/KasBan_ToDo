import React, { useState, useCallback, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";

interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * 5️⃣ Click Ripple System (React Bits inspired)
 *
 * Spawns an elegant, subtle expanding copper-tinted ripple
 * on mouse click, with zero interference with clicks.
 */
export const useClickRipple = () => {
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const reducedMotion = useReducedMotion();

  const triggerRipple = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reducedMotion) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Ripple diameter covers maximum distance from click to corner
      const size = Math.max(rect.width, rect.height) * 2;
      const newRipple: RippleItem = {
        id: Date.now() + Math.random(),
        x,
        y,
        size,
      };

      setRipples((prev) => [...prev.slice(-4), newRipple]);
    },
    [reducedMotion]
  );

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { ripples, triggerRipple, removeRipple };
};

interface RippleContainerProps {
  ripples: RippleItem[];
  onComplete: (id: number) => void;
  color?: string;
}

export const RippleContainer: React.FC<RippleContainerProps> = ({
  ripples,
  onComplete,
  color = "rgba(185, 104, 62, 0.20)",
}) => {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit] z-0"
      aria-hidden="true"
    >
      {ripples.map((ripple) => (
        <RippleSpan
          key={ripple.id}
          ripple={ripple}
          color={color}
          onDone={() => onComplete(ripple.id)}
        />
      ))}
    </div>
  );
};

interface RippleSpanProps {
  ripple: RippleItem;
  color: string;
  onDone: () => void;
}

const RippleSpan: React.FC<RippleSpanProps> = ({ ripple, color, onDone }) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      {
        scale: 0,
        opacity: 0.8,
      },
      {
        scale: 1,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
        onComplete: onDone,
      }
    );
  }, [onDone]);

  return (
    <span
      ref={spanRef}
      className="absolute rounded-full pointer-events-none will-change-transform"
      style={{
        left: ripple.x - ripple.size / 2,
        top: ripple.y - ripple.size / 2,
        width: ripple.size,
        height: ripple.size,
        backgroundColor: color,
      }}
    />
  );
};
