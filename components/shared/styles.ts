import { cva } from "class-variance-authority";

export const surfaceVariants = cva(
  "rounded-2xl border border-border/60 bg-card/90 shadow-sm transition-all duration-200",
  {
    variants: {
      tone: {
        default: "",
        muted: "bg-muted/40",
        glass: "border-white/20 bg-white/60 backdrop-blur-xl",
      },
      interactive: {
        true: "hover:-translate-y-0.5 hover:shadow-lg",
        false: "",
      },
      padding: {
        none: "p-0",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      tone: "default",
      interactive: false,
      padding: "none",
    },
  }
);
