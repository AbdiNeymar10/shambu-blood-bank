"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch fix
   React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
        <div className="h-5 w-5 rounded-full bg-muted-foreground/20 animate-pulse" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "relative rounded-full w-10 h-10 transition-all duration-500",
        "bg-white/5 dark:bg-black/20 border border-border/40",
        "hover:border-primary/50 hover:bg-primary/5",
        "group overflow-hidden shadow-sm hover:shadow-md hover:shadow-primary/10"
      )}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolvedTheme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
            exit={{ y: -20, opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-foreground"
          >
            <Moon className="h-5 w-5 fill-current text-blue-400 dark:text-blue-300" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
            exit={{ y: -20, opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-foreground"
          >
            <Sun className="h-5 w-5 fill-current text-orange-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle hover glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Button>
  );
}
