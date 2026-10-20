"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HeartIcon } from "@/components/art/Doodles";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useSound } from "@/context/SoundContext";
import { OPEN_WHEN, type OpenWhenLetter } from "@/data/content";
import { fx } from "@/lib/fx";

function Letter({ letter, index }: { letter: OpenWhenLetter; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const { sfx } = useSound();

  const flip = (e: React.MouseEvent<HTMLButtonElement>) => {
    sfx(flipped ? "flip" : "open");
    if (!flipped) fx.burstFrom(e.currentTarget, 14);
    setFlipped((f) => !f);
  };

  return (
    <Reveal preset="up" delay={(index % 3) * 0.1}>
      <motion.div whileHover={{ y: -8, rotate: index % 2 ? 1.2 : -1.2 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
        <button
          type="button"
          onClick={flip}
          aria-pressed={flipped}
          aria-label={flipped ? `Close the letter: open when ${letter.label}` : `Open when ${letter.label}`}
          className="relative block h-72 w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          style={{ perspective: 1000 }}
          data-no-burst
        >
          <motion.span
            className="relative block h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
          >
            {/* front: a sealed envelope */}
            <span
              className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-pink-200 via-pink-300 to-primary shadow-xl shadow-primary/30"
              style={{ backfaceVisibility: "hidden" }}
              aria-hidden={flipped}
            >
              <span className="absolute inset-0 bg-[#ffb3d1]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 52%)" }} />
              <span className="absolute inset-0 bg-[#ff8fb8]" style={{ clipPath: "polygon(0 100%, 50% 46%, 100% 100%)" }} />
              <span className="absolute inset-0 bg-[#ff9ec4]" style={{ clipPath: "polygon(0 0, 50% 52%, 0 100%)" }} />
              <span className="absolute inset-0 bg-[#ff9ec4]" style={{ clipPath: "polygon(100% 0, 50% 52%, 100% 100%)" }} />
              <span className="absolute left-1/2 top-[46%] z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-deep text-white shadow-lg ring-4 ring-white/50">
                <HeartIcon className="h-7 w-7 animate-heartbeat" />
              </span>
              <span className="absolute bottom-5 z-10 px-4 text-center">
                <span className="block text-[11px] font-bold uppercase tracking-[0.25em] text-white/90">Open when</span>
                <span className="mt-0.5 block font-script text-2xl text-white drop-shadow">
                  {letter.label} <span aria-hidden="true">{letter.emoji}</span>
                </span>
              </span>
            </span>

            {/* back: the letter itself */}
            <span
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[1.6rem] border-2 border-dashed border-primary/40 bg-gradient-to-b from-white to-pink-50 p-6 shadow-xl shadow-primary/25 dark:from-[#3a1d5e] dark:to-[#2a1745]"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              aria-hidden={!flipped}
            >
              <span className="font-script text-xl text-primary">
                {letter.emoji} Open when {letter.label}
              </span>
              <span className="mt-3 flex-1 overflow-auto font-hand text-[1.45rem] leading-[1.2] text-ink">
                {letter.message}
              </span>
              <span className="mt-2 flex items-center justify-between text-xs font-semibold text-ink-soft">
                <span>tap to close</span>
                <HeartIcon className="h-4 w-4 text-primary" />
              </span>
            </span>
          </motion.span>
        </button>
      </motion.div>
    </Reveal>
  );
}

export function OpenWhen() {
  return (
    <section id="letters" className="relative z-10 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Sealed with love"
          emoji="💌"
          title="Open When…"
          subtitle="A little letter for every kind of day. Open whichever one you need right now."
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {OPEN_WHEN.map((letter, i) => (
            <Letter key={letter.id} letter={letter} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
