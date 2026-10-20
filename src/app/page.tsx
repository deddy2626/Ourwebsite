"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { FallingHearts } from "@/components/fx/FallingHearts";
import { FxCanvas } from "@/components/fx/FxCanvas";
import { Stars } from "@/components/fx/Stars";
import { EnvelopeIntro } from "@/components/intro/EnvelopeIntro";
import { Loader } from "@/components/intro/Loader";
import { Footer } from "@/components/layout/Footer";
import { MusicToggle } from "@/components/layout/MusicToggle";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Finale } from "@/components/sections/Finale";
import { Gallery } from "@/components/sections/Gallery";
import { Game } from "@/components/sections/Game";
import { Hero } from "@/components/sections/Hero";
import { OpenWhen } from "@/components/sections/OpenWhen";
import { Story } from "@/components/sections/Story";
import { Timer } from "@/components/sections/Timer";

// loading (heart fills up) → envelope (tap to open the letter) → main site
type Stage = "loading" | "envelope" | "main";

export default function Home() {
  const [stage, setStage] = useState<Stage>("loading");
  // The loader stays underneath while the envelope's heart-shaped window opens over it
  const [loaderMounted, setLoaderMounted] = useState(true);
  const unmountTimer = useRef<number | null>(null);

  const toEnvelope = useCallback(() => {
    setStage((s) => (s === "loading" ? "envelope" : s));
    unmountTimer.current = window.setTimeout(() => setLoaderMounted(false), 1700);
  }, []);

  const toMain = useCallback(() => {
    setStage("main");
    setLoaderMounted(false);
  }, []);

  useEffect(
    () => () => {
      if (unmountTimer.current) window.clearTimeout(unmountTimer.current);
    },
    [],
  );

  // Page can't scroll while the intro screens are up
  useEffect(() => {
    document.documentElement.classList.toggle("intro-lock", stage !== "main");
    if (stage === "main") window.scrollTo(0, 0);
  }, [stage]);

  const started = stage === "main";

  return (
    <MotionConfig reducedMotion="user">
      <Stars />
      <FallingHearts />
      <FxCanvas />

      {/* The real site is mounted from the start (so photos and videos warm up behind the
          loader) but stays inert, and hidden from screen readers, until the intro is done. */}
      <div inert={!started} aria-hidden={!started} className="relative flex flex-1 flex-col">
        <ScrollProgress />
        <Navbar visible={started} />
        <main className="relative z-10 flex-1">
          <Hero started={started} />
          <Timer />
          <Story />
          <Gallery />
          <OpenWhen />
          <Game />
          <Finale />
        </main>
        <Footer />
        <MusicToggle visible={started} />
      </div>

      {loaderMounted && <Loader onDone={toEnvelope} onSkip={toMain} />}
      <AnimatePresence>{stage === "envelope" && <EnvelopeIntro onEnter={toMain} />}</AnimatePresence>
    </MotionConfig>
  );
}
