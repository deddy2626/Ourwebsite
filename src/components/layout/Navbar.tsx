"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { HeartIcon } from "@/components/art/Doodles";
import { useTheme } from "@/context/ThemeContext";
import { useSound } from "@/context/SoundContext";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "together", label: "Together" },
  { id: "story", label: "Our Story" },
  { id: "memories", label: "Memories" },
  { id: "letters", label: "Letters" },
  { id: "play", label: "Play" },
  { id: "forever", label: "Forever" },
];

export function Navbar({ visible }: { visible: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const { sfx } = useSound();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  // Highlight the link of the section that's in the middle of the screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const toggleThemeWithSound = () => {
    sfx("flip");
    toggleTheme();
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-3 z-50 flex justify-center px-3"
      initial={{ y: -90, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -90, opacity: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 16, delay: visible ? 0.9 : 0 }}
    >
      <div className="glass relative w-full max-w-5xl rounded-full px-3 py-2 sm:px-4">
        <div className="flex items-center justify-between gap-2">
          <a
            href="#home"
            className="flex items-center gap-2 rounded-full pl-1 pr-3 font-script text-xl text-primary focus-visible:outline-2 focus-visible:outline-primary"
          >
            <HeartIcon className="h-5 w-5 animate-heartbeat text-primary" />
            <span className="hidden sm:inline">Our Little Universe</span>
            <span className="sm:hidden">Us</span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`relative rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                    isActive ? "text-white" : "text-ink-soft hover:text-primary-deep"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-primary shadow-md shadow-primary/40"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleThemeWithSound}
              className="relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-line bg-white/50 text-primary-deep transition hover:scale-110 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary dark:bg-white/5"
              aria-label={`Switch to ${theme === "light" ? "night" : "day"} mode`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ y: 18, rotate: -80, opacity: 0 }}
                  animate={{ y: 0, rotate: 0, opacity: 1 }}
                  exit={{ y: -18, rotate: 80, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
                </motion.span>
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line bg-white/50 text-primary-deep transition hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary lg:hidden dark:bg-white/5"
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              aria-label="Mobile"
              className="overflow-hidden lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ul className="grid grid-cols-2 gap-2 px-1 pb-2 pt-3">
                {LINKS.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={() => setOpen(false)}
                      className={`block rounded-2xl px-4 py-2.5 text-center text-sm font-semibold ${
                        active === link.id
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary-deep hover:bg-primary/20"
                      }`}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
