"use client";

import React from "react";
import { ArrowUp } from "lucide-react";
import { HeartIcon } from "@/components/art/Doodles";
import { Reveal } from "@/components/ui/Reveal";
import { HER_NAME, START_DATE } from "@/data/content";
import { formatYMD, parseYMD } from "@/lib/dates";

export function Footer() {
  return (
    <footer className="relative z-10 px-6 pb-10 pt-16 text-center">
      <Reveal>
        <div className="mx-auto flex max-w-md flex-col items-center gap-3">
          <HeartIcon className="h-8 w-8 animate-heartbeat text-primary" />
          <p className="font-script text-3xl text-primary">Made with love, for {HER_NAME}</p>
          <p className="text-sm text-ink-soft">Together since {formatYMD(parseYMD(START_DATE))}, and counting.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mt-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-card text-primary-deep shadow-md transition hover:-translate-y-1 hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Back to the top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </Reveal>
    </footer>
  );
}
