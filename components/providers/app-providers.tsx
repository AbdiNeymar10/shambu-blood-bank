"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { transitions } from "@/lib/motion";
import { ThemeProvider } from "./theme-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig
        reducedMotion="user"
        transition={{
          duration: transitions.layout.duration,
          ease: transitions.layout.ease,
        }}
      >
        {children}
      </MotionConfig>
    </ThemeProvider>
  );
}
