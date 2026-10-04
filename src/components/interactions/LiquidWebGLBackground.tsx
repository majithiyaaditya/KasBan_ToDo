import React, { useRef, useMemo, useEffect, useState, Component, type ErrorInfo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "./useReducedMotion";

// Error Boundary for WebGL fallback
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL Background fallback engaged:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// GLSL Shaders for Warm Paper + Deep Ocean + Copper fluid
const liquidVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const liquidFragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Curated Palette (Strictly Warm Paper, Deep Ocean, Slate, and Copper)
  const vec3 colorPaper   = vec3(0.961, 0.949, 0.918); // #F5F2EA
  const vec3 colorSurface = vec3(1.000, 0.988, 0.965); // #FFFCF6
  const vec3 colorOcean   = vec3(0.090, 0.231, 0.290); // #173B4A
  const vec3 colorSlate   = vec3(0.176, 0.357, 0.420); // #2D5B6B
  const vec3 colorCopper  = vec3(0.725, 0.408, 0.243); // #B9683E

  // Simplex-style smooth noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = (st - 0.5) * vec2(aspect, 1.0);

    // Mouse influence (subtle interactive ripple)
    vec2 mouseNorm = (uMouse - 0.5) * vec2(aspect, 1.0);
    float distMouse = length(p - mouseNorm);
    float mouseWave = sin(distMouse * 10.0 - uTime * 1.5) * exp(-distMouse * 3.5) * 0.04;

    // Multi-octave organic liquid distortion
    float t = uTime * 0.08;
    vec2 q = vec2(
      snoise(p * 1.2 + vec2(t * 0.6, t * 0.4)),
      snoise(p * 1.2 + vec2(t * 0.5, -t * 0.7))
    );

    vec2 r = vec2(
      snoise(p * 2.0 + q * 1.1 + mouseWave + vec2(1.7, 9.2) + 0.15 * t),
      snoise(p * 2.0 + q * 1.1 + mouseWave + vec2(8.3, 2.8) + 0.126 * t)
    );

    float f = snoise(p + r);

    // Base background is Warm Paper
    vec3 col = colorPaper;

    // Organic ocean slate fluid streams (very soft 0.06 - 0.09)
    float oceanWeight = smoothstep(-0.4, 0.7, q.x) * smoothstep(0.7, -0.4, r.y);
    col = mix(col, colorOcean, clamp(oceanWeight * 0.08, 0.0, 1.0));
    col = mix(col, colorSlate, clamp(smoothstep(0.1, 0.8, f) * 0.06, 0.0, 1.0));

    // Warm copper accents (subtle liquid veins, never overpowering)
    float copperWeight = smoothstep(0.2, 0.85, r.x) * smoothstep(-0.2, 0.6, q.y);
    col = mix(col, colorCopper, clamp(copperWeight * 0.09, 0.0, 1.0));

    // Soft lighter paper highlights
    float lightWeight = smoothstep(0.4, 0.9, f);
    col = mix(col, colorSurface, lightWeight * 0.25);

    gl_FragColor = vec4(col, 1.0);
  }
`;

interface FluidMeshProps {
  reducedMotion: boolean;
}

const FluidMesh: React.FC<FluidMeshProps> = ({ reducedMotion }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));
  const targetMouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: {
        value: new THREE.Vector2(
          typeof window !== "undefined" ? window.innerWidth : 1920,
          typeof window !== "undefined" ? window.innerHeight : 1080
        ),
      },
    }),
    []
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight
      );
    };

    const handleResize = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uResolution.value.set(
          window.innerWidth,
          window.innerHeight
        );
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useFrame((_, delta) => {
    if (materialRef.current) {
      if (!reducedMotion) {
        materialRef.current.uniforms.uTime.value += delta;
        // Smooth mouse lerping
        mouseRef.current.lerp(targetMouseRef.current, 0.04);
        materialRef.current.uniforms.uMouse.value.copy(mouseRef.current);
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={liquidVertexShader}
        fragmentShader={liquidFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

export const LiquidWebGLBackground: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const fallbackOrbs = (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div className="liquid-orb-ocean" />
      <div className="liquid-orb-copper" />
      <div className="liquid-orb-light" />
    </div>
  );

  return (
    <WebGLErrorBoundary fallback={fallbackOrbs}>
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
        aria-hidden="true"
      >
        <Canvas
          gl={{
            antialias: false,
            powerPreference: "low-power",
            alpha: false,
            stencil: false,
            depth: false,
          }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 1] }}
          className="w-full h-full"
        >
          <FluidMesh reducedMotion={reducedMotion} />
        </Canvas>

        {/* Soft paper grain overlay for textured warmth */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply"
          style={{
            backgroundImage: `radial-gradient(#18262B 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>
    </WebGLErrorBoundary>
  );
};
