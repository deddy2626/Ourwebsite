"use client";

import React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { HeartIcon } from "@/components/art/Doodles";

/** A pink ribbon across the top of the page with a little heart riding its end. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const left = useTransform(smooth, (v) => `${v * 100}%`);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1.5" aria-hidden="true">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-pink-300 via-primary to-rose-400"
        style={{ scaleX: smooth }}
      />
      <motion.div className="absolute -top-0.5 -ml-2.5" style={{ left }}>
        <HeartIcon className="h-5 w-5 animate-heartbeat text-primary drop-shadow" />
      </motion.div>
    </div>
  );
}
