"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.6 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function HeroContent() {
  return (
    <motion.div
      className="relative z-10 flex h-full flex-col justify-end pb-24 md:pb-32 px-6 md:px-12 lg:px-20"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Editorial offset — content sits left */}
        <div className="max-w-2xl">
          {/* Overline */}
          <motion.p
            variants={item}
            className="font-body text-[10px] uppercase tracking-[0.35em] text-primary mb-6"
          >
            Street, Nature &amp; Landscape
          </motion.p>

          {/* Main headline */}
          <motion.h1
            variants={item}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight text-on-surface"
          >
            The Obsidian
            <br />
            <span className="text-primary">Gallery</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={item}
            className="mt-6 md:mt-8 max-w-md font-body text-base md:text-lg leading-relaxed text-on-surface-variant"
          >
            Cinematic street, nature, and landscapes — capturing light,
            silence, and the raw geometry of the earth.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <Button variant="primary" href="#work">
              View Work
            </Button>
            <Button variant="secondary" href="#about">
              About the Photographer
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="font-body text-[9px] uppercase tracking-[0.3em] text-on-surface-variant">
          Scroll
        </span>
        <motion.div
          className="h-10 w-px bg-gradient-to-b from-on-surface-variant to-transparent"
          animate={{ scaleY: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}
