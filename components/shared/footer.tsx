import {
  Clock3,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldPlus,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import type { FooterLinkGroup, SocialLink } from "@/data";
import { CONTACT_INFO, FOOTER_LINK_GROUPS, SOCIAL_LINKS } from "@/data";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { StatusPill } from "./status-pill";

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook,
  Instagram,
  LinkedIn: Linkedin,
  X: Twitter,
};

export type FooterProps = {
  className?: string;
  brandLabel?: string;
  brandDescription?: string;
  quickLinks?: readonly FooterLinkGroup[];
  socialLinks?: readonly SocialLink[];
};

export function Footer({
  className,
  brandLabel = "Shambu Blood Bank",
  brandDescription = "Trusted blood donation and emergency response network built to connect donors and patients with speed, dignity, and care.",
  quickLinks = FOOTER_LINK_GROUPS,
  socialLinks = SOCIAL_LINKS,
}: FooterProps) {
  return (
    <footer className={cn("mt-auto border-t border-border/60 bg-card/40", className)}>
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <p className="font-display text-2xl font-semibold tracking-tight">
              {brandLabel}
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              {brandDescription}
            </p>
            <StatusPill status="active">24/7 Emergency Line Active</StatusPill>
          </div>

          {quickLinks.map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="inline-flex items-start gap-2 text-muted-foreground">
                <Mail className="mt-0.5 size-4" />
                {CONTACT_INFO.email}
              </li>
              <li className="inline-flex items-start gap-2 text-muted-foreground">
                <Phone className="mt-0.5 size-4" />
                {CONTACT_INFO.phone}
              </li>
              <li className="inline-flex items-start gap-2 text-muted-foreground">
                <ShieldPlus className="mt-0.5 size-4 text-destructive" />
                Emergency: {CONTACT_INFO.emergency}
              </li>
              <li className="inline-flex items-start gap-2 text-muted-foreground">
                <Clock3 className="mt-0.5 size-4" />
                {CONTACT_INFO.officeHours}
              </li>
              <li className="inline-flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 size-4" />
                {CONTACT_INFO.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Shambu Blood Bank. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const SocialIcon = socialIconMap[social.label] ?? Twitter;

              return (
                <Link
                  key={social.href}
                  href={social.href}
                  className="inline-flex size-8 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:text-primary"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                >
                  <SocialIcon className="size-4" />
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </footer>
  );
}
