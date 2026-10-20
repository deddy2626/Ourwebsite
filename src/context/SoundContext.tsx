"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { OUR_SONG } from "@/data/content";
import {
  playSfx,
  resumeAudio,
  startMusicBox,
  stopMusicBox,
  suspendAudio,
  unlockAudio,
  type Sfx,
} from "@/lib/sound";

interface SoundContextType {
  /** Music + sound effects are on */
  enabled: boolean;
  toggle: () => void;
  /** Turn sound on/off from a user gesture (e.g. the intro buttons) */
  setEnabled: (on: boolean) => void;
  sfx: (kind: Sfx) => void;
  trackLabel: string;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = useState(false);
  const enabledRef = useRef(false);
  const songRef = useRef<HTMLAudioElement | null>(null);

  const apply = useCallback((on: boolean) => {
    enabledRef.current = on;
    setEnabledState(on);
    if (on) {
      unlockAudio();
      if (OUR_SONG) {
        if (!songRef.current) {
          songRef.current = new Audio(OUR_SONG.src);
          songRef.current.loop = true;
          songRef.current.volume = 0.55;
        }
        songRef.current.play().catch(() => startMusicBox());
      } else {
        startMusicBox();
      }
    } else {
      songRef.current?.pause();
      stopMusicBox();
    }
  }, []);

  const toggle = useCallback(() => apply(!enabledRef.current), [apply]);

  const sfx = useCallback((kind: Sfx) => {
    if (enabledRef.current) playSfx(kind);
  }, []);

  // Don't keep playing to nobody while the tab is hidden
  useEffect(() => {
    const onVisibility = () => {
      if (!enabledRef.current) return;
      if (document.hidden) {
        suspendAudio();
        songRef.current?.pause();
      } else {
        resumeAudio();
        songRef.current?.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      songRef.current?.pause();
      stopMusicBox();
    };
  }, []);

  const trackLabel = OUR_SONG ? `${OUR_SONG.title} · ${OUR_SONG.artist}` : "Our little music box";

  return (
    <SoundContext.Provider value={{ enabled, toggle, setEnabled: apply, sfx, trackLabel }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSound must be used within a SoundProvider");
  return context;
}
