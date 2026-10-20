import React from "react";
import { HeartIcon } from "@/components/art/Doodles";

// Fixed values (not random) so server and client render the exact same markup.
const HEARTS = [
  { left: 6, size: 18, dur: 9, delay: 0, tone: "text-primary/50" },
  { left: 14, size: 28, dur: 12, delay: 2.4, tone: "text-blush" },
  { left: 23, size: 14, dur: 8, delay: 5, tone: "text-primary/40" },
  { left: 33, size: 24, dur: 11, delay: 1.2, tone: "text-lilac/70" },
  { left: 42, size: 16, dur: 9.5, delay: 6.5, tone: "text-primary/50" },
  { left: 51, size: 30, dur: 13, delay: 3.6, tone: "text-blush" },
  { left: 60, size: 15, dur: 8.5, delay: 0.8, tone: "text-primary/40" },
  { left: 68, size: 22, dur: 10.5, delay: 7, tone: "text-butter/80" },
  { left: 77, size: 26, dur: 12, delay: 4.2, tone: "text-primary/50" },
  { left: 85, size: 14, dur: 9, delay: 2, tone: "text-blush" },
  { left: 93, size: 20, dur: 11, delay: 5.6, tone: "text-lilac/70" },
];

/** Hearts that float up the screen. Used behind the loader and envelope screens. */
export function RisingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {HEARTS.map((h, i) => (
        <HeartIcon
          key={i}
          className={`absolute -bottom-10 ${h.tone}`}
          style={{
            left: `${h.left}%`,
            width: h.size,
            height: h.size,
            animation: `rise ${h.dur}s linear ${h.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
