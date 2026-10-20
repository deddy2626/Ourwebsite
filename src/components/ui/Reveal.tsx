"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

type Preset = "up" | "left" | "right" | "zoom" | "pop" | "fade";

const OFFSET = 46;

const VARIANTS: Record<Preset, Variants> = {
  up: { hidden: { opacity: 0, y: OFFSET }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: OFFSET }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -OFFSET }, visible: { opacity: 1, x: 0 } },
  zoom: { hidden: { opacity: 0, scale: 0.86 }, visible: { opacity: 1, scale: 1 } },
  pop: {
    hidden: { opacity: 0, scale: 0.4, rotate: -8 },
    visible: { opacity: 1, scale: 1, rotate: 0 },
  },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

interface RevealProps {
  children: React.ReactNode;
  preset?: Preset;
  delay?: number;
  duration?: number;
  amount?: number;
  className?: string;
}

/** Fades/slides/pops its children in the first time they scroll into view. */
export function Reveal({
  children,
  preset = "up",
  delay = 0,
  duration,
  amount = 0.2,
  className,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={VARIANTS[preset]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={
        preset === "pop"
          ? { type: "spring", stiffness: 220, damping: 15, delay }
          : { duration: duration ?? 0.8, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
