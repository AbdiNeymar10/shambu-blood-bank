export type NavLink = {
  readonly href: string;
  readonly label: string;
};

export type FooterLinkGroup = {
  readonly title: string;
  readonly links: readonly NavLink[];
};

export type SocialLink = {
  readonly href: string;
  readonly label: string;
};

export const NAV_LINKS: readonly NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/donate", label: "Donate" },
  { href: "/request", label: "Request Blood" },
  { href: "/availability", label: "Availability" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const NAVBAR_CTA = {
  donor: { href: "/donate", label: "Become a Donor" },
  emergency: { href: "/request?priority=emergency", label: "Emergency Request" },
} as const;

export const FOOTER_LINK_GROUPS: readonly FooterLinkGroup[] = [
  {
    title: "Quick Links",
    links: NAV_LINKS,
  },
  {
    title: "Support",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/faq", label: "FAQs" },
      { href: "/volunteer", label: "Volunteer" },
    ],
  },
] as const;

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://x.com", label: "X" },
  { href: "https://linkedin.com", label: "LinkedIn" },
] as const;

export const CONTACT_INFO = {
  email: "support@shambubloodbank.org",
  phone: "+91 98765 43210",
  emergency: "+91 90000 00000",
  address: "Shambu Blood Bank, City Center, India",
  officeHours: "Mon - Sat, 8:00 AM - 8:00 PM",
} as const;
