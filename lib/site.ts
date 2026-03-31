export const siteConfig = {
  name: "Shambu Blood Bank",
  shortName: "Shambu",
  description:
    "Shambu Blood Bank connects donors and patients with safe, timely blood donation and blood request services.",
  tagline: "Donate life. Respond with care.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  organization: {
    type: "MedicalOrganization" as const,
  },
} as const;
