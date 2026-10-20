"use client";

import React, { useEffect, useRef } from "react";
import { HEART_PATH } from "@/components/art/Doodles";

type Kind = "heart" | "petal" | "sparkle";

interface Particle {
  kind: Kind;
  x: number;
  y: number;
  size: number;
  speed: number; // px per 60fps frame
  sway: number;
  swaySpeed: number;
  phase: number;
  rotation: number;
  spin: number;
  alpha: number;
  rgb: string;
}

// Tuned in "60fps frames"; scaling by elapsed time keeps the same speed on 120/144Hz screens.
const FRAME_MS = 1000 / 60;
const MAX_FRAME_STEP = 3; // a backgrounded tab shouldn't teleport hearts on return

const HEART_COLORS = ["255, 92, 157", "255, 143, 184", "255, 122, 168", "255, 178, 212", "232, 85, 150"];
const PETAL_COLORS = ["255, 194, 218", "255, 160, 200", "255, 220, 233"];
const SPARKLE_COLORS = ["255, 214, 102", "255, 255, 255", "255, 236, 170"];

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function spawn(width: number, height: number, anywhere: boolean): Particle {
  const roll = Math.random();
  const kind: Kind = roll < 0.62 ? "heart" : roll < 0.84 ? "petal" : "sparkle";
  const size = kind === "heart" ? 10 + Math.random() * 26 : kind === "petal" ? 8 + Math.random() * 10 : 6 + Math.random() * 9;
  return {
    kind,
    x: Math.random() * width,
    y: anywhere ? Math.random() * height : -size * 2,
    size,
    // bigger = closer = faster and a little more solid
    speed: 0.35 + (size / 36) * 0.9 + Math.random() * 0.3,
    sway: 10 + Math.random() * 34,
    swaySpeed: 0.008 + Math.random() * 0.014,
    phase: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.03,
    alpha: 0.28 + (size / 36) * 0.5,
    rgb: kind === "heart" ? pick(HEART_COLORS) : kind === "petal" ? pick(PETAL_COLORS) : pick(SPARKLE_COLORS),
  };
}

/** Ambient layer: hearts, petals and sparkles drift down behind the page content. */
export function FallingHearts() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const heart = new Path2D(HEART_PATH);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let raf = 0;
    let last = performance.now();
    const particles: Particle[] = [];
    let lastScrollY = window.scrollY;
    let scrollBoost = 0; // fast scrolling makes everything swoosh down faster

    const targetCount = () => Math.max(16, Math.min(46, Math.round(width / 34)));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const want = targetCount();
      if (particles.length > want) particles.length = want;
      while (particles.length < want) particles.push(spawn(width, height, true));
    };

    const onScroll = () => {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      scrollBoost = Math.min(5, scrollBoost + Math.abs(delta) / 40);
    };

    const draw = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;

      if (p.kind === "heart") {
        const s = p.size / 24;
        ctx.scale(s, s);
        ctx.translate(-12, -12);
        ctx.fillStyle = `rgb(${p.rgb})`;
        ctx.fill(heart);
      } else if (p.kind === "petal") {
        ctx.fillStyle = `rgb(${p.rgb})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.38, p.size * 0.62, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // four-point sparkle that twinkles as it falls
        const tw = 0.55 + 0.45 * Math.sin(p.phase * 3 + p.y * 0.04);
        ctx.globalAlpha = p.alpha * tw;
        ctx.fillStyle = `rgb(${p.rgb})`;
        const r = p.size * 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.fill();
      }
      ctx.restore();
    };

    const tick = (now: number) => {
      const step = Math.min((now - last) / FRAME_MS, MAX_FRAME_STEP);
      last = now;
      scrollBoost *= 0.94;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += p.swaySpeed * step;
        p.y += p.speed * (1 + scrollBoost) * step;
        p.x += Math.sin(p.phase) * p.sway * 0.012 * step;
        p.rotation += p.spin * step;
        if (p.y - p.size > height || p.x < -60 || p.x > width + 60) {
          particles[i] = spawn(width, height, false);
          continue;
        }
        draw(p);
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
    />
  );
}
