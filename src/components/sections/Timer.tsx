"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeartIcon } from "@/components/art/Doodles";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HER_NAME, START_DATE } from "@/data/content";
import { formatYMD, parseYMD, togetherSince } from "@/lib/dates";

const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (n: number) => n.toLocaleString("en-US");

/** A flip-clock style number that rolls over whenever it changes. */
function Flip({ value, label, size = "lg" }: { value: number | null; label: string; size?: "lg" | "md" }) {
  const text = value === null ? "--" : pad(value);
  const big = size === "lg";
  return (
    <div className="flex flex-col items-center">
      <div
        className={`glass relative flex items-center justify-center overflow-hidden rounded-3xl ${
          big ? "h-24 w-[5.25rem] sm:h-36 sm:w-32" : "h-20 w-[4.5rem] sm:h-24 sm:w-24"
        }`}
        style={{ perspective: 400 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ rotateX: -90, y: -20, opacity: 0 }}
            animate={{ rotateX: 0, y: 0, opacity: 1 }}
            exit={{ rotateX: 90, y: 20, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`font-display font-bold tabular-nums text-primary ${
              big ? "text-5xl sm:text-7xl" : "text-4xl sm:text-5xl"
            }`}
          >
            {text}
          </motion.span>
        </AnimatePresence>
        {/* the little hinge line of a flip clock */}
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-primary/20" />
        <span className="pointer-events-none absolute -left-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-primary/25" />
        <span className="pointer-events-none absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-primary/25" />
      </div>
      <span className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">{label}</span>
    </div>
  );
}

function Ring({ progress, children }: { progress: number; children: React.ReactNode }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-28 w-28">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-primary/15" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - progress) }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeOut", delay: 0.2 }}
        />
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffb3d1" />
            <stop offset="100%" stopColor="#ff5c9d" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

export function Timer() {
  const start = useMemo(() => parseYMD(START_DATE), []);
  const [now, setNow] = useState<Date | null>(null);

  // Starts empty so server and client render the same HTML, then ticks every second
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const t = now ? togetherSince(start, now) : null;

  return (
    <section id="together" className="relative z-10 px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Our time"
          emoji="⏳"
          title="Together For"
          subtitle={`Every second since ${formatYMD(start)}, and I'd spend each one with you again, ${HER_NAME}.`}
        />

        <Reveal preset="zoom">
          <div className="glass relative rounded-[2.5rem] px-4 py-10 sm:px-10">
            <HeartIcon className="absolute -left-4 -top-5 h-12 w-12 -rotate-12 animate-heartbeat text-primary drop-shadow-lg" />
            <HeartIcon className="absolute -right-3 -bottom-4 h-9 w-9 rotate-12 animate-heartbeat text-blush drop-shadow-lg" />

            <div className="flex items-start justify-center gap-3 sm:gap-6">
              <Flip value={t ? t.years : null} label={t?.years === 1 ? "Year" : "Years"} />
              <Flip value={t ? t.months : null} label={t?.months === 1 ? "Month" : "Months"} />
              <Flip value={t ? t.days : null} label={t?.days === 1 ? "Day" : "Days"} />
            </div>

            <div className="mt-8 flex items-center justify-center gap-3 sm:gap-5">
              <Flip size="md" value={t ? t.hours : null} label="Hours" />
              <HeartIcon className="mb-6 h-5 w-5 animate-heartbeat text-primary" />
              <Flip size="md" value={t ? t.minutes : null} label="Minutes" />
              <HeartIcon className="mb-6 h-5 w-5 animate-heartbeat text-primary" style={{ animationDelay: "0.3s" }} />
              <Flip size="md" value={t ? t.seconds : null} label="Seconds" />
            </div>

            <p className="mt-9 text-center text-sm text-ink-soft sm:text-base">
              That&apos;s{" "}
              <strong className="font-bold text-primary-deep">{t ? fmt(t.totalDays) : "…"}</strong> days,{" "}
              <strong className="font-bold text-primary-deep">{t ? fmt(t.totalHours) : "…"}</strong> hours and{" "}
              <strong className="font-bold text-primary-deep">{t ? fmt(t.totalMinutes) : "…"}</strong> minutes of
              loving you <span aria-hidden="true">💗</span>
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Reveal preset="right">
            <div className="glass flex items-center gap-5 rounded-[2rem] p-5">
              <Ring progress={t ? t.monthProgress : 0}>
                <span className="font-display text-3xl font-bold leading-none text-primary">{t ? t.daysToMonthsary : "–"}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink-soft">days</span>
              </Ring>
              <div>
                <p className="font-script text-2xl text-primary">Next monthsary</p>
                <p className="mt-1 text-sm text-ink-soft">
                  {t && t.daysToMonthsary === 0 ? "It's today! Happy monthsary!" : "until we celebrate another month of us."}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal preset="left">
            <div className="glass flex items-center gap-5 rounded-[2rem] p-5">
              <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full bg-gradient-to-br from-primary to-pink-300 text-center text-white shadow-lg shadow-primary/30">
                <span className="font-display text-3xl font-bold leading-none">{t ? t.daysToAnniversary : "–"}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">days</span>
              </div>
              <div>
                <p className="font-script text-2xl text-primary">Anniversary countdown</p>
                <p className="mt-1 text-sm text-ink-soft">
                  {t && t.daysToAnniversary === 0
                    ? `Happy ${t.nextAnniversaryYear}-year anniversary!`
                    : t
                      ? `until year ${t.nextAnniversaryYear} of us.`
                      : ""}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
