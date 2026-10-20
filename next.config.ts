import type { NextConfig } from "next";

// The GitHub Pages workflow (.github/workflows/deploy-pages.yml) sets GITHUB_PAGES and
// NEXT_PUBLIC_BASE_PATH. When they're unset (local dev, Vercel) nothing below changes.
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // Pages only serves static files, so emit a static export into ./out
  output: isGitHubPages ? "export" : undefined,
  // Project sites live under /<repo-name>, e.g. https://<user>.github.io/Our-Website1/
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
