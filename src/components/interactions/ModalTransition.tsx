import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";

interface ModalTransitionProps {
  isOpen: boolean;
  onClose: () => void;
  children: (handleAnimatedClose: () => void) => React.ReactNode;
  maxWidthClass?: string;
}

/**
 * 6️⃣ GSAP Modal Transitions & Glass Reflections
 *
 * Provides silky-smooth GSAP entrance and exit physics for modals.
 * Features a subtle diagonal glass reflection sheen on entrance.
 * Preserves accessibility, respects prefers-reduced-motion, and
 * prevents unmount clipping with a controlled exit sequence.
 */
export const ModalTransition: React.FC<ModalTransitionProps> = ({
  isOpen,
  onClose,
  children,
  maxWidthClass = "max-w-lg",
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const backdropRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);
  const reducedMotion = useReducedMotion();

  // Handle open state change
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      isClosingRef.current = false;
    } else if (shouldRender && !isClosingRef.current) {
      // Direct close request from prop
      handleAnimatedClose();
    }
  }, [isOpen]);

  // Entrance animation when mounted
  useEffect(() => {
    if (!shouldRender || isClosingRef.current) return;

    const backdrop = backdropRef.current;
    const container = containerRef.current;
    const sheen = sheenRef.current;
    if (!backdrop || !container) return;

    if (reducedMotion) {
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(container, { opacity: 1, scale: 1, y: 0 });
      return;
    }

    // Set initial hidden states
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(container, { opacity: 0, scale: 0.94, y: 22 });

    const tl = gsap.timeline();

    tl.to(backdrop, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }).to(
      container,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
        ease: "power3.out",
      },
      "-=0.18"
    );

    // Subtle Glass Sheen sweep across the top surface
    if (sheen) {
      gsap.fromTo(
        sheen,
        { x: "-100%", opacity: 0 },
        {
          x: "200%",
          opacity: 0.45,
          duration: 1.1,
          ease: "power1.inOut",
          delay: 0.1,
        }
      );
    }

    return () => {
      tl.kill();
    };
  }, [shouldRender, reducedMotion]);

  // Controlled exit animation
  const handleAnimatedClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    const backdrop = backdropRef.current;
    const container = containerRef.current;

    if (reducedMotion || !backdrop || !container) {
      setShouldRender(false);
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setShouldRender(false);
        isClosingRef.current = false;
        onClose();
      },
    });

    tl.to(container, {
      opacity: 0,
      scale: 0.96,
      y: 14,
      duration: 0.22,
      ease: "power2.in",
    }).to(
      backdrop,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      },
      "-=0.1"
    );
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && shouldRender) {
        handleAnimatedClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleAnimatedClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18262B]/35 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={containerRef}
        className={`bg-[#FFFCF6]/95 backdrop-blur-2xl rounded-2xl w-full ${maxWidthClass} shadow-[0_24px_80px_rgba(23,59,74,0.22)] border border-[#D7D2C7] overflow-hidden my-8 glass-panel relative`}
      >
        {/* Glass Specular Reflection Sheen */}
        <div
          ref={sheenRef}
          aria-hidden="true"
          className="absolute inset-y-0 w-1/2 pointer-events-none z-20"
          style={{
            background:
              "linear-gradient(105deg, transparent 0%, rgba(255, 255, 255, 0.45) 45%, rgba(185, 104, 62, 0.08) 55%, transparent 70%)",
            transform: "skewX(-20deg)",
          }}
        />

        {children(handleAnimatedClose)}
      </div>
    </div>
  );
};
