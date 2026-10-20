"use client";

import React, { useEffect, useRef } from "react";
import { HEART_PATH } from "@/components/art/Doodles";
import { fx, type FxEvent } from "@/lib/fx";

type Shape = "heart" | "spark" | "confetti" | "streak";

interface Particle {
  shape: Shape;
  x: number;
  y: number;
  px: number; // previous position, for streaks
  py: number;
  vx: number;
  vy: number;
  gravity: number;
  drag: number;
  life: number; // ms remaining
  max: number;
  size: number;
  rot: number;
  spin: number;
  rgb: string;
  flutter: number;
}

const FRAME_MS = 1000 / 60;
const MAX_PARTICLES = 700;
const PINKS = ["255, 92, 157", "255, 143, 184", "255, 122, 168", "232, 85, 150", "255, 178, 212"];
const CONFETTI = ["255, 92, 157", "255, 201, 60", "205, 184, 255", "120, 220, 190", "255, 143, 184", "255, 255, 255"];
const GOLD = ["255, 214, 102", "255, 236, 170", "255, 255, 255"];

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

/**
 * Top particle layer: the sparkle trail behind the cursor, tap-to-burst hearts, confetti
 * cannons and fireworks. It only runs its animation loop while something is on screen.
 */
export function FxCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heart = new Path2D(HEART_PATH);
    const particles: Particle[] = [];
    const timeouts: number[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let raf = 0;
    let running = false;
    let last = 0;
    let lastTrail = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const add = (p: Partial<Particle> & Pick<Particle, "shape" | "x" | "y">) => {
      if (particles.length >= MAX_PARTICLES) return;
      const life = p.life ?? 1200;
      particles.push({
        px: p.x,
        py: p.y,
        vx: 0,
        vy: 0,
        gravity: 0.12,
        drag: 0.99,
        max: life,
        size: 14,
        rot: 0,
        spin: 0,
        rgb: pick(PINKS),
        flutter: 0,
        ...p,
        life,
      });
      start();
    };

    const burst = (x: number, y: number, count: number) => {
      const n = reduced ? Math.ceil(count / 3) : count;
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n + rand(-0.3, 0.3);
        const speed = rand(2.2, 6.2);
        const isHeart = i % 3 !== 0;
        add({
          shape: isHeart ? "heart" : "spark",
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.4,
          gravity: 0.1,
          size: isHeart ? rand(9, 20) : rand(4, 8),
          rot: rand(-0.6, 0.6),
          spin: rand(-0.08, 0.08),
          life: rand(700, 1300),
          rgb: isHeart ? pick(PINKS) : pick(GOLD),
        });
      }
    };

    const confetti = () => {
      const scale = reduced ? 0.3 : 1;
      // two cannons in the bottom corners
      for (const side of [0, 1]) {
        for (let i = 0; i < 70 * scale; i++) {
          const fromLeft = side === 0;
          const angle = rand(-1.35, -0.65);
          const speed = rand(9, 19);
          add({
            shape: i % 5 === 0 ? "heart" : "confetti",
            x: fromLeft ? -10 : width + 10,
            y: height + 10,
            vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
            vy: Math.sin(angle) * speed,
            gravity: 0.2,
            drag: 0.985,
            size: rand(7, 14),
            rot: rand(0, Math.PI * 2),
            spin: rand(-0.25, 0.25),
            life: rand(2600, 4200),
            rgb: pick(CONFETTI),
            flutter: rand(0.02, 0.07),
          });
        }
      }
      // plus a gentle shower from the top
      for (let i = 0; i < 60 * scale; i++) {
        add({
          shape: i % 4 === 0 ? "heart" : "confetti",
          x: rand(0, width),
          y: rand(-200, -10),
          vx: rand(-1, 1),
          vy: rand(1, 3),
          gravity: 0.05,
          drag: 0.995,
          size: rand(7, 13),
          rot: rand(0, Math.PI * 2),
          spin: rand(-0.15, 0.15),
          life: rand(3200, 5200),
          rgb: pick(CONFETTI),
          flutter: rand(0.03, 0.08),
        });
      }
    };

    const firework = (x: number, y: number) => {
      const rgb = pick(CONFETTI.slice(0, 5));
      const n = reduced ? 16 : 56;
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n;
        const speed = rand(3, 7.5);
        add({
          shape: "streak",
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.07,
          drag: 0.965,
          size: rand(1.6, 3),
          life: rand(900, 1500),
          rgb,
        });
      }
      add({ shape: "heart", x, y, vx: 0, vy: -0.5, gravity: 0, size: 30, life: 900, rgb: "255, 92, 157" });
    };

    const fireworks = () => {
      const shots = reduced ? 3 : 9;
      for (let i = 0; i < shots; i++) {
        timeouts.push(
          window.setTimeout(() => firework(rand(width * 0.12, width * 0.88), rand(height * 0.12, height * 0.5)), i * 340),
        );
      }
    };

    const onEvent = (e: FxEvent) => {
      if (e.type === "burst") burst(e.x, e.y, e.count ?? 12);
      else if (e.type === "confetti") confetti();
      else if (e.type === "fireworks") fireworks();
    };

    const drawParticle = (p: Particle) => {
      const t = Math.max(0, p.life / p.max);
      ctx.save();
      ctx.globalAlpha = Math.min(1, t * 1.6);
      if (p.shape === "streak") {
        ctx.strokeStyle = `rgb(${p.rgb})`;
        ctx.lineWidth = p.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      } else if (p.shape === "heart") {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        const s = (p.size / 24) * (0.6 + 0.4 * t);
        ctx.scale(s, s);
        ctx.translate(-12, -12);
        ctx.fillStyle = `rgb(${p.rgb})`;
        ctx.fill(heart);
      } else if (p.shape === "confetti") {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        // squash on one axis to fake the paper tumbling in 3D
        ctx.scale(1, Math.cos(p.rot * 2));
        ctx.fillStyle = `rgb(${p.rgb})`;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        // sparkle: a small four-point star
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        const r = p.size * (0.5 + 0.5 * t);
        ctx.fillStyle = `rgb(${p.rgb})`;
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
      const dt = Math.min(now - last, 50);
      last = now;
      const step = dt / FRAME_MS;
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0 || p.y > height + 60) {
          particles.splice(i, 1);
          continue;
        }
        p.px = p.x;
        p.py = p.y;
        p.vx *= Math.pow(p.drag, step);
        p.vy = p.vy * Math.pow(p.drag, step) + p.gravity * step;
        p.x += p.vx * step + (p.flutter ? Math.sin(now * 0.004 + p.rot * 5) * p.flutter * 30 * step : 0);
        p.y += p.vy * step;
        p.rot += p.spin * step;
        drawParticle(p);
      }

      if (particles.length) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
        ctx.clearRect(0, 0, width, height);
      }
    };

    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }

    const onPointerMove = (e: PointerEvent) => {
      if (reduced || e.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - lastTrail < 38) return;
      lastTrail = now;
      add({
        shape: Math.random() < 0.4 ? "heart" : "spark",
        x: e.clientX + rand(-4, 4),
        y: e.clientY + rand(-4, 4),
        vx: rand(-0.5, 0.5),
        vy: rand(0.2, 1),
        gravity: 0.02,
        size: rand(6, 12),
        rot: rand(-0.5, 0.5),
        spin: rand(-0.05, 0.05),
        life: rand(500, 900),
        rgb: Math.random() < 0.5 ? pick(PINKS) : pick(GOLD),
      });
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest("[data-no-burst]")) return;
      burst(e.clientX, e.clientY, 9);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    const unsubscribe = fx.subscribe(onEvent);

    return () => {
      cancelAnimationFrame(raf);
      timeouts.forEach((id) => window.clearTimeout(id));
      unsubscribe();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] h-full w-full"
    />
  );
}
