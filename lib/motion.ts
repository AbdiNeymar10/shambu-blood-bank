import type { Transition, Variants } from "framer-motion";

/**
 * Default easing — smooth, professional (Material-style standard).
 * Keep cubic-bezier in sync with `var(--ease-standard)` in `app/globals.css`.
 */
export const easeStandard = [0.4, 0, 0.2, 1] as const;

export const transitions = {
  /** Short UI feedback (hover, tap). */
  micro: {
    duration: 0.2,
    ease: easeStandard,
  } satisfies Transition,
  /** Panels, sections, modals. */
  layout: {
    duration: 0.28,
    ease: easeStandard,
  } satisfies Transition,
  /** Hero or emphasis (use sparingly). */
  emphasis: {
    duration: 0.45,
    ease: easeStandard,
  } satisfies Transition,
} as const;

/* ------------------------------------------------------------------ */
/*  Shared animation variants — use these instead of inline objects    */
/* ------------------------------------------------------------------ */

/** Fade up from 20px below — the standard entrance for any element. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

/** Scale in from 95% — cards, modals, popovers. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

/** Stagger container — wraps children that use `fadeInUp` or `scaleIn`. */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/** Faster stagger for grids with many items. */
export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

/** Standard viewport trigger config — reuse to avoid object re-creation. */
export const viewportOnce = { once: true, margin: "-80px" as const };
