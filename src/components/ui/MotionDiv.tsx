"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import type { Variants } from "framer-motion";
import { fadeInUp } from "@/lib/utils/motion";

interface MotionDivProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function MotionDiv({
  children,
  variants = fadeInUp,
  className,
  delay = 0,
  once = true,
}: MotionDivProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
