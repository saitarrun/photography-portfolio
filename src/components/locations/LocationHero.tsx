"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface LocationHeroProps {
  name: string;
  description?: string | null;
  coverImage?: string | null;
}

export function LocationHero({
  name,
  description,
  coverImage,
}: LocationHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={
            coverImage ||
            "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80"
          }
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={100}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-12 lg:px-20"
        style={{ opacity }}
      >
        <div className="max-w-[1600px] mx-auto w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-[10px] uppercase tracking-[0.35em] text-primary mb-4"
          >
            Location
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] text-on-surface"
          >
            {name}
          </motion.h1>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 max-w-lg font-body text-sm md:text-base leading-relaxed text-on-surface-variant"
            >
              {description}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
