/**
 * Application configuration — single source of truth for branding and URLs.
 * Use `getSiteUrl()` anywhere a canonical absolute URL is required (metadata, sitemap, OG).
 */

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export const siteConfig = {
  name: "Shambu Blood Bank",
  shortName: "Shambu",
  description:
    "Shambu Blood Bank connects donors and patients with safe, timely blood donation and blood request services.",
  tagline: "Donate life. Respond with care.",
  locale: "en_US",
  organization: {
    type: "MedicalOrganization" as const,
  },
} as const;

/** Matches `app/globals.css` surface backgrounds for browser chrome hints. */
export const themeColor = {
  light: "#fafafa",
  dark: "#1a1a1f",
} as const;
