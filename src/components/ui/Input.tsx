"use client";

import { cn } from "@/lib/utils/cn";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className, id, ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("relative w-full", className)}>
      <label
        htmlFor={inputId}
        className="block text-[10px] font-body uppercase tracking-[0.2em] text-on-surface-variant mb-3"
      >
        {label}
      </label>
      <input
        id={inputId}
        className="w-full bg-transparent border-0 border-b border-outline-variant/40 pb-3 pt-1 text-on-surface font-body text-sm outline-none transition-colors duration-300 placeholder:text-outline-variant focus:border-primary"
        {...props}
      />
    </div>
  );
}
