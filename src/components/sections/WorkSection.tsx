"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LocationCard } from "@/components/locations/LocationCard";
import type { Location } from "@/types/database";

interface WorkSectionProps {
  locations: (Location & { photo_count: number })[];
}

export function WorkSection({ locations }: WorkSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="work" className="relative pt-16 md:pt-24 pb-32 md:pb-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
        {/* Section header — editorial offset */}
        <div className="mb-20 md:mb-32 max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="font-body text-[10px] uppercase tracking-[0.35em] text-primary mb-6"
          >
            Selected Work
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-on-surface"
          >
            Locations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 font-body text-sm md:text-base leading-relaxed text-on-surface-variant"
          >
            Each destination is a chapter — a collection of moments where light,
            street, and nature conspired to create something extraordinary.
          </motion.p>
        </div>

        {/* Location cards grid — 2 columns with staggered offsets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {locations.map((location, i) => (
            <LocationCard key={location.id} location={location} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
