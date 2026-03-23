"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GridBackground } from "@/components/ui/GridBackground";

interface Experience {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  description: string;
  coursework: string;
}

interface ExperienceSectionProps {
  experiences: any[]; // Using any because it's coming from DB JSONB
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const list = (experiences || []) as Experience[];

  return (
    <section 
      ref={containerRef}
      className="relative bg-background py-24 md:py-32 overflow-hidden"
    >
      <GridBackground />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-body text-sm uppercase tracking-[0.35em] text-primary mb-16 md:mb-24"
        >
          Professional & Academic Path
        </motion.p>

        <div className="space-y-12 md:space-y-20 max-w-5xl">
          {list.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative group"
            >
              {/* Ghost Number */}
              <span className="absolute -left-12 -top-12 md:-left-20 md:-top-20 font-display text-[120px] md:text-[200px] font-bold text-white/[0.03] select-none pointer-events-none group-hover:text-primary/5 transition-colors duration-700">
                {item.number}
              </span>

              {/* Card */}
              <div className="relative p-8 md:p-12 bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-md overflow-hidden transition-all duration-500 hover:bg-white/[0.04] hover:border-primary/20">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col gap-6 md:gap-8">
                  {/* Top Row: Title and Bullet */}
                  <div className="flex items-start gap-4">
                    <div className="mt-2.5 h-3 w-3 rounded-full border-2 border-primary bg-primary/20 relative">
                        <div className="absolute inset-0 bg-primary blur-sm rounded-full animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">
                        {item.title}
                      </h3>
                      <p className="font-body text-xs md:text-sm tracking-[0.2em] text-on-surface-variant/70 uppercase">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Pills */}
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 font-mono text-[10px] md:text-xs tracking-widest text-on-surface-variant uppercase">
                      {item.date}
                    </div>
                    <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 font-mono text-[10px] md:text-xs tracking-widest text-on-surface-variant uppercase">
                      {item.location}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <p className="font-body text-sm md:text-base leading-[1.8] text-white/80 max-w-3xl">
                      {item.description}
                    </p>
                    
                    {item.coursework && (
                      <div className="pt-4 border-t border-white/[0.05]">
                        <p className="font-body text-xs leading-relaxed text-on-surface-variant/60">
                          <span className="text-on-surface-variant uppercase tracking-widest mr-2">Coursework:</span>
                          {item.coursework}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
