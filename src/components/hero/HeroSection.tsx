"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { HeroContent } from "./HeroContent";
import { useIsMobile } from "@/lib/hooks/useMediaQuery";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((mod) => ({ default: mod.HeroCanvas })),
  { ssr: false }
);

interface HeroSectionProps {
  imageUrl?: string;
}

export function HeroSection({ imageUrl }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const showCanvas = !isMobile && !reducedMotion;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const backgroundY = useTransform(smoothScroll, [0, 1], ["0%", "20%"]);

  return (
    <section ref={sectionRef} className="relative h-dvh w-full overflow-hidden">
      {/* Background Image Layer */}
      <motion.div 
        className="absolute inset-0 z-0 h-[120%]"
        style={{ y: backgroundY }}
      >
        <Image
          src={
            imageUrl ||
            "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80"
          }
          alt="Hero photography"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={100}
          unoptimized
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      </motion.div>

      {/* Subtle amber gradient at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent z-[1]" />

      {/* 3D Canvas Layer */}
      {showCanvas && <HeroCanvas />}

      {/* Content Layer */}
      <HeroContent />
    </section>
  );
}
