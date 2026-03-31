/**
 * Static navigation / IA — replace with CMS or route config when needed.
 */

export type NavLink = {
  readonly href: string;
  readonly label: string;
};

export const NAV_LINKS: readonly NavLink[] = [
  { href: "#donate", label: "Donate" },
  { href: "#request", label: "Request blood" },
  { href: "#about", label: "About" },
] as const;
