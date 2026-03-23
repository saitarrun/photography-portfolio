"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Location } from "@/types/database";

interface LocationCardProps {
  location: Location & { photo_count: number };
  index: number;
}

export function LocationCard({ location, index }: LocationCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.9,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="perspective-1000 rounded-2xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/locations/${location.slug}`} className="group block h-full">
        <motion.div 
          className="relative overflow-hidden rounded-2xl shadow-cinematic bg-background border border-white/5"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Image */}
          <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden" style={{ transform: "translateZ(20px)" }}>
            <Image
              src={
                location.cover_image_url ||
                "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80"
              }
              alt={location.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={100}
              unoptimized
            />
            {/* Hover amber wash */}
            <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/5" />
            {/* Bottom scrim */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
          </div>

          {/* Content overlay */}
          <div 
            className="absolute inset-x-0 bottom-0 p-6 md:p-8"
            style={{ transform: "translateZ(40px)" }}
          >
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-primary mb-2 opacity-0 -translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
              {location.photo_count} photographs
            </p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-on-surface">
              {location.name}
            </h3>
            <p className="mt-2 font-body text-xs md:text-sm leading-relaxed text-on-surface-variant line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
              {location.short_description}
            </p>
            <div className="mt-4 h-px w-0 bg-primary transition-all duration-700 delay-100 group-hover:w-16" />
          </div>

          {/* Glare effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
