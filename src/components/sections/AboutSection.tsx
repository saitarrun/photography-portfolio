"use client";

import Image from "next/image";
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef } from "react";
import type { PhotographerProfile } from "@/types/database";

interface AboutSectionProps {
  profile: PhotographerProfile;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function AmbientLight() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
    </div>
  );
}

function FloatingFragment({ className, delay = 0, speed = 1 }: { className?: string, delay?: number, speed?: number }) {
  return (
    <motion.div
      className={`absolute h-32 w-32 rounded-full blur-[100px] bg-primary/20 pointer-events-none z-0 ${className}`}
      animate={{
        x: [0, 50 * speed, 0],
        y: [0, 30 * speed, 0],
      }}
      transition={{
        duration: 15 / speed,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

function Coordinates() {
  const coords = [
    "36.0652° N, 112.1371° W",
    "37.8651° N, 119.5383° W",
    "36.2427° N, 116.8258° W",
    "38.7331° N, 109.5925° W",
  ];

  return (
    <div className="absolute top-10 right-10 z-0 flex flex-col items-end gap-1 opacity-10 font-mono text-[8px] tracking-widest text-primary uppercase select-none hidden lg:flex">
      {coords.map((c, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: i * 0.2 + 1 }}
        >
          {c}
        </motion.span>
      ))}
    </div>
  );
}

import { TopographicLines } from "@/components/ui/TopographicLines";

export function AboutSection({ profile }: AboutSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const achievements = (profile.achievements as string[]) || [];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const portraitY = useTransform(smoothScrollProgress, [0, 1], ["0%", "15%"]);
  const textY = useTransform(smoothScrollProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section
      ref={ref}
      id="about"
      className="relative bg-background pt-32 md:pt-48 pb-16 md:pb-24 overflow-hidden"
    >
      <AmbientLight />
      <TopographicLines />
      <Coordinates />
      
      {/* Parallax Blobs */}
      <FloatingFragment className="top-[10%] left-[5%]" delay={0} speed={0.8} />
      <FloatingFragment className="bottom-[10%] right-[10%]" delay={2} speed={1.2} />
      <FloatingFragment className="top-[40%] right-[20%]" delay={5} speed={0.5} />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
        {/* Section label */}
        <motion.p
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="font-body text-sm uppercase tracking-[0.35em] text-primary mb-16 md:mb-24"
        >
          About the Photographer
        </motion.p>

        {/* Magazine spread layout */}
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8 lg:gap-16">
          {/* Portrait — offset column */}
          <motion.div
            className="md:col-span-5 md:col-start-1"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{ y: portraitY }}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl group border border-white/5">
              <Image
                src={
                  profile.portrait_url ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                }
                alt={`Portrait of ${profile.name}`}
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              

              {/* Subtle amber wash */}
              <div className="absolute inset-0 bg-primary/5 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0" />
            </div>
          </motion.div>

          {/* Text content — offset right, pushed down */}
          <motion.div 
            className="md:col-span-6 md:col-start-7 md:pt-24"
            style={{ y: textY }}
          >
            <motion.h2
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-on-surface"
            >
              Behind the Lens
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.9,
                delay: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="mt-10 space-y-8"
            >
              {profile.bio?.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="font-body text-lg md:text-xl lg:text-2xl leading-[1.6] text-on-surface-variant font-light"
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>

            {/* Achievements */}
            {achievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.9,
                  delay: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="mt-16 pt-12 border-t border-white/5"
              >
                <p className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-10">
                  Recognition & Awards
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
                  {achievements.map((achievement, i) => (
                    <div
                      key={i}
                      className="group flex flex-col gap-3 p-6 bg-white/[0.02] border border-white/5 backdrop-blur-sm rounded-2xl transition-all duration-500 hover:bg-white/[0.05] hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 h-full"
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="font-body text-[9px] uppercase tracking-widest text-on-surface-variant">
                          Award {i + 1}
                        </span>
                      </div>
                      <span className="font-display text-sm md:text-base text-on-surface group-hover:text-on-surface transition-colors leading-relaxed">
                        {achievement}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
