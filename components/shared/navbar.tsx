"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavLink } from "@/data";
import { NAVBAR_CTA, NAV_LINKS } from "@/data";
import { cn } from "@/lib/utils";
import { PrimaryButton } from "./primary-button";
import { SecondaryButton } from "./secondary-button";
import { Container } from "./container";

export type NavbarProps = {
  brandLabel?: string;
  links?: readonly NavLink[];
  className?: string;
};

export function Navbar({
  brandLabel = "Shambu Blood Bank",
  links = NAV_LINKS,
  className,
}: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent transition-all duration-300",
        scrolled &&
          "border-border/60 bg-background/70 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.15)] backdrop-blur-xl",
        className
      )}
    >
      <Container className="flex h-18 items-center justify-between py-3">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Heart className="size-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            {brandLabel}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md",
                isActive(link.href) && "text-foreground"
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.div
                  layoutId="nav-active-indicator"
                  className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <SecondaryButton asChild size="sm">
            <Link href={NAVBAR_CTA.donor.href}>{NAVBAR_CTA.donor.label}</Link>
          </SecondaryButton>
          <PrimaryButton asChild size="sm">
            <Link href={NAVBAR_CTA.emergency.href}>
              {NAVBAR_CTA.emergency.label}
            </Link>
          </PrimaryButton>
        </div>

        <button
          className="inline-flex size-10 items-center justify-center rounded-md border border-border/70 text-foreground lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          type="button"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="border-t border-border/60 bg-background/95 backdrop-blur-xl lg:hidden overflow-hidden"
          >
            <Container className="space-y-5 py-5">
              <nav className="grid gap-1.5">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      isActive(link.href) && "bg-primary/5 text-foreground border-l-2 border-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="grid gap-2 sm:grid-cols-2">
                <SecondaryButton asChild>
                  <Link href={NAVBAR_CTA.donor.href}>{NAVBAR_CTA.donor.label}</Link>
                </SecondaryButton>
                <PrimaryButton asChild>
                  <Link href={NAVBAR_CTA.emergency.href}>
                    {NAVBAR_CTA.emergency.label}
                  </Link>
                </PrimaryButton>
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
