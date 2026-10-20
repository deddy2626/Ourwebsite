"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/data/content";

// `custom` is the direction of travel (1 = next, -1 = previous) so photos slide the right way
const SLIDE: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 90, scale: 0.92, rotate: d * 3 }),
  center: { opacity: 1, x: 0, scale: 1, rotate: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -90, scale: 0.92, rotate: d * -3 }),
};

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const item = items[index];
  const [direction, setDirection] = useState(1);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const go = useCallback(
    (delta: number) => {
      setDirection(delta);
      onNavigate((index + delta + items.length) % items.length);
    },
    [index, items.length, onNavigate],
  );

  // Lock page scroll, move focus into the dialog, and give it back when closing
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      html.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        // keep keyboard focus inside the dialog
        const stops = [closeRef.current, prevRef.current, nextRef.current].filter(Boolean) as HTMLElement[];
        const i = stops.indexOf(document.activeElement as HTMLElement);
        const next = e.shiftKey ? (i <= 0 ? stops.length - 1 : i - 1) : (i + 1) % stops.length;
        e.preventDefault();
        stops[next]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80) go(1);
    else if (info.offset.x > 80) go(-1);
  };

  const btn =
    "flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <motion.div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-[#2a0a22]/92 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.category}: ${item.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      data-no-burst
    >
      <button ref={closeRef} type="button" onClick={onClose} className={`${btn} absolute right-4 top-4`} aria-label="Close">
        <X className="h-5 w-5" />
      </button>
      <button
        ref={prevRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          go(-1);
        }}
        className={`${btn} absolute left-3 top-1/2 -translate-y-1/2`}
        aria-label="Previous memory"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        ref={nextRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
        className={`${btn} absolute right-3 top-1/2 -translate-y-1/2`}
        aria-label="Next memory"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.figure
          key={item.id}
          className="flex max-h-full max-w-3xl flex-col items-center"
          custom={direction}
          variants={SLIDE}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          onDragEnd={onDragEnd}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="rounded-2xl bg-white p-3 pb-4 shadow-2xl">
            {item.isVideo ? (
              <video
                src={item.src}
                poster={item.poster}
                controls
                autoPlay
                loop
                playsInline
                className="max-h-[68vh] max-w-full rounded-lg"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.src} alt={item.title} className="max-h-[68vh] max-w-full rounded-lg object-contain" draggable={false} />
            )}
          </div>
          <figcaption className="mt-4 text-center text-white">
            <span className="font-script text-2xl">
              {item.emoji} {item.category}
            </span>
            <span className="block font-hand text-2xl text-pink-100">{item.title}</span>
            <span className="mt-1 block text-xs font-semibold tracking-widest text-white/60">
              {index + 1} / {items.length}
            </span>
          </figcaption>
        </motion.figure>
      </AnimatePresence>
    </motion.div>
  );
}
