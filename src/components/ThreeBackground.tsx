"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeBackgroundProps {
  variant?: "creative" | "admin" | "emerald" | "rose";
  visible?: boolean;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColorPrimary;
  uniform vec3 uColorSecondary;
  uniform vec3 uColorDeep;
  uniform vec3 uColorAccent;

  // High-frequency film grain hash
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // Smooth 2D value noise for organic nebula clouds
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.02 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2(uv.x * aspect, uv.y);
    vec2 mouse = vec2(uMouse.x * aspect, uMouse.y);

    // Subtle magnifying optical distortion around the cursor in WebGL space
    vec2 toMouse = p - mouse;
    float dist = length(toMouse);
    float lensRadius = 0.16;
    if (dist < lensRadius) {
      float factor = smoothstep(lensRadius, 0.0, dist);
      p -= toMouse * (0.18 * factor);
    }

    float t = uTime * 0.14;

    // Large atmospheric spotlight gradients matching the Veronica PW reference
    vec2 blob1Center = vec2(0.28 * aspect + sin(t) * 0.06, 0.62 + cos(t * 0.8) * 0.05);
    vec2 blob2Center = vec2(0.76 * aspect + cos(t * 0.7) * 0.07, 0.25 + sin(t * 0.9) * 0.05);
    vec2 darkCore = vec2(0.60 * aspect + sin(t * 0.5) * 0.05, 0.65 + cos(t * 0.6) * 0.04);

    float n = fbm(p * 1.85 + vec2(t * 0.3, -t * 0.2));

    float d1 = length(p - blob1Center) - n * 0.18;
    float d2 = length(p - blob2Center) - n * 0.15;
    float dDark = length(p - darkCore);

    float glow1 = exp(-d1 * d1 * 2.6);
    float glow2 = exp(-d2 * d2 * 3.1);
    float shadow = exp(-dDark * dDark * 3.8);

    // Base deep midnight canvas
    vec3 col = uColorDeep;
    col = mix(col, uColorPrimary, clamp(glow1 * 1.15, 0.0, 1.0));
    col = mix(col, uColorSecondary, clamp(glow2 * 0.95, 0.0, 1.0));
    col = mix(col, uColorDeep * 0.35, clamp(shadow * 0.85, 0.0, 1.0));

    // Subtle warm/accent rim near cursor lens
    float cursorGlow = exp(-dist * dist * 18.0);
    col += uColorAccent * cursorGlow * 0.12;

    // Vignette at corners
    float vig = smoothstep(1.35, 0.25, length((uv - 0.5) * vec2(1.15, 1.05)));
    col *= mix(0.55, 1.05, vig);

    // Studio film grain noise (key texture in the reference screenshot)
    float grain = (hash(gl_FragCoord.xy + fract(uTime * 37.0) * 100.0) - 0.5) * 0.095;
    col += vec3(grain);

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

const PALETTES = {
  creative: {
    deep: new THREE.Color("#040811"),
    primary: new THREE.Color("#1c416d"),
    secondary: new THREE.Color("#295385"),
    accent: new THREE.Color("#f59e0b"),
  },
  admin: {
    deep: new THREE.Color("#090514"),
    primary: new THREE.Color("#3b1d6e"),
    secondary: new THREE.Color("#1f3a68"),
    accent: new THREE.Color("#ec4899"),
  },
  emerald: {
    deep: new THREE.Color("#03120e"),
    primary: new THREE.Color("#114b3e"),
    secondary: new THREE.Color("#1d6858"),
    accent: new THREE.Color("#fbbf24"),
  },
  rose: {
    deep: new THREE.Color("#12050c"),
    primary: new THREE.Color("#521b38"),
    secondary: new THREE.Color("#2b2d5c"),
    accent: new THREE.Color("#fb7185"),
  },
};

export default function ThreeBackground({
  variant = "creative",
  visible = true,
}: ThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const uniformsRef = useRef<{
    uTime: { value: number };
    uResolution: { value: THREE.Vector2 };
    uMouse: { value: THREE.Vector2 };
    uColorPrimary: { value: THREE.Color };
    uColorSecondary: { value: THREE.Color };
    uColorDeep: { value: THREE.Color };
    uColorAccent: { value: THREE.Color };
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const palette = PALETTES[variant] || PALETTES.creative;
    const uniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uMouse: { value: new THREE.Vector2(0.85, 0.15) },
      uColorPrimary: { value: palette.primary.clone() },
      uColorSecondary: { value: palette.secondary.clone() },
      uColorDeep: { value: palette.deep.clone() },
      uColorAccent: { value: palette.accent.clone() },
    };
    uniformsRef.current = uniforms;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const targetMouse = new THREE.Vector2(0.85, 0.15);

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight
      );
    };

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);

    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (now: number) => {
      uniforms.uTime.value = (now - startTime) * 0.001;
      uniforms.uMouse.value.lerp(targetMouse, 0.08);
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!uniformsRef.current) return;
    const palette = PALETTES[variant] || PALETTES.creative;
    uniformsRef.current.uColorPrimary.value.copy(palette.primary);
    uniformsRef.current.uColorSecondary.value.copy(palette.secondary);
    uniformsRef.current.uColorDeep.value.copy(palette.deep);
    uniformsRef.current.uColorAccent.value.copy(palette.accent);
  }, [variant]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}
