import type { Transition } from "framer-motion";

/** Default easing — smooth, professional (Material-style standard). */
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
