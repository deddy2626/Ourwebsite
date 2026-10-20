// All sound on the site is synthesised with the Web Audio API, so there are no audio
// files to ship: a gentle music-box lullaby plus tiny pops, sparkles and chimes.

export type Sfx = "pop" | "sparkle" | "open" | "success" | "flip" | "boop";

let ctx: AudioContext | null = null;
let musicBus: GainNode | null = null;
let sfxBus: GainNode | null = null;
let musicTimer: number | null = null;
let nextNoteTime = 0;
let step = 0;

const SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function freq(note: string): number {
  const m = /^([A-G])([#b])?(\d)$/.exec(note);
  if (!m) return 440;
  const semis = SEMITONES[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  const midi = 12 * (parseInt(m[3], 10) + 1) + semis;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function ensureContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  ctx = new Ctor();

  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);

  // Soft echo that turns plain notes into a dreamy music box
  const echo = ctx.createDelay(1);
  echo.delayTime.value = 0.34;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.34;
  const tone = ctx.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 2600;
  echo.connect(tone);
  tone.connect(feedback);
  feedback.connect(echo);
  const wet = ctx.createGain();
  wet.gain.value = 0.38;
  tone.connect(wet);
  wet.connect(master);

  musicBus = ctx.createGain();
  musicBus.gain.value = 0.2;
  musicBus.connect(master);
  musicBus.connect(echo);

  sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.32;
  sfxBus.connect(master);
  sfxBus.connect(echo);

  return ctx;
}

/** Call from a user gesture (click / tap) so browsers allow audio. */
export function unlockAudio(): void {
  const c = ensureContext();
  if (c && c.state === "suspended") void c.resume();
}

export function suspendAudio(): void {
  if (ctx && ctx.state === "running") void ctx.suspend();
}

export function resumeAudio(): void {
  if (ctx && ctx.state === "suspended") void ctx.resume();
}

function pluck(
  bus: GainNode,
  note: string | number,
  when: number,
  volume: number,
  length: number,
  type: OscillatorType = "sine",
) {
  if (!ctx) return;
  const f = typeof note === "number" ? note : freq(note);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(volume, when + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + length);
  gain.connect(bus);

  const body = ctx.createOscillator();
  body.type = type;
  body.frequency.value = f;
  body.connect(gain);
  body.start(when);
  body.stop(when + length + 0.05);

  // A quiet octave above gives the bell-like "music box" shimmer
  const shimmer = ctx.createOscillator();
  shimmer.type = "sine";
  shimmer.frequency.value = f * 2;
  const shimmerGain = ctx.createGain();
  shimmerGain.gain.value = 0.22;
  shimmer.connect(shimmerGain);
  shimmerGain.connect(gain);
  shimmer.start(when);
  shimmer.stop(when + length + 0.05);
}

/* ------------------------------- Sound effects ------------------------------ */

export function playSfx(kind: Sfx): void {
  const c = ensureContext();
  if (!c || !sfxBus || c.state !== "running") return;
  const t = c.currentTime;

  switch (kind) {
    case "pop": {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(720 + Math.random() * 160, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.12);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.5, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      osc.connect(gain);
      gain.connect(sfxBus);
      osc.start(t);
      osc.stop(t + 0.16);
      break;
    }
    case "sparkle":
      ["E6", "G6", "C7"].forEach((n, i) => pluck(sfxBus!, n, t + i * 0.07, 0.22, 0.5, "triangle"));
      break;
    case "open":
      ["C5", "E5", "G5", "C6", "E6"].forEach((n, i) => pluck(sfxBus!, n, t + i * 0.09, 0.3, 0.9));
      break;
    case "success":
      ["C5", "E5", "G5", "C6"].forEach((n, i) => pluck(sfxBus!, n, t + i * 0.11, 0.34, 1.4));
      ["E6", "G6"].forEach((n, i) => pluck(sfxBus!, n, t + 0.5 + i * 0.12, 0.2, 1.2, "triangle"));
      break;
    case "flip": {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(900, t + 0.1);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.connect(gain);
      gain.connect(sfxBus);
      osc.start(t);
      osc.stop(t + 0.14);
      break;
    }
    case "boop":
      pluck(sfxBus, "G4", t, 0.35, 0.22, "triangle");
      break;
  }
}

/* -------------------------------- Music box -------------------------------- */

// C - Am - F - G, twice, with a gentle melody on top. Original little lullaby.
const CHORDS: [string, string, string, string][] = [
  ["C4", "E4", "G4", "C5"],
  ["A3", "C4", "E4", "A4"],
  ["F3", "A3", "C4", "F4"],
  ["G3", "B3", "D4", "G4"],
];
const ARPEGGIO = [0, 1, 2, 3, 2, 1, 2, 1];
const MELODY: string[][] = [
  ["E5", "G5", "C6", "G5"],
  ["E5", "A5", "C6", "A5"],
  ["F5", "A5", "C6", "A5"],
  ["D5", "G5", "B5", "G5"],
  ["G5", "E5", "G5", "C6"],
  ["A5", "C6", "E6", "C6"],
  ["A5", "C6", "F6", "C6"],
  ["G5", "B5", "D6", "G5"],
];
const BPM = 78;
const EIGHTH = 60 / BPM / 2;

function scheduleMusic() {
  if (!ctx || !musicBus) return;
  while (nextNoteTime < ctx.currentTime + 0.25) {
    const bar = Math.floor(step / 8) % MELODY.length;
    const inBar = step % 8;
    const chord = CHORDS[bar % CHORDS.length];

    pluck(musicBus, chord[ARPEGGIO[inBar]], nextNoteTime, 0.22, 1.1);
    if (inBar % 2 === 0) {
      pluck(musicBus, MELODY[bar][inBar / 2], nextNoteTime, 0.34, 1.5, "triangle");
    }
    if (inBar === 0) {
      pluck(musicBus, chord[0].replace(/\d/, (d) => String(parseInt(d, 10) - 1)), nextNoteTime, 0.2, 2.2);
    }

    nextNoteTime += EIGHTH;
    step += 1;
  }
}

export function startMusicBox(): void {
  const c = ensureContext();
  if (!c || musicTimer !== null) return;
  if (c.state === "suspended") void c.resume();
  nextNoteTime = c.currentTime + 0.1;
  step = 0;
  scheduleMusic();
  musicTimer = window.setInterval(scheduleMusic, 60);
}

export function stopMusicBox(): void {
  if (musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
}
