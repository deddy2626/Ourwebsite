"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bear, Bunny } from "@/components/art/Characters";
import { HeartIcon, Twinkle } from "@/components/art/Doodles";
import { RisingHearts } from "@/components/intro/RisingHearts";
import { useSound } from "@/context/SoundContext";
import { HER_NAME, FROM } from "@/data/content";
import { fx } from "@/lib/fx";
import { Volume2, VolumeX } from "lucide-react";

interface EnvelopeIntroProps {
  onEnter: () => void;
}

type Phase = "closed" | "opening" | "letter";

const LETTER_TEXT = `I made you a tiny universe, just for us. Every heart, every sparkle and every little detail in here is for you. I hope it makes you smile as much as you make me smile.`;

function Typewriter({ text, onDone }: { text: string; onDone: () => void }) {
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (count >= text.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
      return;
    }
    const ch = text[count];
    const delay = ch === "." || ch === "," ? 220 : 26;
    const id = window.setTimeout(() => setCount((c) => c + 1), delay);
    return () => window.clearTimeout(id);
  }, [count, text, onDone]);

  const finished = count >= text.length;

  return (
    <span
      onClick={() => setCount(text.length)}
      className="cursor-default"
      aria-label={text}
    >
      <span aria-hidden="true">
        {text.slice(0, count)}
        {!finished && (
          <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-primary-deep" />
        )}
      </span>
    </span>
  );
}

export function EnvelopeIntro({ onEnter }: EnvelopeIntroProps) {
  const { setEnabled, sfx } = useSound();
  const [phase, setPhase] = useState<Phase>("closed");
  const [quiet, setQuiet] = useState(false);
  const [typed, setTyped] = useState(false);
  const sealRef = useRef<HTMLButtonElement | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const open = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    if (!quiet) setEnabled(true); // the tap is the user gesture browsers need for audio
    fx.burstFrom(sealRef.current, 16);
    later(() => sfx("open"), 140);
    later(() => fx.burstFrom(sealRef.current, 10), 900);
    later(() => {
      setPhase("letter");
      sfx("sparkle");
    }, 2100);
  };

  const handleTyped = useCallback(() => setTyped(true), []);

  const enter = () => {
    sfx("success");
    fx.confetti();
    onEnter();
  };

  return (
    <motion.div
      className="heart-wipe fixed inset-0 z-[110] flex flex-col items-center justify-center overflow-hidden px-5"
      style={{ background: "linear-gradient(160deg, var(--wash-a) 0%, var(--wash-b) 100%)" }}
      exit={{ opacity: 0, scale: 1.18, filter: "blur(10px)" }}
      transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
    >
      <RisingHearts />
      <Twinkle className="absolute left-[10%] top-[14%] h-5 w-5 text-butter" delay={0} />
      <Twinkle className="absolute right-[12%] top-[20%] h-4 w-4 text-primary/70" delay={0.9} />
      <Twinkle className="absolute bottom-[20%] left-[14%] h-4 w-4 text-primary/60" delay={1.6} />
      <Twinkle className="absolute bottom-[26%] right-[10%] h-5 w-5 text-butter" delay={0.4} />

      <button
        type="button"
        onClick={() => setQuiet((q) => !q)}
        aria-pressed={!quiet}
        className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-semibold text-ink-soft backdrop-blur transition hover:text-primary-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {quiet ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        {quiet ? "Sound off" : "Sound on"}
      </button>

      <button
        type="button"
        onClick={onEnter}
        className="absolute right-5 top-5 rounded-full border border-line bg-card px-4 py-1.5 text-xs font-semibold text-ink-soft backdrop-blur transition hover:text-primary-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Skip ›
      </button>

      <AnimatePresence mode="wait">
        {phase !== "letter" ? (
          <motion.div
            key="envelope"
            className="flex w-full flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 60 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.p
              className="mb-8 text-center font-script text-3xl text-primary sm:text-4xl"
              animate={phase === "closed" ? { rotate: [-2, 2, -2] } : { opacity: 0 }}
              transition={phase === "closed" ? { repeat: Infinity, duration: 4, ease: "easeInOut" } : { duration: 0.4 }}
            >
              You&apos;ve got mail
              <span className="ml-2 inline-block" aria-hidden="true">💌</span>
            </motion.p>

            {/* ------------------------------ The envelope ------------------------------ */}
            <motion.div
              className="relative aspect-[3/2] w-[min(88vw,420px)]"
              style={{ perspective: 900 }}
              animate={phase === "closed" ? { y: [0, -10, 0], rotate: [0, -1.2, 0] } : { y: 0, rotate: 0 }}
              transition={phase === "closed" ? { repeat: Infinity, duration: 3.6, ease: "easeInOut" } : { duration: 0.4 }}
            >
              {/* back of envelope */}
              <div className="absolute inset-0 rounded-2xl bg-[#ff8fb8] shadow-[0_28px_50px_-18px_rgba(199,31,102,0.55)]" />

              {/* the letter inside */}
              <motion.div
                className="absolute inset-x-[7%] top-[9%] z-10 flex h-[86%] flex-col items-center justify-center rounded-lg bg-white px-4 text-center shadow-md"
                animate={
                  phase === "opening"
                    ? { y: ["0%", "0%", "-64%"], rotate: [0, 0, -2], scale: [1, 1, 1.03] }
                    : { y: "0%", rotate: 0, scale: 1 }
                }
                transition={{ duration: 1.6, times: [0, 0.4, 1], ease: "easeInOut" }}
              >
                <p className="font-hand text-3xl leading-none text-primary-deep sm:text-4xl">For {HER_NAME}</p>
                <div className="mt-3 flex items-center gap-2 text-primary">
                  <span className="h-px w-8 bg-current opacity-50" />
                  <HeartIcon className="h-4 w-4" />
                  <span className="h-px w-8 bg-current opacity-50" />
                </div>
                <div className="mt-3 w-4/5 space-y-1.5" aria-hidden="true">
                  <div className="h-1.5 rounded-full bg-blush/70" />
                  <div className="h-1.5 w-4/5 rounded-full bg-blush/70" />
                </div>
              </motion.div>

              {/* front pocket */}
              <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-[#ffb3d1]" style={{ clipPath: "polygon(0 0, 54% 54%, 0 100%)" }} />
                <div className="absolute inset-0 bg-[#ffb3d1]" style={{ clipPath: "polygon(100% 0, 46% 54%, 100% 100%)" }} />
                <div className="absolute inset-0 bg-[#ff9ec4]" style={{ clipPath: "polygon(0 100%, 50% 46%, 100% 100%)" }} />
              </div>

              {/* flap */}
              <motion.div
                className="absolute inset-x-0 top-0 h-[56%] origin-top"
                style={{ transformStyle: "preserve-3d" }}
                animate={
                  phase === "closed"
                    ? { rotateX: 0, zIndex: 30 }
                    : { rotateX: 180, zIndex: 5 }
                }
                transition={{
                  rotateX: { duration: 0.8, ease: [0.45, 0, 0.2, 1] },
                  zIndex: { delay: 0.35, duration: 0 },
                }}
              >
                <div
                  className="absolute inset-0 bg-[#ff7aa8]"
                  style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", filter: "drop-shadow(0 4px 4px rgba(199,31,102,0.3))" }}
                />
              </motion.div>

              {/* wax seal */}
              <AnimatePresence>
                {phase === "closed" && (
                  <motion.button
                    ref={sealRef}
                    type="button"
                    onClick={open}
                    aria-label="Open the envelope"
                    className="absolute left-1/2 top-[50%] z-40 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-primary-deep text-white shadow-lg shadow-primary/50 ring-4 ring-white/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.14, 1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                    exit={{ scale: 2, opacity: 0, rotate: 40, transition: { duration: 0.35 } }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.88 }}
                    data-no-burst
                  >
                    <span className="absolute inset-1.5 rounded-full border border-dashed border-white/60" />
                    <HeartIcon className="relative h-8 w-8 text-white" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* hand pointing at the seal */}
              {phase === "closed" && (
                <motion.span
                  className="absolute left-1/2 top-[74%] z-40 ml-5 select-none text-3xl"
                  animate={{ y: [0, -10, 0], x: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  aria-hidden="true"
                >
                  👆
                </motion.span>
              )}
            </motion.div>

            <motion.p
              className="mt-10 text-center text-sm font-medium text-ink-soft"
              animate={{ opacity: phase === "closed" ? 1 : 0 }}
            >
              Tap the heart seal to open it
            </motion.p>
          </motion.div>
        ) : (
          /* ------------------------------ The letter ------------------------------ */
          <motion.div
            key="letter"
            className="relative w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.6, y: 80, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 16 }}
          >
            <div className="absolute -left-2 -top-16 w-20 -rotate-6 sm:-left-8 sm:w-24">
              <div className="animate-bob">
                <Bunny className="h-auto w-full drop-shadow-lg" />
              </div>
            </div>
            <div className="absolute -right-2 -top-16 w-20 rotate-6 sm:-right-8 sm:w-24">
              <div className="animate-bob" style={{ animationDelay: "0.5s" }}>
                <Bear className="h-auto w-full drop-shadow-lg" />
              </div>
            </div>

            <div className="relative rounded-[2rem] border-2 border-dashed border-primary/40 bg-white/90 p-3 shadow-2xl shadow-primary/25 dark:bg-[#2a1745]/90">
              <div className="rounded-[1.5rem] bg-gradient-to-b from-pink-50 to-white px-6 pb-7 pt-10 text-center dark:from-[#3a1d5e] dark:to-[#2a1745]">
                <span className="washi absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 rounded-sm bg-primary/40" aria-hidden="true" />
                <h2 className="font-script text-4xl text-primary sm:text-5xl">Hi {HER_NAME}!</h2>
                <p className="mx-auto mt-5 min-h-[9.5rem] max-w-md font-hand text-[1.7rem] leading-[1.15] text-ink sm:text-[1.9rem]">
                  <Typewriter text={LETTER_TEXT} onDone={handleTyped} />
                </p>
                <p
                  className="mt-3 font-script text-lg text-primary-deep transition-opacity duration-700"
                  style={{ opacity: typed ? 1 : 0 }}
                >
                  — {FROM} <span aria-hidden="true">💖</span>
                </p>

                <motion.button
                  type="button"
                  onClick={enter}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: typed ? 1 : 0.0, y: typed ? 0 : 14 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  style={{ pointerEvents: typed ? "auto" : "none" }}
                  tabIndex={typed ? 0 : -1}
                  data-no-burst
                >
                  Enter our world
                  <HeartIcon className="h-5 w-5 animate-heartbeat" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
