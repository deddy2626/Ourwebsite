"use client";

import React, { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { PartyPopper, Sparkles } from "lucide-react";
import { Bear, Bunny } from "@/components/art/Characters";
import { Bow, HeartIcon, Medal, Twinkle } from "@/components/art/Doodles";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useSound } from "@/context/SoundContext";
import { FROM, HER_NAME, REASONS, START_DATE, STATS } from "@/data/content";
import { formatYMD, parseYMD } from "@/lib/dates";
import { fx } from "@/lib/fx";

/* ------------------------------ Stats & reasons ------------------------------ */

function Stats() {
  return (
    <div className="glass h-full rounded-[2rem] p-6 sm:p-8">
      <h3 className="text-center font-script text-3xl text-primary">{HER_NAME}&apos;s Official Stats</h3>
      <p className="mb-6 mt-1 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft">
        Scientifically measured
      </p>
      <ul className="space-y-5">
        {STATS.map((stat, i) => (
          <li key={stat.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm font-semibold">
              <span className="text-ink">
                <span className="mr-1.5" aria-hidden="true">{stat.emoji}</span>
                {stat.label}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-primary-deep">{stat.value}</span>
            </div>
            <div className="h-3.5 overflow-hidden rounded-full bg-primary/10 ring-1 ring-primary/15">
              <motion.div
                className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-pink-300 via-primary to-rose-400"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 1.3, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)] bg-[length:200%_100%]" />
              </motion.div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-center text-[11px] italic text-ink-soft">* results may vary, but never downward.</p>
    </div>
  );
}

function Reasons() {
  const [index, setIndex] = useState(0);
  const [pops, setPops] = useState(0);
  const { sfx } = useSound();

  const next = () => {
    sfx("flip");
    setIndex((i) => (i + 1) % REASONS.length);
    setPops((p) => p + 1);
  };

  return (
    <div className="glass flex h-full flex-col rounded-[2rem] p-6 sm:p-8">
      <h3 className="text-center font-script text-3xl text-primary">Why you&apos;re the best</h3>
      <p className="mb-5 mt-1 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft">
        Reason {index + 1} of {REASONS.length}
      </p>

      <div className="relative flex min-h-[10.5rem] flex-1 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 18, rotate: -4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1.5 : 1.5, scale: 1 }}
            exit={{ opacity: 0, y: -18, rotate: 4, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-full rounded-2xl border border-butter/70 bg-butter/45 px-6 py-8 text-center shadow-lg dark:bg-butter/20"
            aria-live="polite"
          >
            <span className="washi absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-3 rounded-sm bg-primary/35" aria-hidden="true" />
            <p className="font-hand text-[1.7rem] leading-[1.15] text-ink">{REASONS[index]}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex justify-center gap-1.5" aria-hidden="true">
        {REASONS.map((_, i) => (
          <HeartIcon key={i} className={`h-3 w-3 transition-all duration-300 ${i <= index ? "text-primary" : "text-primary/25"}`} />
        ))}
      </div>

      <button
        type="button"
        onClick={next}
        className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-primary/40 bg-white/60 py-3 font-bold text-primary-deep transition hover:border-primary hover:bg-primary/10 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:bg-white/5"
      >
        <motion.span
          key={pops}
          initial={pops === 0 ? false : { scale: 1.8, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
          className="inline-block"
          aria-hidden="true"
        >
          💌
        </motion.span>
        Tell me another reason
      </button>
    </div>
  );
}

/* ---------------------------- The big question ---------------------------- */

const NO_LINES = [
  "No",
  "Are you sure?",
  "Really? 🥺",
  "Think again!",
  "Pleeease?",
  "Can't catch me!",
  "Okay fine… 😤",
];

function ForeverQuestion() {
  const { sfx } = useSound();
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const [dodges, setDodges] = useState(0);
  const [pos, setPos] = useState({ left: 50, top: 40 }); // percentages inside the arena
  const [answered, setAnswered] = useState(false);

  const yes = () => {
    if (answered) return;
    setAnswered(true);
    sfx("success");
    fx.fireworks();
    fx.confetti();
  };

  const dodge = useCallback(() => {
    // pick somewhere that's clearly not where the button already is
    let left = pos.left;
    let top = pos.top;
    for (let i = 0; i < 8 && Math.hypot(left - pos.left, top - pos.top) < 30; i++) {
      left = 4 + Math.random() * 62;
      top = 4 + Math.random() * 60;
    }
    setPos({ left, top });
    setDodges((d) => d + 1);
    sfx("boop");
  }, [pos, sfx]);

  const surrendered = dodges >= NO_LINES.length - 1;

  return (
    <div className="glass relative mx-auto mt-20 max-w-2xl overflow-hidden rounded-[2.5rem] px-6 py-10 text-center sm:px-10">
      <AnimatePresence mode="wait">
        {!answered ? (
          <motion.div key="ask" exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="inline-block"
            >
              <HeartIcon className="h-12 w-12 text-primary drop-shadow-lg" />
            </motion.div>
            <h3 className="mt-3 font-script text-4xl leading-tight text-primary sm:text-5xl">One last question…</h3>
            <p className="mt-3 text-lg text-ink">
              Will you keep being mine, <span className="font-bold text-primary-deep">forever</span>?
            </p>

            <motion.button
              type="button"
              onClick={yes}
              animate={{ scale: Math.min(1.55, 1 + dodges * 0.09) }}
              whileHover={{ scale: Math.min(1.55, 1 + dodges * 0.09) + 0.08 }}
              whileTap={{ scale: 0.92 }}
              className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-9 py-4 text-lg font-bold text-white shadow-xl shadow-primary/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              data-no-burst
            >
              Yes, always <span aria-hidden="true">💖</span>
            </motion.button>

            {/* the "No" button that really doesn't want to be clicked */}
            <div ref={arenaRef} className="relative mx-auto mt-8 h-44 w-full max-w-md">
              <motion.button
                type="button"
                className="absolute cursor-pointer whitespace-nowrap rounded-full border-2 border-primary/40 bg-white/70 px-5 py-2 text-sm font-bold text-ink-soft shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:bg-white/10"
                animate={{ left: `${pos.left}%`, top: `${pos.top}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                onPointerEnter={surrendered ? undefined : dodge}
                onPointerDown={(e) => {
                  if (surrendered) return;
                  e.preventDefault();
                  dodge();
                }}
                onFocus={surrendered ? undefined : dodge}
                onClick={surrendered ? yes : undefined}
                data-no-burst
              >
                {NO_LINES[Math.min(dodges, NO_LINES.length - 1)]}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="yay"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 14 }}
            className="py-2"
          >
            <div className="mx-auto flex max-w-xs items-end justify-center">
              <motion.div
                className="w-[40%]"
                initial={{ x: -120, rotate: -12 }}
                animate={{ x: 10, rotate: 4 }}
                transition={{ type: "spring", stiffness: 80, damping: 10, delay: 0.2 }}
              >
                <div className="animate-bob">
                  <Bear className="h-auto w-full drop-shadow-xl" />
                </div>
              </motion.div>
              <motion.div
                className="w-[40%]"
                initial={{ x: 120, rotate: 12 }}
                animate={{ x: -10, rotate: -4 }}
                transition={{ type: "spring", stiffness: 80, damping: 10, delay: 0.2 }}
              >
                <div className="animate-bob" style={{ animationDelay: "0.5s" }}>
                  <Bunny className="h-auto w-full drop-shadow-xl" />
                </div>
              </motion.div>
            </div>
            <motion.div
              className="-mt-4 mb-2 flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <HeartIcon className="h-12 w-12 animate-heartbeat text-primary drop-shadow-lg" />
            </motion.div>
            <h3 className="font-script text-4xl text-primary sm:text-5xl">Forever starts now.</h3>
            <p className="mx-auto mt-3 max-w-sm text-base text-ink-soft">
              I knew you&apos;d say yes. I love you, {HER_NAME}. Today, tomorrow and every day after that.
            </p>
            <button
              type="button"
              onClick={() => {
                fx.fireworks();
                sfx("sparkle");
              }}
              className="mt-6 cursor-pointer rounded-full border-2 border-primary/40 bg-white/60 px-6 py-2.5 text-sm font-bold text-primary-deep transition hover:border-primary hover:bg-primary/10 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:bg-white/5"
              data-no-burst
            >
              More fireworks ✨
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------- Finale ---------------------------------- */

export function Finale() {
  const { sfx } = useSound();
  const medalControls = useAnimationControls();
  const [claimed, setClaimed] = useState(false);
  const claimRef = useRef<HTMLButtonElement | null>(null);

  const celebrate = useCallback(() => {
    setClaimed(true);
    sfx("success");
    fx.burstFrom(claimRef.current, 26);
    fx.confetti();
    medalControls.start({
      rotate: [0, -16, 16, -9, 9, 0],
      scale: [1, 1.25, 1],
      transition: { duration: 0.9, ease: "easeInOut" },
    });
  }, [medalControls, sfx]);

  const since = formatYMD(parseYMD(START_DATE));

  return (
    <section id="forever" className="relative z-10 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Official announcement"
          emoji="🏆"
          title="World's Best Girlfriend"
          subtitle="Voted by one very biased judge, who happens to be completely correct."
        />

        {/* ------------------------------ Certificate ------------------------------ */}
        <Reveal preset="zoom" duration={0.9}>
          <div className="relative mx-auto max-w-3xl">
            <Bow className="absolute -left-4 -top-5 z-20 h-12 w-[4.5rem] -rotate-12 drop-shadow-md md:-left-6 md:h-14 md:w-[5.25rem]" />
            <Bow className="absolute -right-4 -top-5 z-20 h-12 w-[4.5rem] rotate-12 -scale-x-100 drop-shadow-md md:-right-6 md:h-14 md:w-[5.25rem]" />

            <div className="glass relative rounded-[2rem] p-3">
              <div className="relative overflow-hidden rounded-[1.5rem] border-2 border-dashed border-primary/40 bg-gradient-to-b from-primary/[0.07] via-transparent to-butter/20 px-5 pb-4 pt-10 text-center md:px-14 md:pb-5 md:pt-12">
                <Twinkle className="absolute left-[8%] top-[14%] h-4 w-4 text-butter" delay={0} />
                <Twinkle className="absolute right-[9%] top-[22%] h-5 w-5 text-primary/70" delay={0.9} />
                <Twinkle className="absolute bottom-[26%] left-[6%] h-3.5 w-3.5 text-primary/60" delay={1.6} />
                <Twinkle className="absolute bottom-[34%] right-[7%] h-4 w-4 text-butter" delay={0.4} />

                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-ink-soft">Certificate of Extra Special Love</p>

                <div className="mx-auto mt-6 w-28 animate-float md:w-32">
                  <motion.button
                    type="button"
                    animate={medalControls}
                    onClick={celebrate}
                    className="block w-full cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    style={{ filter: "drop-shadow(0 10px 14px rgb(219 39 119 / 0.3))" }}
                    aria-label="Celebrate the best girlfriend award"
                    data-no-burst
                  >
                    <Medal className="h-auto w-full" />
                  </motion.button>
                </div>

                <h3 className="mt-5 font-script text-4xl leading-tight text-primary md:text-5xl">Best Girlfriend</h3>
                <p className="mt-2 font-hand text-2xl text-ink-soft">in the whole wide world</p>

                <div className="mx-auto my-6 flex max-w-xs items-center gap-3 text-primary/50" aria-hidden="true">
                  <span className="h-px flex-1 bg-current" />
                  <HeartIcon className="h-4 w-4 text-primary" />
                  <span className="h-px flex-1 bg-current" />
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">This is to certify that</p>

                <div className="relative mx-auto mt-3 inline-block">
                  <span className="font-script text-5xl text-ink md:text-7xl">{HER_NAME}</span>
                  <svg className="absolute -bottom-2 left-0 h-3 w-full text-primary/40" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </div>

                <p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-ink/85 md:text-base">
                  is hereby awarded the title of <strong className="font-bold text-primary-deep">Best Girlfriend Ever</strong> for
                  being the cutest, kindest, funniest, most wonderful person I know, and for making every ordinary day feel
                  like a tiny celebration.
                </p>

                <div className="mt-9 grid grid-cols-3 items-end gap-2 text-center">
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft">Together since</p>
                    <p className="mt-1 border-t border-primary/30 pt-1 text-xs font-semibold text-ink md:text-sm">{since}</p>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-deep shadow-lg shadow-primary/30 ring-4 ring-primary/20 md:h-16 md:w-16">
                      <div className="absolute inset-1.5 rounded-full border border-dashed border-white/50" />
                      <HeartIcon className="h-6 w-6 text-white md:h-7 md:w-7" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft">With all my love</p>
                    <p className="mt-1 border-t border-primary/30 pt-1 font-script text-xs text-primary-deep md:text-sm">{FROM}</p>
                  </div>
                </div>

                <p className="mt-7 text-[10px] uppercase tracking-widest text-ink-soft/80">
                  Valid forever · No refunds · No returns · Non-transferable
                </p>

                <div className="mt-3 flex h-12 items-center justify-center">
                  <AnimatePresence>
                    {claimed && (
                      <motion.div
                        initial={{ scale: 2.6, opacity: 0, rotate: -26 }}
                        animate={{ scale: 1, opacity: 1, rotate: -6 }}
                        transition={{ type: "spring", stiffness: 260, damping: 14 }}
                        className="rounded-xl border-4 border-primary-deep px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-primary-deep md:text-base"
                      >
                        100% Approved ✓
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-9 flex justify-center">
            <motion.button
              ref={claimRef}
              type="button"
              onClick={celebrate}
              whileHover={{ scale: 1.07, rotate: -1 }}
              whileTap={{ scale: 0.93 }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              data-no-burst
            >
              <PartyPopper className="h-5 w-5" />
              {claimed ? "Celebrate again!" : "Claim your award"}
            </motion.button>
          </div>
          <p className="mt-3 h-5 text-center text-sm text-ink-soft">
            {claimed ? (
              <>
                Congratulations, {HER_NAME}! You&apos;ve officially been the best this whole time. <span aria-hidden="true">💖</span>
              </>
            ) : (
              <>
                (tap the medal too <span aria-hidden="true">🥇</span>)
              </>
            )}
          </p>
        </Reveal>

        {/* -------------------------- Stats + Reasons -------------------------- */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <Reveal preset="right" className="h-full">
            <Stats />
          </Reveal>
          <Reveal preset="left" className="h-full">
            <Reasons />
          </Reveal>
        </div>

        <Reveal>
          <ForeverQuestion />
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-20 max-w-xl text-center">
            <Sparkles className="mx-auto mb-3 h-6 w-6 text-butter" />
            <p className="font-script text-3xl leading-snug text-primary md:text-4xl">Thank you for being you, {HER_NAME}.</p>
            <p className="mt-3 text-sm italic text-ink-soft">
              P.S. I love you more than yesterday, and less than tomorrow. <span aria-hidden="true">💌</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
