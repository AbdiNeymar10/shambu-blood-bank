"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoProps {
  variant?: "full" | "icon" | "stacked";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  href?: string;
  animate?: boolean;
}

export function LogoIcon({
  size = "md",
  className,
  animate = true,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
}) {
  const sizeMap = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
    xl: "size-12",
  };

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "shrink-0 drop-shadow-[0_2px_8px_rgba(225,29,72,0.4)] transition-transform duration-300 group-hover:scale-105",
        sizeMap[size],
        animate && "group-hover:animate-pulse",
        className
      )}
    >
      <defs>
        <linearGradient
          id="sbbDropGradient"
          x1="24"
          y1="4"
          x2="24"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="40%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#9F1239" />
        </linearGradient>
        <linearGradient
          id="sbbHeartGradient"
          x1="16"
          y1="18"
          x2="32"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFE4E6" />
        </linearGradient>
      </defs>

      {/* Outer Blood Droplet */}
      <path
        d="M24 4C24 4 10 20.5 10 31.5C10 38.4036 16.268 44 24 44C31.732 44 38 38.4036 38 31.5C38 20.5 24 4 24 4Z"
        fill="url(#sbbDropGradient)"
      />

      {/* Droplet Glass Highlight */}
      <path
        d="M24 7.5C24 7.5 14 20 14 30.5C14 33.5 15.5 36.5 18 38.5C16 36.5 15 33.5 15 30.5C15 21 24 9 24 9Z"
        fill="white"
        fillOpacity="0.3"
      />

      {/* Embedded White Heart */}
      <path
        d="M24 35.5C24 35.5 15.5 30 15.5 24.5C15.5 22 17.5 20 20 20C21.8 20 23.2 21 24 22.1C24.8 21 26.2 20 28 20C30.5 20 32.5 22 32.5 24.5C32.5 30 24 35.5 24 35.5Z"
        fill="url(#sbbHeartGradient)"
      />

      {/* Vital ECG Pulse Wave */}
      <path
        d="M17 25.5H19.5L21 22.5L23.5 28.5L25.5 23.5L27 25.5H29.5"
        stroke="#E11D48"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  variant = "full",
  size = "md",
  className,
  showText = true,
  href = "/",
  animate = true,
}: LogoProps) {
  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const content = (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 group cursor-pointer select-none transition-all duration-200",
        className
      )}
    >
      <LogoIcon size={size} animate={animate} />
      {showText && variant !== "icon" && (
        <div className="flex flex-col justify-center leading-tight">
          <span
            className={cn(
              "font-display font-bold tracking-tight text-foreground transition-colors group-hover:text-primary",
              textSizes[size]
            )}
          >
            Shambu{" "}
            <span className="text-primary font-extrabold bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
              Blood Bank
            </span>
          </span>
          {variant === "stacked" && (
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest -mt-0.5">
              Saving Lives 24/7
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
