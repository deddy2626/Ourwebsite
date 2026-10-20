// Next.js adds `basePath` to <Link>, <Image> and its own bundles, but not to plain
// <img> / <video> / `new Audio()` URLs. Wrap any `/public` path in asset() so it still
// resolves when the site is served from a sub-path (GitHub Pages project sites).
// NEXT_PUBLIC_BASE_PATH is empty for local dev and Vercel, so asset("/x.png") === "/x.png" there.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
