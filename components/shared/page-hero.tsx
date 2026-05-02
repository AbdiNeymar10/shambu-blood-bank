"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp, viewportOnce } from "@/lib/motion";
import { Container } from "./container";

export type PageHeroProps = {
  /** Main heading — plain string or use `highlight` for the colored span. */
  title: string;
  /** Word(s) to render in primary color inside the title. */
  highlight?: string;
  /** Subtitle text below the heading. */
  description: string;
  /** Visual style variant. */
  variant?: "default" | "gradient" | "muted";
  /** Center (default) or left-align. */
  align?: "center" | "left";
  /** Optional children rendered below description (e.g. search bar, CTA). */
  children?: React.ReactNode;
  className?: string;
};

const bgVariants = {
  default: "bg-muted/30",
  gradient: "bg-gradient-to-b from-primary/10 to-background",
  muted: "bg-muted/20",
} as const;

export function PageHero({
  title,
  highlight,
  description,
  variant = "default",
  align = "center",
  children,
  className,
}: PageHeroProps) {
  // Split title around highlight word if provided
  const renderTitle = () => {
    if (!highlight) return title;
    const idx = title.indexOf(highlight);
    if (idx === -1) return title;
    const before = title.slice(0, idx);
    const after = title.slice(idx + highlight.length);
    return (
      <>
        {before}
        <span className="text-primary">{highlight}</span>
        {after}
      </>
    );
  };

  return (
    <section
      className={cn(
        "pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden",
        bgVariants[variant],
        className
      )}
    >
      {/* Subtle decorative blobs for gradient variant */}
      {variant === "gradient" && (
        <>
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-accent-crimson/15 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />
        </>
      )}

      <Container
        className={cn(
          "relative z-10",
          align === "center" && "text-center"
        )}
      >
        <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-5"
          >
            {renderTitle()}
          </motion.h1>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUp}
            className={cn(
              "text-lg md:text-xl text-muted-foreground leading-relaxed",
              align === "center" && "mx-auto max-w-2xl"
            )}
          >
            {description}
          </motion.p>
          {children && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeInUp}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
}
