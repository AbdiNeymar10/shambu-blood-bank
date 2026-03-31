"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { transitions } from "@/lib/motion";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{
        duration: transitions.layout.duration,
        ease: transitions.layout.ease,
      }}
    >
      {children}
    </MotionConfig>
  );
}
