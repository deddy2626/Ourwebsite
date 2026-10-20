const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export interface YMD {
  y: number;
  m: number; // 1-12
  d: number;
}

export function parseYMD(value: string): YMD {
  const [y, m, d] = value.split("-").map((p) => parseInt(p, 10));
  return { y, m, d };
}

// "2025-02-02" -> "February 2, 2025" (manual formatting avoids timezone/locale drift)
export function formatYMD({ y, m, d }: YMD): string {
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

const daysInMonth = (year: number, monthIndex: number) =>
  new Date(year, monthIndex + 1, 0).getDate();

// Whole calendar days between two local dates (DST-proof: compares UTC midnights)
const dayNumber = (y: number, mIndex: number, d: number) =>
  Math.floor(Date.UTC(y, mIndex, d) / 86_400_000);

export interface TogetherBreakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  /** Days until the next "monthsary" (same day-of-month as the start date) */
  daysToMonthsary: number;
  /** 0..1 progress through the current month-with-you */
  monthProgress: number;
  /** Days until the next anniversary, and how many years it will be */
  daysToAnniversary: number;
  nextAnniversaryYear: number;
}

export function togetherSince(start: YMD, now: Date): TogetherBreakdown {
  const sMonth = start.m - 1;
  let years = now.getFullYear() - start.y;
  let months = now.getMonth() - sMonth;
  let days = now.getDate() - start.d;

  if (days < 0) {
    months -= 1;
    const prevMonth = (now.getMonth() + 11) % 12;
    const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    days += daysInMonth(prevYear, prevMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const today = dayNumber(now.getFullYear(), now.getMonth(), now.getDate());
  const totalDays = today - dayNumber(start.y, sMonth, start.d);
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Monthsary: the start day-of-month, clamped for short months (the 31st -> Feb 28)
  const monthsaryIn = (year: number, monthIndex: number) =>
    Math.min(start.d, daysInMonth(year, monthIndex));
  const thisMonthDay = monthsaryIn(now.getFullYear(), now.getMonth());
  let nextY = now.getFullYear();
  let nextM = now.getMonth();
  if (now.getDate() >= thisMonthDay) {
    nextM += 1;
    if (nextM > 11) {
      nextM = 0;
      nextY += 1;
    }
  }
  const nextMonthsary = dayNumber(nextY, nextM, monthsaryIn(nextY, nextM));
  const daysToMonthsary = nextMonthsary - today;

  let prevY = nextY;
  let prevM = nextM - 1;
  if (prevM < 0) {
    prevM = 11;
    prevY -= 1;
  }
  const prevMonthsary = dayNumber(prevY, prevM, monthsaryIn(prevY, prevM));
  const monthProgress = Math.min(1, Math.max(0, (today - prevMonthsary) / (nextMonthsary - prevMonthsary)));

  // Next anniversary (today counts as 0 days to go: it's the day!)
  let annYear = now.getFullYear();
  if (dayNumber(annYear, sMonth, start.d) < today) annYear += 1;
  const daysToAnniversary = dayNumber(annYear, sMonth, start.d) - today;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDays,
    totalHours: totalDays * 24 + hours,
    totalMinutes: (totalDays * 24 + hours) * 60 + minutes,
    daysToMonthsary,
    monthProgress,
    daysToAnniversary,
    nextAnniversaryYear: annYear - start.y,
  };
}
