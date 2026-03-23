"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "tertiary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  href?: string;
}

export function Button({
  variant = "primary",
  children,
  className,
  href,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-body rounded transition-all duration-300 cursor-pointer";

  const variants: Record<Variant, string> = {
    primary:
      "bg-gradient-to-r from-primary to-secondary text-background font-semibold px-8 py-4 text-sm uppercase tracking-[0.15em] hover:shadow-[0_0_30px_rgba(255,145,85,0.4)] transition-shadow duration-500",
    secondary:
      "text-on-surface group relative bg-white/5 backdrop-blur-md border border-white/10 px-8 py-4 text-sm uppercase tracking-[0.15em] hover:bg-white/10 hover:border-white/20",
    tertiary:
      "text-on-surface-variant bg-transparent backdrop-blur-sm border border-transparent text-xs uppercase tracking-[0.2em] px-4 py-2 hover:text-primary hover:border-primary/20",
  };

  const content = (
    <>
      {children}
      {variant === "secondary" && (
        <span className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
      )}
      {variant === "tertiary" && (
        <svg
          className="ml-2 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={cn(base, variants[variant], className)}
        whileHover={{ scale: variant === "primary" ? 1.02 : 1 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={cn(base, variants[variant], className)}
      whileHover={{ scale: variant === "primary" ? 1.02 : 1 }}
      whileTap={{ scale: 0.98 }}
      {...(props as object)}
    >
      {content}
    </motion.button>
  );
}
