import React from "react";

// Tiny deterministic generator: identical output on server and client, so no hydration mismatch.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rand = seeded(2025);
const STARS = Array.from({ length: 56 }, () => ({
  left: rand() * 100,
  top: rand() * 100,
  size: 1.5 + rand() * 2.5,
  delay: rand() * 5,
  dur: 2 + rand() * 3,
}));

/** Night-sky layer, only visible in dark mode (see `.stars` in globals.css). */
export function Stars() {
  return (
    <div className="stars pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
            boxShadow: "0 0 6px 1px rgba(255,255,255,0.6)",
          }}
        />
      ))}
      {[0, 1].map((i) => (
        <span
          key={`shoot-${i}`}
          className="absolute h-0.5 w-24 rounded-full bg-gradient-to-r from-white to-transparent"
          style={{
            left: i === 0 ? "78%" : "55%",
            top: i === 0 ? "10%" : "4%",
            animation: `shooting ${i === 0 ? 11 : 17}s ease-out ${i === 0 ? 3 : 9}s infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
