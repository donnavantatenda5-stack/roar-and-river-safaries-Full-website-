"use client";

import { useEffect, useRef } from "react";

/** Sandy grain colours, kept in the brand's warm palette. */
const COLORS = [
  "rgb(201,169,106)",
  "rgb(184,146,82)",
  "rgb(222,196,140)",
  "rgb(160,125,70)",
];

type Grain = {
  x: number;
  y: number;
  r: number;
  color: string;
  alpha: number;
  speed: number;
  fall: number;
  phase: number;
  amp: number;
  freq: number;
};

function createGrain(width: number, height: number): Grain {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r: 0.6 + Math.random() * 1.7,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 0.3 + Math.random() * 0.45,
    speed: 0.25 + Math.random() * 0.7,
    fall: 0.05 + Math.random() * 0.2,
    phase: Math.random() * Math.PI * 2,
    amp: 0.4 + Math.random() * 1.2,
    freq: 0.012 + Math.random() * 0.02,
  };
}

function particleCount(width: number, height: number): number {
  return Math.min(220, Math.round((width * height) / 7000));
}

/**
 * Fixed, full-screen grain layer sitting behind the page content.
 * Static (no animation) when the visitor prefers reduced motion.
 */
export default function SandCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let grains: Grain[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let gust = 0;
    let rafId = 0;

    const paint = () => {
      ctx.clearRect(0, 0, width, height);
      for (const g of grains) {
        ctx.globalAlpha = g.alpha;
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      grains = Array.from({ length: particleCount(width, height) }, () =>
        createGrain(width, height),
      );
      paint();
    };

    const tick = () => {
      frame += 1;
      gust *= 0.95;
      if (gust < 0.005) gust = 0;

      for (const g of grains) {
        g.x += g.speed * (1 + gust * 3);
        g.y += g.fall + Math.sin(frame * g.freq + g.phase) * g.amp * 0.25;

        if (g.x > width + g.r) {
          g.x = -g.r;
          g.y = Math.random() * height;
        } else if (g.x < -g.r) {
          g.x = width + g.r;
        }
        if (g.y > height + g.r) {
          g.y = -g.r;
          g.x = Math.random() * width;
        } else if (g.y < -g.r) {
          g.y = height + g.r;
        }
      }

      paint();
      rafId = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      gust = Math.min(1, gust + 0.35);
    };

    const syncMotion = () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      if (reducedMotion.matches) {
        paint();
        return;
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      rafId = window.requestAnimationFrame(tick);
    };

    resize();
    syncMotion();
    window.addEventListener("resize", resize);
    reducedMotion.addEventListener("change", syncMotion);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      reducedMotion.removeEventListener("change", syncMotion);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />;
}
