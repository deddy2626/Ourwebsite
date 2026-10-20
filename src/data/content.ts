// ✏️ Everything you read on the site lives here. Change the words, dates and photos
// below and the whole website updates. (No code knowledge needed, just edit the text!)

import { asset } from "@/lib/asset";

export const HER_NAME = "Appu";
export const FROM = "Your favorite person";

/** The day it all started. Format: YYYY-MM-DD */
export const START_DATE = "2025-02-02";

/**
 * Want your own song instead of the built-in music box?
 * 1. Put an mp3 in public/audio/ (for example public/audio/our-song.mp3)
 * 2. Replace `null` below with: { src: asset("/audio/our-song.mp3"), title: "Song name", artist: "Artist" }
 */
export const OUR_SONG: { src: string; title: string; artist: string } | null = null;

export const LOADER_MESSAGES = [
  "Gathering our memories…",
  "Counting all the kisses…",
  "Sprinkling extra sparkles…",
  "Polishing your crown…",
  "Warming up the hugs…",
  "Almost there, cutie…",
];

export const LOVE_WORDS = [
  "I love you",
  "Te amo",
  "Je t'aime",
  "Ti amo",
  "Ich liebe dich",
  "Aishiteru",
  "Saranghae",
  "Wo ai ni",
  "Main tumse pyaar karta hoon",
  "Seni seviyorum",
];

/* -------------------------------- Timeline -------------------------------- */

export interface Milestone {
  id: string;
  date: string;
  title: string;
  tag: string;
  body: string;
  emoji: string;
}

// Tip: swap these for your real story. Add, remove or reorder entries and the page follows.
export const MILESTONES: Milestone[] = [
  {
    id: "hello",
    date: "Before it was us",
    title: "Our First Hello",
    tag: "Where it all began",
    body: "I didn't know it yet, but somewhere in an ordinary day my whole world quietly started leaning toward you. I've been smiling about it ever since.",
    emoji: "👋",
  },
  {
    id: "us",
    date: "February 2, 2025",
    title: "The Day We Became Us",
    tag: "Making it official",
    body: "The best decision I ever made. Since this day every ordinary moment has felt a little more like a tiny celebration.",
    emoji: "💞",
  },
  {
    id: "date",
    date: "Our first date",
    title: "Butterflies & Giggles",
    tag: "Nervous but so happy",
    body: "Nervous hands, matching smiles and absolutely no idea what to say. I couldn't stop grinning the whole time, and I still can't when I think about it.",
    emoji: "🦋",
  },
  {
    id: "bowling",
    date: "Bowling nights",
    title: "Strikes, Gutters & You",
    tag: "Silly competitive couple",
    body: "I don't even care who wins. Watching you do your tiny victory dance is the real prize every single time.",
    emoji: "🎳",
  },
  {
    id: "forever",
    date: "Today & every day",
    title: "Still Falling For You",
    tag: "Growing together",
    body: "More memories are loading… and I can't wait to make every single one of them with you.",
    emoji: "🌷",
  },
];

/* --------------------------------- Gallery -------------------------------- */

export interface GalleryItem {
  id: string;
  category: string;
  title: string;
  src: string;
  poster?: string;
  isVideo: boolean;
  /** Used to size the polaroid so nothing gets awkwardly cropped */
  ratio: "landscape" | "portrait" | "wide";
  emoji: string;
}

export const GALLERY: GalleryItem[] = [
  { id: "1", category: "Dates", title: "Romantic Dinner Date", src: asset("/images/gallery/1.jpeg"), isVideo: false, ratio: "landscape", emoji: "🍝" },
  { id: "2", category: "Travels", title: "Our Travel Highlights", src: asset("/images/gallery/2.mp4"), poster: asset("/images/posters/gallery-2.jpg"), isVideo: true, ratio: "wide", emoji: "✈️" },
  { id: "5", category: "Anniversaries", title: "Celebrating Milestones", src: asset("/images/gallery/5.jpeg"), isVideo: false, ratio: "portrait", emoji: "🥂" },
  { id: "3", category: "Sunsets", title: "Warm Evening Skies", src: asset("/images/gallery/3.mp4"), poster: asset("/images/posters/gallery-3.jpg"), isVideo: true, ratio: "wide", emoji: "🌅" },
  { id: "6", category: "Bowling Days", title: "Bowling Nights", src: asset("/images/gallery/6.jpeg"), isVideo: false, ratio: "portrait", emoji: "🎳" },
  { id: "4", category: "Silly Faces", title: "Fun & Laughs Together", src: asset("/images/gallery/4.mp4"), poster: asset("/images/posters/gallery-4.jpg"), isVideo: true, ratio: "wide", emoji: "🤪" },
];

/** Images the loading screen waits for (videos are too big to block on). */
export const PRELOAD_IMAGES = [
  asset("/images/hero/2.jpeg"),
  asset("/images/posters/hero-1.jpg"),
  ...GALLERY.filter((g) => !g.isVideo).map((g) => g.src),
];

/* -------------------------------- Open when -------------------------------- */

export interface OpenWhenLetter {
  id: string;
  label: string;
  emoji: string;
  message: string;
}

export const OPEN_WHEN: OpenWhenLetter[] = [
  {
    id: "miss",
    label: "you miss me",
    emoji: "🥺",
    message: "I'm missing you right now too, probably at this very second. Close your eyes, take a deep breath, and imagine my arms around you. Squeeze. Okay, that was me. See you very soon.",
  },
  {
    id: "sad",
    label: "you're sad",
    emoji: "☁️",
    message: "It's okay to have a cloudy day. You don't have to be strong all the time. I'm right here, and I'm so proud of you. Drink some water, eat a snack, and know that you are loved so, so much.",
  },
  {
    id: "sleep",
    label: "you can't sleep",
    emoji: "🌙",
    message: "Fluff the pillow, hug something soft, and let your brain go quiet. Tomorrow will be kinder. I'm sending you the warmest goodnight wishes and a thousand tiny forehead kisses.",
  },
  {
    id: "happy",
    label: "you're happy",
    emoji: "🌈",
    message: "Yay!! Your happiness is my favorite thing in the whole world. Do a little twirl for me. Whatever made you smile today, I'm so glad it did. Keep shining, cutie.",
  },
  {
    id: "doubt",
    label: "you doubt yourself",
    emoji: "✨",
    message: "Listen to me: you are smart, kind, beautiful and so much stronger than you think. The way you see yourself is not the way I see you. I see someone extraordinary.",
  },
];

/* ------------------------------ Award section ------------------------------ */

export const STATS = [
  { emoji: "🌸", label: "Cuteness", value: "off the charts" },
  { emoji: "🧸", label: "Hug Quality", value: "100%" },
  { emoji: "💖", label: "Kindness", value: "∞" },
  { emoji: "😊", label: "Making Me Smile", value: "1000%" },
  { emoji: "🎀", label: "Being My Favorite", value: "undefeated" },
];

export const REASONS = [
  "You make ordinary days feel like tiny adventures.",
  "Your smile fixes my worst day in about two seconds.",
  "You're cute even when you're grumpy. Especially then.",
  "You're my favorite person to do absolutely nothing with.",
  "Your hugs are the best place in the whole world.",
  "You make me want to be a better person.",
  "You're the first person I want to tell everything to.",
  "Loving you is the easiest thing I've ever done.",
  "You're the best part of every single day.",
];
