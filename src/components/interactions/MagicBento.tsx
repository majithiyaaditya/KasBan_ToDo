import React, { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "./useReducedMotion";
import "./MagicBento.css";

export const DEFAULT_PARTICLE_COUNT = 12;
export const DEFAULT_SPOTLIGHT_RADIUS = 300;
export const DEFAULT_GLOW_COLOR = "185, 104, 62"; // KasBan Copper accent

export interface MagicBentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string;
  isDragging?: boolean;
  maxTilt?: number;
  className?: string;
}

const createParticleElement = (x: number, y: number, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement("div");
  el.className = "magic-bento-particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 25;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

/**
 * Official React Bits MagicBento card interaction component.
 * Provides:
 * - Subtle cursor spotlight illumination
 * - Dynamic radial border glow
 * - Sparkling floating particle stars (particleCount=12)
 * - 3D perspective tilt following the cursor
 * - Subtle magnetic translation
 * - Interactive click ripple
 * - Zero conflict with HTML5 Kanban drag-and-drop & task menus
 */
export const MagicBentoCard: React.FC<MagicBentoCardProps> = ({
  children,
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  isDragging = false,
  maxTilt = 6,
  className = "",
  style,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);
  const tiltAnimationRef = useRef<gsap.core.Tween | null>(null);

  const reducedMotion = useReducedMotion();
  const shouldDisable = reducedMotion || isDragging;

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();
    tiltAnimationRef.current?.kill();

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.25,
        ease: "back.in(1.7)",
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        },
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current || shouldDisable) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 60,
          y: (Math.random() - 0.5) * 60,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });

        gsap.to(clone, {
          opacity: 0.25,
          duration: 1.4,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, index * 90);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles, shouldDisable]);

  // When dragging begins, reset all transforms immediately to guarantee smooth native drag
  useEffect(() => {
    if (isDragging && cardRef.current) {
      isHoveredRef.current = false;
      clearAllParticles();

      gsap.killTweensOf(cardRef.current);
      gsap.set(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        scale: 1,
      });

      if (spotlightRef.current) {
        gsap.set(spotlightRef.current, { opacity: 0 });
      }

      cardRef.current.style.setProperty("--glow-intensity", "0");
    }
  }, [isDragging, clearAllParticles]);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      if (shouldDisable) return;
      isHoveredRef.current = true;

      if (enableStars) {
        animateParticles();
      }

      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
      }

      element.style.setProperty("--glow-intensity", "1");
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      element.style.setProperty("--glow-intensity", "0");

      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" });
      }

      if (enableTilt) {
        tiltAnimationRef.current = gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      if (enableMagnetism) {
        magnetismAnimationRef.current = gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (shouldDisable) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Update border glow
      if (enableBorderGlow) {
        updateCardGlowProperties(element, e.clientX, e.clientY, 1, spotlightRadius);
      }

      // Cursor-controlled Spotlight positioning
      if (enableSpotlight && spotlightRef.current) {
        spotlightRef.current.style.setProperty("--spotlight-x", `${x}px`);
        spotlightRef.current.style.setProperty("--spotlight-y", `${y}px`);
      }

      // 3D Perspective Tilt following mouse
      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        tiltAnimationRef.current = gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.12,
          ease: "power2.out",
          transformPerspective: 1000,
          overwrite: "auto",
        });
      }

      // Subtle Magnetic pull
      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.035;
        const magnetY = (y - centerY) * 0.035;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect || shouldDisable) return;

      // Do NOT trigger ripple or interfere if clicking interactive action buttons/menus
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, [role="button"], a, input, [data-interactive="true"]')) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.className = "magic-bento-ripple";
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.35) 0%, rgba(${glowColor}, 0.12) 35%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 20;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }, [
    animateParticles,
    clearAllParticles,
    shouldDisable,
    enableStars,
    enableSpotlight,
    enableBorderGlow,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
    spotlightRadius,
    maxTilt,
  ]);

  const baseClassName = `magic-bento-card particle-container relative transform-gpu will-change-transform ${
    enableBorderGlow ? "magic-bento-card--border-glow" : ""
  } ${className}`;

  return (
    <div
      ref={cardRef}
      className={baseClassName}
      style={
        {
          ...style,
          "--glow-color": glowColor,
          transformStyle: "preserve-3d",
        } as React.CSSProperties
      }
      {...rest}
    >
      {/* MagicBento Spotlight Surface Illumination */}
      {enableSpotlight && !shouldDisable && (
        <div
          ref={spotlightRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0 transition-opacity duration-300 z-10 overflow-hidden"
          style={{
            background: `radial-gradient(${spotlightRadius}px circle at var(--spotlight-x, -999px) var(--spotlight-y, -999px), rgba(${glowColor}, 0.12) 0%, rgba(${glowColor}, 0.03) 45%, transparent 70%)`,
          }}
        />
      )}

      {/* Task Card Content */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
};

export default MagicBentoCard;
