import React, { useRef, useCallback } from "react";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number; // max degrees, default 6
  enableSpotlight?: boolean;
  enableTilt?: boolean;
  isDragging?: boolean;
}

/**
 * 3️⃣ 3D Perspective Task-Card Tilt + 4️⃣ Cursor-Controlled Card Highlight
 *
 * Implements React Bits 3D perspective tilt with GSAP spring physics,
 * alongside a cursor spotlight that illuminates the card surface and border.
 *
 * Essential: Zeroes tilt immediately if isDragging is true or drag begins,
 * ensuring HTML5 Kanban drag-and-drop remains 100% native and responsive.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = "",
  maxTilt = 6,
  enableSpotlight = true,
  enableTilt = true,
  isDragging = false,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const borderLightRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || isDragging) return;
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Card center offsets (-0.5 to +0.5)
      const normX = (x / rect.width) - 0.5;
      const normY = (y / rect.height) - 0.5;

      // 3D Perspective Tilt calculations
      if (enableTilt) {
        const rotateX = -normY * maxTilt * 2;
        const rotateY = normX * maxTilt * 2;

        gsap.to(card, {
          rotateX,
          rotateY,
          transformPerspective: 1000,
          scale3d: [1.015, 1.015, 1.015],
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      // Cursor-controlled Spotlight positioning
      if (enableSpotlight && spotlightRef.current) {
        spotlightRef.current.style.setProperty("--spotlight-x", `${x}px`);
        spotlightRef.current.style.setProperty("--spotlight-y", `${y}px`);
      }

      if (enableSpotlight && borderLightRef.current) {
        borderLightRef.current.style.setProperty("--spotlight-x", `${x}px`);
        borderLightRef.current.style.setProperty("--spotlight-y", `${y}px`);
      }
    },
    [reducedMotion, isDragging, enableTilt, enableSpotlight, maxTilt]
  );

  const handleMouseEnter = useCallback(() => {
    if (reducedMotion || isDragging) return;

    if (spotlightRef.current) {
      gsap.to(spotlightRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
    }
    if (borderLightRef.current) {
      gsap.to(borderLightRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
    }
  }, [reducedMotion, isDragging]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    if (!reducedMotion) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale3d: [1, 1, 1],
        duration: 0.65,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    if (spotlightRef.current) {
      gsap.to(spotlightRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" });
    }
    if (borderLightRef.current) {
      gsap.to(borderLightRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" });
    }
  }, [reducedMotion]);

  // If dragged, reset tilt immediately
  React.useEffect(() => {
    if (isDragging && cardRef.current) {
      gsap.set(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        scale3d: [1, 1, 1],
      });
      if (spotlightRef.current) {
        gsap.set(spotlightRef.current, { opacity: 0 });
      }
      if (borderLightRef.current) {
        gsap.set(borderLightRef.current, { opacity: 0 });
      }
    }
  }, [isDragging]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative will-change-transform transform-gpu ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      {/* 4️⃣ Cursor Spotlight Surface Glow */}
      {enableSpotlight && !reducedMotion && (
        <div
          ref={spotlightRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0 transition-opacity duration-300 z-10 overflow-hidden"
          style={{
            background:
              "radial-gradient(280px circle at var(--spotlight-x, -999px) var(--spotlight-y, -999px), rgba(185, 104, 62, 0.12) 0%, rgba(45, 91, 107, 0.04) 50%, transparent 80%)",
          }}
        />
      )}

      {/* Cursor Dynamic Border Highlight */}
      {enableSpotlight && !reducedMotion && (
        <div
          ref={borderLightRef}
          aria-hidden="true"
          className="absolute -inset-[1px] pointer-events-none rounded-[inherit] opacity-0 transition-opacity duration-300 z-0"
          style={{
            background:
              "radial-gradient(200px circle at var(--spotlight-x, -999px) var(--spotlight-y, -999px), rgba(185, 104, 62, 0.45) 0%, rgba(45, 91, 107, 0.25) 50%, transparent 80%)",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            padding: "1px",
          }}
        />
      )}

      {/* Card Content */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
};
