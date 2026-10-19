"use client";

import React, { useEffect, useRef, useState } from "react";

interface GlassMagnifierCursorProps {
  enabled?: boolean;
  size?: number;
  zoomStrength?: number;
  blurAmount?: number;
}

export default function GlassMagnifierCursor({
  enabled = true,
  size = 132,
  zoomStrength = 34,
  blurAmount = 1.15,
}: GlassMagnifierCursorProps) {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [lensDataUrl, setLensDataUrl] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  // Generate an optical convex lens radial displacement map (R = X shift, G = Y shift)
  // so backdrop-filter magnifies/zooms whatever is underneath the glass circle!
  useEffect(() => {
    const res = 128;
    const canvas = document.createElement("canvas");
    canvas.width = res;
    canvas.height = res;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.createImageData(res, res);
    const data = imgData.data;

    for (let y = 0; y < res; y++) {
      for (let x = 0; x < res; x++) {
        // Normalized coordinates from -1 to 1
        const nx = (x / (res - 1)) * 2 - 1;
        const ny = (y / (res - 1)) * 2 - 1;
        const r = Math.sqrt(nx * nx + ny * ny);

        let dx = 0;
        let dy = 0;

        if (r < 1.0) {
          // Smooth convex magnification profile: pulls center pixels outward
          // with slight spherical aberration at the rim
          const profile = Math.sin(r * Math.PI * 0.5) * (1.0 - r * 0.35);
          dx = -nx * profile;
          dy = -ny * profile;
        }

        const idx = (y * res + x) * 4;
        data[idx] = Math.round(Math.max(0, Math.min(255, 128 + dx * 127))); // R channel -> X displacement
        data[idx + 1] = Math.round(Math.max(0, Math.min(255, 128 + dy * 127))); // G channel -> Y displacement
        data[idx + 2] = 128;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setLensDataUrl(canvas.toDataURL("image/png"));
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Default initial resting position in bottom-right like the reference image
    const target = {
      x: typeof window !== "undefined" ? window.innerWidth - 135 : 900,
      y: typeof window !== "undefined" ? window.innerHeight - 95 : 600,
    };
    const current = { x: target.x, y: target.y };

    const onMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    let rafId: number;
    const updatePosition = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;

      if (cursorRef.current) {
        const half = size / 2;
        cursorRef.current.style.transform = `translate3d(${current.x - half}px, ${current.y - half}px, 0) scale(${isPressed ? 0.93 : 1})`;
      }
      rafId = requestAnimationFrame(updatePosition);
    };

    rafId = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [enabled, size, isPressed, isVisible]);

  if (!enabled) return null;

  return (
    <>
      {/* SVG Filter for Optical Convex Lens Zoom + Soft Glass Blur */}
      <svg
        width="0"
        height="0"
        style={{ position: "fixed", pointerEvents: "none", opacity: 0 }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id="veronica-glass-lens"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            {lensDataUrl && (
              <feImage
                href={lensDataUrl}
                x="0"
                y="0"
                width={size}
                height={size}
                preserveAspectRatio="none"
                result="lensMap"
              />
            )}
            <feDisplacementMap
              in="SourceGraphic"
              in2="lensMap"
              scale={zoomStrength}
              xChannelSelector="R"
              yChannelSelector="G"
              result="magnified"
            />
            <feGaussianBlur
              in="magnified"
              stdDeviation={blurAmount}
              result="softBlurred"
            />
          </filter>
        </defs>
      </svg>

      {/* Circular Glass Magnifying Cursor */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.25s ease",
          backdropFilter: `url(#veronica-glass-lens) blur(${blurAmount}px) saturate(1.18) brightness(1.06)`,
          WebkitBackdropFilter: `url(#veronica-glass-lens) blur(${blurAmount}px) saturate(1.18) brightness(1.06)`,
          background:
            "radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.14) 0%, rgba(160, 195, 255, 0.06) 48%, rgba(10, 20, 40, 0.12) 85%, rgba(255, 255, 255, 0.22) 100%)",
          border: "1.5px solid rgba(255, 255, 255, 0.58)",
          boxShadow:
            "0 12px 38px rgba(0, 0, 0, 0.38), inset 0 0 18px rgba(255, 255, 255, 0.22), 0 0 12px rgba(255, 255, 255, 0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Subtle inner specular glass rim */}
        <div
          style={{
            position: "absolute",
            inset: "3px",
            borderRadius: "50%",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            pointerEvents: "none",
          }}
        />
        {/* Vertical soft light bar inside the glass circle matching the reference screenshot */}
        <div
          style={{
            width: "5px",
            height: `${Math.round(size * 0.42)}px`,
            borderRadius: "999px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.48) 50%, rgba(255,255,255,0.12) 100%)",
            filter: "blur(2.2px)",
             opacity: 0.78,
          }}
        />
      </div>
    </>
  );
}
