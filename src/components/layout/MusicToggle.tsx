"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSound } from "@/context/SoundContext";
import { HeartIcon } from "@/components/art/Doodles";

const NOTES = ["♪", "♫", "♬"];

/** A tiny vinyl record in the corner: it spins and sprinkles notes while the music plays. */
export function MusicToggle({ visible }: { visible: boolean }) {
  const { enabled, toggle, trackLabel } = useSound();

  return (
    <motion.div
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3"
      initial={{ scale: 0, opacity: 0 }}
      animate={visible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 14, delay: visible ? 1.2 : 0 }}
    >
      <AnimatePresence>
        {enabled && (
          <motion.span
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 14 }}
            className="glass hidden rounded-full px-3.5 py-1.5 text-xs font-semibold text-ink-soft sm:block"
          >
            Now playing · {trackLabel}
          </motion.span>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence>
          {enabled &&
            NOTES.map((n, i) => (
              <motion.span
                key={n}
                className="pointer-events-none absolute left-1/2 top-0 select-none text-lg text-primary"
                initial={{ y: 0, opacity: 0, x: 0 }}
                animate={{ y: [-4, -56], x: [0, (i - 1) * 22], opacity: [0, 1, 0], rotate: [0, (i - 1) * 24] }}
                transition={{ repeat: Infinity, duration: 2.6, delay: i * 0.85, ease: "easeOut" }}
                aria-hidden="true"
              >
                {n}
              </motion.span>
            ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={toggle}
          aria-pressed={enabled}
          aria-label={enabled ? "Mute the music" : "Play the music"}
          className="group relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full shadow-xl shadow-primary/30 transition-transform hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          data-no-burst
        >
          <span
            className={`absolute inset-0 rounded-full bg-[radial-gradient(circle,#ffd6e7_0_20%,#3a1230_21%_26%,#5a1d48_27%_44%,#3a1230_45%_50%,#5a1d48_51%_68%,#2b0d24_69%)] ring-2 ring-white/70 ${
              enabled ? "animate-spin-slow" : ""
            }`}
          />
          <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary ring-2 ring-white">
            {enabled ? <HeartIcon className="h-3.5 w-3.5 animate-heartbeat text-white" /> : <HeartIcon className="h-3.5 w-3.5 text-white" />}
          </span>
          {!enabled && (
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow ring-1 ring-primary/30">
              🔇
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
}
