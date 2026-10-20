"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bear, Bunny } from "@/components/art/Characters";
import { HEART_PATH, Twinkle } from "@/components/art/Doodles";
import { RisingHearts } from "@/components/intro/RisingHearts";
import { LOADER_MESSAGES, PRELOAD_IMAGES } from "@/data/content";

interface LoaderProps {
  onDone: () => void;
  onSkip: () => void;
}

const MIN_DURATION = 3400; // never flash by, the loader is part of the experience
const REDUCED_DURATION = 700;
const GIVE_UP_AFTER = 7000; // a slow connection must not trap anyone on this screen

// Heart spans y 3 → 21.4 inside the 24 box; the water level slides between those
const WATER_BOTTOM = 21.6;
const WATER_TOP = 2.4;

export function Loader({ onDone, onSkip }: LoaderProps) {
  const [progress, setProgress] = useState(0); // 0..1
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minimum = reduced ? REDUCED_DURATION : MIN_DURATION;
    const started = performance.now();

    // Real work: wait for the fonts and the key pictures, not just a fake timer
    const total = PRELOAD_IMAGES.length + 1;
    let loaded = 0;
    const bump = () => {
      loaded += 1;
    };
    PRELOAD_IMAGES.forEach((src) => {
      const img = new Image();
      img.onload = bump;
      img.onerror = bump;
      img.src = src;
    });
    if (document.fonts?.ready) document.fonts.ready.then(bump, bump);
    else bump();

    let shown = 0;
    let raf = 0;
    let finishTimer = 0;
    let finished = false;

    const tick = (now: number) => {
      const elapsed = now - started;
      const t = Math.min(1, elapsed / minimum);
      const byTime = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOutQuad
      const byAssets = elapsed > GIVE_UP_AFTER ? 1 : loaded / total;
      const target = Math.min(byTime, byAssets);

      shown += (target - shown) * 0.1;
      if (target >= 1 && shown > 0.995) shown = 1;
      setProgress(shown);

      if (shown >= 1 && !finished) {
        finished = true;
        finishTimer = window.setTimeout(() => doneRef.current(), reduced ? 200 : 650);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(finishTimer);
    };
  }, []);

  const percent = Math.round(progress * 100);
  const message = LOADER_MESSAGES[Math.min(LOADER_MESSAGES.length - 1, Math.floor(progress * LOADER_MESSAGES.length))];
  const level = WATER_BOTTOM - (WATER_BOTTOM - WATER_TOP) * progress;
  const lean = (1 - progress) * 34; // the two little friends scoot closer as it loads

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: "linear-gradient(165deg, var(--bg) 0%, var(--bg-soft) 100%)" }}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${percent} percent`}
    >
      <RisingHearts />
      <Twinkle className="absolute left-[12%] top-[16%] h-5 w-5 text-butter" delay={0.2} />
      <Twinkle className="absolute right-[14%] top-[22%] h-4 w-4 text-primary/70" delay={1.1} />
      <Twinkle className="absolute bottom-[24%] left-[18%] h-4 w-4 text-primary/60" delay={0.7} />
      <Twinkle className="absolute bottom-[18%] right-[16%] h-5 w-5 text-butter" delay={1.5} />

      <button
        type="button"
        onClick={onSkip}
        className="absolute right-5 top-5 rounded-full border border-line bg-card px-4 py-1.5 text-xs font-semibold text-ink-soft backdrop-blur transition hover:text-primary-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Skip ›
      </button>

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="mb-6 font-script text-3xl text-primary sm:text-4xl"
      >
        Just for you
      </motion.p>

      {/* Heart that fills up with love, held by our two little friends */}
      <div className="relative flex w-full max-w-md items-end justify-center">
        <div
          className="w-[22%] shrink-0 transition-transform duration-150"
          style={{ transform: `translateX(${-lean}px)` }}
        >
          <div className="animate-bob">
            <Bear className="h-auto w-full drop-shadow-lg" waving={false} />
          </div>
        </div>

        <div className="relative mx-1 w-[46%] max-w-[210px] animate-heartbeat">
          <svg viewBox="0 0 24 24" className="h-auto w-full overflow-visible drop-shadow-[0_14px_20px_rgba(255,92,157,0.35)]">
            <defs>
              <clipPath id="loader-heart">
                <path d={HEART_PATH} />
              </clipPath>
            </defs>
            <path d={HEART_PATH} fill="rgba(255,255,255,0.75)" />
            <g clipPath="url(#loader-heart)">
              <g style={{ transform: `translateY(${level}px)` }}>
                <path
                  d="M-12 0 Q-9 -1.4 -6 0 T0 0 T6 0 T12 0 T18 0 T24 0 T30 0 T36 0 V30 H-12 Z"
                  fill="#ffb3d1"
                  style={{ animation: "liquid 2.6s linear infinite reverse" }}
                />
                <path
                  d="M-12 0.4 Q-9 -1.8 -6 0.4 T0 0.4 T6 0.4 T12 0.4 T18 0.4 T24 0.4 T30 0.4 T36 0.4 V30 H-12 Z"
                  fill="#ff5c9d"
                  style={{ animation: "liquid 1.7s linear infinite" }}
                />
              </g>
            </g>
            <path d={HEART_PATH} fill="none" stroke="#ff5c9d" strokeWidth="0.55" strokeLinejoin="round" />
          </svg>
        </div>

        <div
          className="w-[22%] shrink-0 transition-transform duration-150"
          style={{ transform: `translateX(${lean}px)` }}
        >
          <div className="animate-bob" style={{ animationDelay: "0.6s" }}>
            <Bunny className="h-auto w-full drop-shadow-lg" waving={false} />
          </div>
        </div>
      </div>

      <p className="mt-7 font-script text-5xl tabular-nums text-primary-deep sm:text-6xl" aria-hidden="true">
        {percent}%
      </p>

      <div className="mt-3 h-7 text-center" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-sm font-medium text-ink-soft sm:text-base"
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* little progress ribbon */}
      <div className="mt-6 h-2.5 w-full max-w-xs overflow-hidden rounded-full bg-primary/15 ring-1 ring-primary/20" aria-hidden="true">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-300 via-primary to-rose-400"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
