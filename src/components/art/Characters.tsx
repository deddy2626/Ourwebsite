import React from "react";

interface BuddyProps {
  className?: string;
  /** One arm waves hello */
  waving?: boolean;
}

/* Two original little characters: a bunny (her) and a bear (him). Hand-built SVG so they
   can blink, wave and bounce without any image files. */

export function Bunny({ className = "", waving = true }: BuddyProps) {
  const outline = "#ffc2da";
  return (
    <svg viewBox="0 0 160 196" className={className} role="img" aria-label="A cute little bunny with a pink bow">
      {/* ears */}
      <g transform="rotate(-10 56 44)">
        <ellipse cx="56" cy="44" rx="16" ry="40" fill="#fff" stroke={outline} strokeWidth="2.5" />
        <ellipse cx="56" cy="48" rx="8" ry="27" fill="#ffb3d1" />
      </g>
      <g transform="rotate(14 106 44)">
        <ellipse cx="106" cy="44" rx="16" ry="40" fill="#fff" stroke={outline} strokeWidth="2.5" />
        <ellipse cx="106" cy="48" rx="8" ry="27" fill="#ffb3d1" />
      </g>

      {/* body + feet */}
      <ellipse cx="80" cy="162" rx="37" ry="30" fill="#fff" stroke={outline} strokeWidth="2.5" />
      <ellipse cx="58" cy="187" rx="15" ry="8" fill="#fff" stroke={outline} strokeWidth="2.5" />
      <ellipse cx="102" cy="187" rx="15" ry="8" fill="#fff" stroke={outline} strokeWidth="2.5" />
      <ellipse cx="80" cy="168" rx="20" ry="17" fill="#ffe3ef" />

      {/* resting arm */}
      <ellipse cx="42" cy="158" rx="9" ry="16" fill="#fff" stroke={outline} strokeWidth="2.5" transform="rotate(14 42 158)" />
      {/* waving arm */}
      <g className={waving ? "k-arm-wave" : undefined}>
        <ellipse cx="119" cy="152" rx="9" ry="16" fill="#fff" stroke={outline} strokeWidth="2.5" transform="rotate(-20 119 152)" />
      </g>

      {/* head */}
      <ellipse cx="80" cy="106" rx="50" ry="43" fill="#fff" stroke={outline} strokeWidth="2.5" />

      {/* face */}
      <g className="k-eye">
        <ellipse cx="61" cy="108" rx="5.2" ry="6.6" fill="#4a1d36" />
        <circle cx="63" cy="105.6" r="2" fill="#fff" />
      </g>
      <g className="k-eye" style={{ animationDelay: "0.06s" }}>
        <ellipse cx="99" cy="108" rx="5.2" ry="6.6" fill="#4a1d36" />
        <circle cx="101" cy="105.6" r="2" fill="#fff" />
      </g>
      <ellipse cx="45" cy="120" rx="9.5" ry="6" fill="#ff8fb8" opacity="0.55" />
      <ellipse cx="115" cy="120" rx="9.5" ry="6" fill="#ff8fb8" opacity="0.55" />
      <ellipse cx="80" cy="117" rx="3.8" ry="2.7" fill="#ff7aa8" />
      <path
        d="M72 124 Q76 130 80 124 Q84 130 88 124"
        fill="none"
        stroke="#4a1d36"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* bow */}
      <g transform="translate(48 72) rotate(-16)">
        <path d="M0 0 C -14 -11, -22 4, -12 10 C -5 14, 0 6, 0 0 Z" fill="#ff5c9d" />
        <path d="M0 0 C 14 -11, 22 4, 12 10 C 5 14, 0 6, 0 0 Z" fill="#ff5c9d" />
        <circle cx="0" cy="2" r="4.6" fill="#c71f66" />
        <path d="M-14 0 C -11 -4, -8 -5, -5 -3" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function Bear({ className = "", waving = true }: BuddyProps) {
  const fur = "#c98f68";
  const furDark = "#b27a55";
  const cream = "#f5d9c0";
  return (
    <svg viewBox="0 0 160 196" className={className} role="img" aria-label="A cute little bear with a pink scarf">
      {/* ears */}
      <circle cx="42" cy="66" r="19" fill={furDark} />
      <circle cx="42" cy="67" r="10" fill="#efbfa3" />
      <circle cx="118" cy="66" r="19" fill={furDark} />
      <circle cx="118" cy="67" r="10" fill="#efbfa3" />

      {/* body + feet */}
      <ellipse cx="80" cy="162" rx="39" ry="31" fill={fur} />
      <ellipse cx="80" cy="168" rx="23" ry="20" fill={cream} />
      <ellipse cx="57" cy="187" rx="16" ry="8.5" fill={furDark} />
      <ellipse cx="103" cy="187" rx="16" ry="8.5" fill={furDark} />

      {/* arms */}
      <ellipse cx="40" cy="160" rx="10" ry="17" fill={fur} transform="rotate(14 40 160)" />
      <g className={waving ? "k-arm-wave" : undefined} style={{ animationDelay: "0.4s" }}>
        <ellipse cx="121" cy="154" rx="10" ry="17" fill={fur} transform="rotate(-20 121 154)" />
      </g>

      {/* head */}
      <ellipse cx="80" cy="106" rx="52" ry="45" fill={fur} />
      <ellipse cx="80" cy="121" rx="21" ry="16" fill={cream} />

      {/* face */}
      <g className="k-eye" style={{ animationDelay: "0.5s" }}>
        <ellipse cx="59" cy="102" rx="5.4" ry="6.8" fill="#3d1a2b" />
        <circle cx="61" cy="99.6" r="2" fill="#fff" />
      </g>
      <g className="k-eye" style={{ animationDelay: "0.56s" }}>
        <ellipse cx="101" cy="102" rx="5.4" ry="6.8" fill="#3d1a2b" />
        <circle cx="103" cy="99.6" r="2" fill="#fff" />
      </g>
      <ellipse cx="45" cy="118" rx="9.5" ry="6" fill="#ff8fb8" opacity="0.6" />
      <ellipse cx="115" cy="118" rx="9.5" ry="6" fill="#ff8fb8" opacity="0.6" />
      <ellipse cx="80" cy="114" rx="6.5" ry="4.6" fill="#3d1a2b" />
      <path
        d="M80 118.5 V122.5 M80 122.5 Q74 129 69.500 124 M80 122.5 Q86 129 90.500 124"
        fill="none"
        stroke="#3d1a2b"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* scarf */}
      <path d="M40 142 Q80 164 120 142 L123 156 Q80 178 37 156 Z" fill="#ff5c9d" />
      <path d="M52 150 L50 165 M68 156 L66 171 M84 158 L82 173 M100 156 L98 171 M114 150 L112 165" stroke="#ff9ec4" strokeWidth="3" strokeLinecap="round" />
      <rect x="96" y="156" width="17" height="28" rx="6" fill="#ff5c9d" transform="rotate(-10 104 168)" />
      <path d="M99 180 L111 177" stroke="#ff9ec4" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
