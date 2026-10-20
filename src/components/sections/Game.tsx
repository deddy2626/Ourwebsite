"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cloud } from "@/components/art/Doodles";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useSound } from "@/context/SoundContext";
import { HER_NAME } from "@/data/content";
import { fx } from "@/lib/fx";

type Status = "idle" | "running" | "over";
type Kind = "heart" | "star" | "broken";

interface Item {
  kind: Kind;
  emoji: string;
  x: number;
  y: number;
  vy: number;
  size: number;
  rot: number;
  spin: number;
  wobble: number;
  phase: number;
}

const ROUND_MS = 30_000;
const HEARTS = ["💖", "💗", "💕", "💘", "💝", "🩷"];
const BEST_KEY = "heart-catcher-best";

const POINTS: Record<Kind, number> = { heart: 1, star: 5, broken: -3 };

function verdict(score: number): { title: string; text: string } {
  if (score >= 45) return { title: "Heart-catching legend!", text: `${HER_NAME}, you caught almost every heart. Which makes sense, you already have mine.` };
  if (score >= 28) return { title: "So many hearts!", text: "Quick hands, kind heart. I'm not surprised at all." };
  if (score >= 14) return { title: "Nicely done, cutie!", text: "Not bad at all. Want to go again and beat it?" };
  return { title: "Aww, warming up!", text: "Don't worry, you only need to catch my heart, and you did that ages ago. Try again?" };
}

function readBest(): number {
  try {
    return parseInt(localStorage.getItem(BEST_KEY) ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}

export function Game() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const itemsRef = useRef<Item[]>([]);
  const scoreRef = useRef(0);
  const statusRef = useRef<Status>("idle");
  const startRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef(0);

  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_MS / 1000);
  const [best, setBest] = useState(0);
  const [combo, setCombo] = useState<{ id: number; text: string; x: number; y: number } | null>(null);
  const { sfx } = useSound();
  const sfxRef = useRef(sfx);

  useEffect(() => {
    sfxRef.current = sfx;
  }, [sfx]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable on the client
    setBest(readBest());
  }, []);

  // Keep the canvas crisp at any size / pixel ratio
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = wrap.getBoundingClientRect();
      sizeRef.current = { w: width, h: height };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const finish = useCallback(() => {
    statusRef.current = "over";
    setStatus("over");
    itemsRef.current = [];
    const final = scoreRef.current;
    setBest((prev) => {
      if (final > prev) {
        try {
          localStorage.setItem(BEST_KEY, String(final));
        } catch {
          /* private mode */
        }
        return final;
      }
      return prev;
    });
    sfxRef.current("success");
    if (final >= 14) fx.confetti();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let last = performance.now();
    let spawnIn = 0;
    let lastSecond = -1;
    let cleared = true; // nothing drawn yet, so there is nothing to wipe while idle

    const spawn = (elapsed: number) => {
      const { w } = sizeRef.current;
      const roll = Math.random();
      const kind: Kind = roll < 0.12 ? "broken" : roll < 0.2 ? "star" : "heart";
      const size = kind === "star" ? 40 : 34 + Math.random() * 14;
      const speedUp = 1 + elapsed / ROUND_MS; // gets a bit faster over the round
      itemsRef.current.push({
        kind,
        emoji: kind === "star" ? "🌟" : kind === "broken" ? "💔" : HEARTS[Math.floor(Math.random() * HEARTS.length)],
        x: size / 2 + Math.random() * Math.max(1, w - size),
        y: -size,
        vy: (1.6 + Math.random() * 1.6) * speedUp * (kind === "star" ? 1.35 : 1),
        size,
        rot: (Math.random() - 0.5) * 0.6,
        spin: (Math.random() - 0.5) * 0.02,
        wobble: 6 + Math.random() * 16,
        phase: Math.random() * Math.PI * 2,
      });
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const step = dt / (1000 / 60);
      const { w, h } = sizeRef.current;

      // Idle between rounds: skip all drawing work, just keep the loop alive
      if (statusRef.current !== "running" && itemsRef.current.length === 0) {
        if (!cleared) {
          ctx.clearRect(0, 0, w, h);
          cleared = true;
        }
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      cleared = false;
      ctx.clearRect(0, 0, w, h);

      if (statusRef.current === "running") {
        const elapsed = now - startRef.current;
        const remaining = Math.max(0, Math.ceil((ROUND_MS - elapsed) / 1000));
        if (remaining !== lastSecond) {
          lastSecond = remaining;
          setTimeLeft(remaining);
        }
        if (elapsed >= ROUND_MS) {
          finish();
        } else {
          spawnIn -= dt;
          if (spawnIn <= 0) {
            spawn(elapsed);
            spawnIn = Math.max(260, 640 - elapsed / 70);
          }
        }
      }

      const items = itemsRef.current;
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += it.vy * step;
        it.phase += 0.03 * step;
        it.rot += it.spin * step;
        if (it.y - it.size > h) {
          items.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(it.x + Math.sin(it.phase) * it.wobble, it.y);
        ctx.rotate(it.rot);
        ctx.font = `${it.size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(it.emoji, 0, 0);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [finish]);

  const start = () => {
    itemsRef.current = [];
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(ROUND_MS / 1000);
    startRef.current = performance.now();
    statusRef.current = "running";
    setStatus("running");
    sfx("boop");
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (statusRef.current !== "running") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    // the item drawn last (on top) wins
    const items = itemsRef.current;
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      const cx = it.x + Math.sin(it.phase) * it.wobble;
      if (Math.hypot(px - cx, py - it.y) <= it.size * 0.8) {
        items.splice(i, 1);
        const gain = POINTS[it.kind];
        scoreRef.current = Math.max(0, scoreRef.current + gain);
        setScore(scoreRef.current);
        setCombo({ id: performance.now(), text: gain > 0 ? `+${gain}` : `${gain}`, x: px, y: py });
        if (it.kind === "broken") {
          sfx("boop");
          fx.burst(e.clientX, e.clientY, 5);
        } else {
          sfx(it.kind === "star" ? "sparkle" : "pop");
          fx.burst(e.clientX, e.clientY, it.kind === "star" ? 18 : 9);
        }
        return;
      }
    }
  };

  const result = verdict(score);

  return (
    <section id="play" className="relative z-10 px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Take a break"
          emoji="🎮"
          title="Catch the Hearts"
          subtitle="Tap the falling hearts before they hit the ground. Watch out for the broken ones!"
        />

        <Reveal preset="zoom">
          <div className="glass rounded-[2.5rem] p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between px-2 text-sm font-bold">
              <span className="rounded-full bg-primary/15 px-4 py-1.5 text-primary-deep">
                Score <span className="tabular-nums">{score}</span>
              </span>
              <span className="rounded-full bg-white/60 px-4 py-1.5 tabular-nums text-ink-soft dark:bg-white/10">
                ⏱ {timeLeft}s
              </span>
              <span className="rounded-full bg-butter/60 px-4 py-1.5 text-ink dark:text-[#2a1745]">
                Best <span className="tabular-nums">{best}</span>
              </span>
            </div>

            <div
              ref={wrapRef}
              className="relative h-[380px] touch-manipulation select-none overflow-hidden rounded-3xl bg-gradient-to-b from-sky-200 via-pink-100 to-pink-200 sm:h-[440px] dark:from-[#2b1450] dark:via-[#4a1d6a] dark:to-[#6e2a58]"
              data-no-burst
            >
              <Cloud className="animate-float-slow absolute left-[8%] top-[10%] h-12 w-20 text-white/70 dark:text-white/10" />
              <Cloud className="animate-float absolute right-[10%] top-[26%] h-10 w-16 text-white/60 dark:text-white/10" />

              <canvas
                ref={canvasRef}
                onPointerDown={onPointerDown}
                className="absolute inset-0 h-full w-full cursor-pointer"
                aria-label="Heart catching game area"
              />

              <AnimatePresence>
                {combo && status === "running" && (
                  <motion.span
                    key={combo.id}
                    className={`pointer-events-none absolute font-display text-2xl font-bold ${
                      combo.text.startsWith("-") ? "text-rose-600" : "text-primary-deep"
                    }`}
                    style={{ left: combo.x, top: combo.y }}
                    initial={{ opacity: 1, y: 0, scale: 0.6 }}
                    animate={{ opacity: 0, y: -50, scale: 1.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    onAnimationComplete={() => setCombo(null)}
                  >
                    {combo.text}
                  </motion.span>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {status !== "running" && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/55 px-6 text-center backdrop-blur-sm dark:bg-[#170a22]/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {status === "idle" ? (
                      <>
                        <p className="font-script text-4xl text-primary">Ready?</p>
                        <p className="max-w-xs text-sm font-medium text-ink-soft">
                          <span aria-hidden="true">💖</span> +1 &nbsp; <span aria-hidden="true">🌟</span> +5 &nbsp;{" "}
                          <span aria-hidden="true">💔</span> −3
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-script text-4xl text-primary">{result.title}</p>
                        <p className="font-display text-5xl font-bold tabular-nums text-ink">{score}</p>
                        <p className="max-w-xs text-sm font-medium text-ink-soft">{result.text}</p>
                      </>
                    )}
                    <motion.button
                      type="button"
                      onClick={start}
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.93 }}
                      className="mt-1 cursor-pointer rounded-full bg-primary px-8 py-3 font-bold text-white shadow-lg shadow-primary/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                      {status === "idle" ? "Start!" : "Play again"}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
