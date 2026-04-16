import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PrimaryButtonProps = Omit<ButtonProps, "variant">;

export const PrimaryButton = React.forwardRef<
  HTMLButtonElement,
  PrimaryButtonProps
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="default"
    className={cn("shadow-sm hover:shadow-md", className)}
    {...props}
  />
));

PrimaryButton.displayName = "PrimaryButton";
