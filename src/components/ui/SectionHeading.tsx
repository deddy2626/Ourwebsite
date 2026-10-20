"use client";

import React from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  emoji?: string;
}

export function SectionHeading({ eyebrow, title, subtitle, emoji }: SectionHeadingProps) {
  return (
    <div className="mb-14 text-center">
      <Reveal preset="pop">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary-deep">
          {emoji && <span aria-hidden="true">{emoji}</span>}
          {eyebrow}
        </span>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 className="relative mt-5 inline-block font-script text-5xl leading-tight text-primary sm:text-6xl">
          {title}
          <svg
            className="absolute -bottom-2 left-0 h-3 w-full text-primary/40"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d="M0,5 Q12.500,0 25,5 T50,5 T75,5 T100,5"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.5, ease: "easeInOut" }}
            />
          </svg>
        </h2>
      </Reveal>

      {subtitle && (
        <Reveal delay={0.2}>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink-soft">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}
