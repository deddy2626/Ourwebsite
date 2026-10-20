"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Expand } from "lucide-react";
import { HeartIcon } from "@/components/art/Doodles";
import { Lightbox } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useSound } from "@/context/SoundContext";
import { GALLERY, type GalleryItem } from "@/data/content";

const RATIO: Record<GalleryItem["ratio"], string> = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  wide: "aspect-video",
};

// A little personality for each frame: how it's tilted and which colour of tape holds it up
const TILT = [-3, 2.5, -1.5, 3, -2.5, 1.8];
const TAPE = ["bg-primary/45", "bg-butter/70", "bg-lilac/60", "bg-mint/70", "bg-primary/45", "bg-butter/70"];

function Media({ item }: { item: GalleryItem }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [failed, setFailed] = useState(false);

  // Only play clips while they're on screen: saves battery and bandwidth
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.3 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [failed]);

  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-primary/10 text-center text-xs font-semibold text-ink-soft">
        <span className="text-3xl" aria-hidden="true">{item.emoji}</span>
        Add media in
        <code className="mt-1 rounded bg-white/60 px-1.5 py-0.5 text-[10px]">public/images/gallery</code>
      </div>
    );
  }

  return (
    <>
      {/* shimmer skeleton, simply covered once the pixels arrive */}
      <div
        aria-hidden="true"
        className="absolute inset-0 animate-shimmer bg-primary/10 bg-[linear-gradient(110deg,transparent_30%,var(--line)_50%,transparent_70%)] bg-[length:200%_100%]"
      />
      {item.isVideo ? (
        <video
          ref={videoRef}
          src={item.src}
          poster={item.poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="relative h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setFailed(true)}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={`${item.category}: ${item.title}`}
          loading="lazy"
          className="relative h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setFailed(true)}
        />
      )}
    </>
  );
}

function Polaroid({ item, index, onOpen }: { item: GalleryItem; index: number; onOpen: () => void }) {
  const tilt = TILT[index % TILT.length];
  const [liked, setLiked] = useState(0);
  const { sfx } = useSound();

  return (
    <Reveal preset="pop" delay={(index % 3) * 0.08} className="mb-10 break-inside-avoid">
      <motion.div
        className="group relative rounded-[1.4rem] bg-white p-3 pb-4 shadow-xl shadow-primary/25 dark:bg-[#fbeaf3]"
        style={{ rotate: tilt }}
        whileHover={{ rotate: 0, y: -10, scale: 1.04, zIndex: 5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
      >
        <span className={`washi absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-2 rounded-sm ${TAPE[index % TAPE.length]}`} aria-hidden="true" />

        <button
          type="button"
          onClick={() => {
            sfx("flip");
            onOpen();
          }}
          className={`relative block w-full cursor-pointer overflow-hidden rounded-xl ${RATIO[item.ratio]} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
          aria-label={`Open ${item.title}`}
        >
          <Media item={item} />
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20 group-focus-within:bg-black/20">
            <span className="scale-75 rounded-full bg-white/30 p-3 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100">
              <Expand className="h-5 w-5" />
            </span>
          </span>
        </button>

        <div className="mt-3 flex items-center justify-between gap-2 px-1">
          <div className="min-w-0">
            <p className="truncate font-script text-lg leading-tight text-[#c71f66]">
              {item.emoji} {item.category}
            </p>
            <p className="truncate font-hand text-xl leading-tight text-[#8a3a64]">{item.title}</p>
          </div>
          <motion.button
            type="button"
            onClick={() => {
              setLiked((n) => n + 1);
              sfx("pop");
            }}
            whileTap={{ scale: 0.7 }}
            className="relative cursor-pointer rounded-full p-1.5 focus-visible:outline-2 focus-visible:outline-primary"
            aria-label={`Love this memory${liked ? ` (${liked})` : ""}`}
          >
            <HeartIcon className={`h-6 w-6 transition-colors ${liked ? "text-primary" : "text-primary/30 group-hover:text-primary/60"}`} />
            <AnimatePresence>
              {liked > 0 && (
                <motion.span
                  key={liked}
                  className="pointer-events-none absolute left-1/2 top-0 text-primary"
                  initial={{ y: 0, opacity: 1, scale: 0.6 }}
                  animate={{ y: -34, opacity: 0, scale: 1.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  aria-hidden="true"
                >
                  <HeartIcon className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </Reveal>
  );
}

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="memories" className="relative z-10 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Our album"
          emoji="📸"
          title="Memory Lane"
          subtitle="Tap a polaroid to open it. Give the little hearts some love."
        />

        <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
          {GALLERY.map((item, i) => (
            <Polaroid key={item.id} item={item} index={i} onOpen={() => setOpen(i)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <Lightbox items={GALLERY} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />
        )}
      </AnimatePresence>
    </section>
  );
}
