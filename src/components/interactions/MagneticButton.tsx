import React, { useRef, useCallback } from "react";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";
import { useClickRipple, RippleContainer } from "./ClickRipple";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number; // 0.1 to 0.5
  maxDisplacement?: number; // max pixels in X and Y
  enableRipple?: boolean;
}

/**
 * 2️⃣ Magnetic Button (React Bits inspired)
 *
 * Attracts smoothly toward the cursor on hover with GSAP physics.
 * Springs back with an organic elastic release on mouse leave.
 * Displaces inner content with subtle parallax.
 * Strictly respects prefers-reduced-motion and preserves all button functionality.
 */
export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      children,
      className = "",
      strength = 0.28,
      maxDisplacement = 8,
      enableRipple = true,
      onClick,
      disabled,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLSpanElement>(null);
    const reducedMotion = useReducedMotion();
    const { ripples, triggerRipple, removeRipple } = useClickRipple();

    // Use forwardedRef or internalRef
    const setRef = useCallback(
      (node: HTMLButtonElement | null) => {
        (internalRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }
      },
      [forwardedRef]
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (reducedMotion || disabled) return;
        const btn = internalRef.current;
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // Clamp displacement for elegance and usability
        const moveX = Math.max(Math.min(deltaX * strength, maxDisplacement), -maxDisplacement);
        const moveY = Math.max(Math.min(deltaY * strength, maxDisplacement), -maxDisplacement);

        gsap.to(btn, {
          x: moveX,
          y: moveY,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (contentRef.current) {
          gsap.to(contentRef.current, {
            x: moveX * 0.45,
            y: moveY * 0.45,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      },
      [reducedMotion, disabled, strength, maxDisplacement]
    );

    const handleMouseLeave = useCallback(() => {
      if (reducedMotion) return;
      const btn = internalRef.current;
      if (!btn) return;

      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });

      if (contentRef.current) {
        gsap.to(contentRef.current, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.4)",
          overwrite: "auto",
        });
      }
    }, [reducedMotion]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableRipple && !disabled) {
        triggerRipple(e);
      }
      onClick?.(e);
    };

    return (
      <button
        ref={setRef}
        className={`relative inline-flex items-center justify-center overflow-hidden will-change-transform ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {enableRipple && <RippleContainer ripples={ripples} onComplete={removeRipple} />}
        <span
          ref={contentRef}
          className="relative z-10 flex items-center justify-center gap-2 pointer-events-none w-full h-full will-change-transform"
        >
          {children}
        </span>
      </button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";
