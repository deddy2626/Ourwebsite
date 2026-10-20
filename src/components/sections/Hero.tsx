"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { Heart, Music2 } from "lucide-react";
import { Bear, Bunny } from "@/components/art/Characters";
import { Cloud, HeartIcon, Twinkle } from "@/components/art/Doodles";
import { useSound } from "@/context/SoundContext";
import { HER_NAME, LOVE_WORDS } from "@/data/content";
import { asset } from "@/lib/asset";
import { fx } from "@/lib/fx";

/* ------------------------------ Polaroid frame ------------------------------ */

function Polaroid({
  className,
  caption,
  children,
}: {
  className?: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-[1.1rem] bg-white p-2.5 pb-1 shadow-2xl shadow-primary/30 dark:bg-[#fbeaf3] ${className ?? ""}`}>
      <div className="overflow-hidden rounded-lg">{children}</div>
      <p className="py-1.5 text-center font-hand text-xl leading-none text-[#8a3a64]">{caption}</p>
    </div>
  );
}

function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt="" className="block h-full w-full object-cover" />;
  }
  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      className="block h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

/* ---------------------------------- Title ---------------------------------- */

const letterVariants: Variants = {
  hidden: { y: 90, opacity: 0, rotate: 12, scale: 0.6 },
  show: (i: number) => ({
    y: 0,
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 14, delay: 0.5 + i * 0.07 },
  }),
};

function BouncyWord({ word, className }: { word: string; className?: string }) {
  return (
    <span className={`inline-flex ${className ?? ""}`} aria-label={word}>
      {word.split("").map((ch, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          className="inline-block cursor-default"
          whileHover={{ y: -14, rotate: i % 2 ? 8 : -8, scale: 1.25, transition: { type: "spring", stiffness: 400, damping: 10 } }}
          aria-hidden="true"
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ----------------------------------- Hero ---------------------------------- */

export function Hero({ started }: { started: boolean }) {
  const { enabled, toggle, sfx } = useSound();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const bunnyRef = useRef<HTMLButtonElement | null>(null);
  const bearRef = useRef<HTMLButtonElement | null>(null);

  // Mouse-driven 3D tilt for the photo collage
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 14 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 14 });

  const onPointerMove = (e: React.PointerEvent) => {
    const el = stageRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const hug = (ref: React.RefObject<HTMLButtonElement | null>) => {
    fx.burstFrom(ref.current, 16);
    sfx("boop");
  };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110, damping: 15 } },
  };

  const marquee = [...LOVE_WORDS, ...LOVE_WORDS];

  return (
    <section id="home" className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden pb-24 pt-28">
      {/* floating decorations */}
      <Cloud className="animate-float-slow absolute left-[4%] top-[18%] h-14 w-24 text-white/80 dark:text-white/10" />
      <Cloud className="animate-float absolute right-[6%] top-[12%] h-12 w-20 text-white/70 dark:text-white/10" />
      <Twinkle className="absolute left-[46%] top-[16%] h-6 w-6 text-butter" delay={0.4} />
      <Twinkle className="absolute bottom-[26%] left-[8%] h-5 w-5 text-primary/60" delay={1.2} />
      <Twinkle className="absolute right-[44%] top-[70%] h-4 w-4 text-butter" delay={2} />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 lg:grid-cols-12">
        {/* ------------------------------ Words ------------------------------ */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={started ? "show" : "hidden"}
          className="text-center lg:col-span-6 lg:text-left"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary-deep backdrop-blur dark:bg-white/5"
          >
            <HeartIcon className="h-3.5 w-3.5 animate-heartbeat" />
            Our little universe
          </motion.span>

          <h1 className="mt-6 font-script text-primary">
            <motion.span variants={container} className="block text-[3.4rem] leading-[1.05] sm:text-7xl lg:text-8xl">
              <BouncyWord word="Hi," />
            </motion.span>
            <motion.span variants={container} className="text-gradient -mb-[0.15em] block pb-[0.4em] text-[4.6rem] leading-[1.05] sm:text-8xl lg:text-[8.5rem]">
              <BouncyWord word={HER_NAME} />
            </motion.span>
          </h1>

          <motion.p
            variants={item}
            className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-ink-soft lg:mx-0"
          >
            I built this tiny corner of the internet just for you. Every heart, every sparkle, every little detail is
            about us. <span aria-hidden="true">🌸</span>
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <a
              href="#together"
              className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 font-bold text-white shadow-lg shadow-primary/40 transition hover:-translate-y-1 hover:shadow-xl active:scale-95 sm:w-auto"
            >
              <Heart className="h-5 w-5 transition group-hover:fill-white" />
              See how long I&apos;ve loved you
            </a>
            <button
              type="button"
              onClick={toggle}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-primary/40 bg-white/60 px-7 py-3.5 font-bold text-primary-deep backdrop-blur transition hover:-translate-y-1 hover:border-primary active:scale-95 sm:w-auto dark:bg-white/5"
            >
              <Music2 className={`h-5 w-5 ${enabled ? "animate-bob" : ""}`} />
              {enabled ? "Pause our music" : "Play our music"}
            </button>
          </motion.div>
        </motion.div>

        {/* ----------------------------- Collage ----------------------------- */}
        <motion.div
          ref={stageRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="relative mx-auto h-[420px] w-full max-w-[460px] sm:h-[520px] lg:col-span-6"
          style={{ perspective: 1100 }}
          initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
          animate={started ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.7, rotate: -8 }}
          transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.5 }}
        >
          <div className="absolute left-1/2 top-1/2 -z-10 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 animate-blob bg-gradient-to-br from-pink-300/60 via-primary/25 to-lilac/50 blur-2xl" />

          <motion.div className="relative h-full w-full" style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}>
            <motion.div
              className="absolute left-0 top-2 w-[52%]"
              style={{ translateZ: 50 }}
              animate={{ y: [0, -12, 0], rotate: [-6, -3, -6] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <Polaroid caption="us, always">
                <div className="aspect-[9/14]">
                  <HeroVideo src={asset("/images/hero/1.mp4")} poster={asset("/images/posters/hero-1.jpg")} />
                </div>
              </Polaroid>
              <span className="washi absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 rounded-sm bg-primary/50" aria-hidden="true" />
            </motion.div>

            <motion.div
              className="absolute right-0 top-[18%] w-[46%]"
              style={{ translateZ: 90 }}
              animate={{ y: [0, 14, 0], rotate: [7, 4, 7] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.8 }}
            >
              <Polaroid caption="my favorite">
                <div className="aspect-[3/4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset("/images/hero/2.jpeg")} alt="A photo strip of the two of us" className="block h-full w-full object-cover" />
                </div>
              </Polaroid>
              <span className="washi absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-6 rounded-sm bg-butter/70" aria-hidden="true" />
            </motion.div>

            {/* the two little friends (tap them!) */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1" style={{ transform: "translateZ(130px)" }}>
              <motion.button
                ref={bearRef}
                type="button"
                onClick={() => hug(bearRef)}
                className="w-[26%] cursor-pointer"
                whileHover={{ y: -8, rotate: -4 }}
                whileTap={{ scale: 0.88, rotate: 6 }}
                aria-label="Poke the bear"
                data-no-burst
              >
                <div className="animate-bob">
                  <Bear className="h-auto w-full drop-shadow-xl" />
                </div>
              </motion.button>
              <HeartIcon className="mb-16 h-7 w-7 animate-heartbeat text-primary drop-shadow" />
              <motion.button
                ref={bunnyRef}
                type="button"
                onClick={() => hug(bunnyRef)}
                className="w-[26%] cursor-pointer"
                whileHover={{ y: -8, rotate: 4 }}
                whileTap={{ scale: 0.88, rotate: -6 }}
                aria-label="Poke the bunny"
                data-no-burst
              >
                <div className="animate-bob" style={{ animationDelay: "0.7s" }}>
                  <Bunny className="h-auto w-full drop-shadow-xl" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* "I love you" in many languages, scrolling on a ribbon */}
      <motion.div
        className="absolute inset-x-0 bottom-6 -rotate-1 overflow-hidden bg-primary py-2.5 shadow-lg shadow-primary/30"
        initial={{ opacity: 0, y: 60 }}
        animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        aria-hidden="true"
      >
        <div className="flex w-max animate-marquee items-center whitespace-nowrap">
          {marquee.map((word, i) => (
            <span key={i} className="flex items-center font-display text-base font-semibold text-white sm:text-lg">
              <span className="px-5">{word}</span>
              <HeartIcon className="h-3.5 w-3.5 text-white/80" />
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
