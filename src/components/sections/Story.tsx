"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { HeartIcon } from "@/components/art/Doodles";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MILESTONES, type Milestone } from "@/data/content";

function Node({ emoji }: { emoji: string }) {
  return (
    <motion.div
      className="absolute left-5 top-7 z-10 -translate-x-1/2 md:left-1/2"
      initial={{ scale: 0, rotate: -90 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ type: "spring", stiffness: 260, damping: 13 }}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" aria-hidden="true" />
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-pink-200 to-primary text-xl shadow-lg shadow-primary/40 dark:border-[#2a1745]">
        <span aria-hidden="true">{emoji}</span>
      </span>
    </motion.div>
  );
}

function MilestoneCard({ item, index }: { item: Milestone; index: number }) {
  const left = index % 2 === 0;
  return (
    <li className="relative pl-16 md:grid md:grid-cols-2 md:gap-x-24 md:pl-0">
      <Node emoji={item.emoji} />

      <Reveal preset={left ? "right" : "left"} className={left ? "md:text-right" : "md:col-start-2"}>
        <motion.article
          className="glass relative rounded-[2rem] p-6 sm:p-7"
          whileHover={{ y: -6, rotate: left ? -0.8 : 0.8, scale: 1.015 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <span className="washi absolute -top-3 left-8 h-6 w-20 -rotate-3 rounded-sm bg-primary/35" aria-hidden="true" />
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-deep">
            {item.date}
          </span>
          <h3 className="mt-3 font-display text-2xl font-bold text-ink">{item.title}</h3>
          <p className="font-script text-lg text-primary">{item.tag}</p>
          <p className="mt-3 border-t border-dashed border-line pt-3 text-[0.95rem] leading-relaxed text-ink-soft">
            {item.body}
          </p>
        </motion.article>
      </Reveal>
    </li>
  );
}

export function Story() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 70%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const headTop = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <section id="story" className="relative z-10 px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Chapter by chapter"
          emoji="📖"
          title="Our Love Story"
          subtitle="A look back at the little moments that turned into everything."
        />

        <div ref={trackRef} className="relative">
          {/* the path: a faint track, and a bright line that draws itself as you scroll */}
          <div className="absolute inset-y-0 left-5 w-1 -translate-x-1/2 rounded-full bg-primary/15 md:left-1/2" aria-hidden="true" />
          <motion.div
            className="absolute inset-y-0 left-5 w-1 origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-pink-300 via-primary to-rose-400 md:left-1/2"
            style={{ scaleY: progress }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute left-5 z-20 -translate-x-1/2 -translate-y-1/2 md:left-1/2"
            style={{ top: headTop }}
            aria-hidden="true"
          >
            <HeartIcon className="h-7 w-7 animate-heartbeat text-primary drop-shadow-[0_0_8px_rgba(255,92,157,0.8)]" />
          </motion.div>

          <ol className="space-y-14 md:space-y-20">
            {MILESTONES.map((item, i) => (
              <MilestoneCard key={item.id} item={item} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
