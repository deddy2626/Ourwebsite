import React from "react";

export const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

export function HeartIcon({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path d={HEART_PATH} fill="currentColor" />
    </svg>
  );
}

export function SparkleIcon({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path
        d="M12 1 l2.6 8.4 L23 12 l-8.4 2.6 L12 23 l-2.6 -8.4 L1 12 l8.4 -2.6 z"
        fill="currentColor"
      />
    </svg>
  );
}

/** A sparkle that twinkles forever. Pass a delay so a group doesn't blink in unison. */
export function Twinkle({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <SparkleIcon
      className={`animate-twinkle ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

export function Bow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden="true">
      <path d="M32 20 C 20 2, 3 3, 5 20 C 3 37, 20 38, 32 20 Z" fill="#ff5c9d" />
      <path d="M32 20 C 44 2, 61 3, 59 20 C 61 37, 44 38, 32 20 Z" fill="#ff5c9d" />
      <path
        d="M10 17 C 14 9, 21 8, 26 15"
        fill="none"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M54 17 C 50 9, 43 8, 38 15"
        fill="none"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect x="26" y="13" width="12" height="14" rx="5" fill="#c71f66" />
    </svg>
  );
}

export function Medal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 150" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="medal-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="45%" stopColor="#ffc93c" />
          <stop offset="100%" stopColor="#e08a00" />
        </linearGradient>
        <linearGradient id="medal-ribbon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb3d1" />
          <stop offset="100%" stopColor="#ff5c9d" />
        </linearGradient>
      </defs>
      <path d="M36 78 L20 142 L41 129 L53 148 L70 86 Z" fill="url(#medal-ribbon)" />
      <path d="M84 78 L100 142 L79 129 L67 148 L50 86 Z" fill="url(#medal-ribbon)" opacity="0.92" />
      <circle cx="60" cy="52" r="46" fill="url(#medal-gold)" />
      <circle
        cx="60"
        cy="52"
        r="38"
        fill="none"
        stroke="white"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeDasharray="2 5"
        strokeLinecap="round"
      />
      <circle cx="60" cy="52" r="32" fill="#fff1f5" />
      <g transform="translate(60 54) scale(0.78) translate(-60 -52)">
        <path
          d="M60 80 C 18 54, 30 22, 50 26 C 56 27, 60 32, 60 36 C 60 32, 64 27, 70 26 C 90 22, 102 54, 60 80 Z"
          fill="#ff5c9d"
        />
        <path
          d="M44 36 C 40 36, 36 40, 36 46"
          fill="none"
          stroke="white"
          strokeOpacity="0.7"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>
      <path
        d="M88 28 l2.2 5.8 5.8 2.2 -5.8 2.2 -2.2 5.8 -2.2 -5.8 -5.8 -2.2 5.8 -2.2 z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );
}

/** A little cloud, used as floating decoration */
export function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden="true">
      <path
        d="M30 52 C 12 52, 6 34, 22 30 C 22 14, 46 8, 54 22 C 62 8, 90 14, 90 32 C 108 30, 114 52, 94 52 Z"
        fill="currentColor"
      />
    </svg>
  );
}
