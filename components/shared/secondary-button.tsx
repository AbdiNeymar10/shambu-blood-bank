import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SecondaryButtonProps = Omit<ButtonProps, "variant">;

export const SecondaryButton = React.forwardRef<
  HTMLButtonElement,
  SecondaryButtonProps
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    className={cn(
      "border-white/40 bg-white/60 backdrop-blur-sm hover:bg-white/90",
      className
    )}
    {...props}
  />
));

SecondaryButton.displayName = "SecondaryButton";
