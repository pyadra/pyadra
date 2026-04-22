"use client";

import { useEffect, useRef } from "react";

/**
 * FilmGrain - Adds analog film grain texture overlay
 * Creates organic, cinematic feel without WebGL overhead
 */
export default function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const width = 400;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // Generate noise pattern
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;     // R
      data[i + 1] = noise; // G
      data[i + 2] = noise; // B
      data[i + 3] = 40;    // Alpha (more visible)
    }

    ctx.putImageData(imageData, 0, 0);

    // Animate grain by shifting pattern
    let frame = 0;
    const animate = () => {
      frame++;
      if (frame % 3 === 0) {
        // Regenerate noise every 3 frames for analog flicker
        for (let i = 0; i < data.length; i += 4) {
          const noise = Math.random() * 255;
          data[i] = noise;
          data[i + 1] = noise;
          data[i + 2] = noise;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.18] mix-blend-overlay animate-pulse">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          imageRendering: "pixelated",
          transform: "scale(1.1)",
        }}
      />
    </div>
  );
}
