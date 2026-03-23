"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref} 
      id="contact" 
      className="relative pt-32 pb-48 overflow-hidden bg-background"
    >
      {/* Grid Mesh Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-start gap-12">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-primary/80">
              Available for Projects
            </p>
          </motion.div>

          {/* Hero Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter text-white"
          >
            LET&apos;S
            <br />
            ARCHITECT
            <br />
            <span className="text-primary italic">THE FUTURE.</span>
          </motion.h2>

          {/* Bio/Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-body text-base md:text-lg leading-relaxed text-on-surface-variant max-w-2xl"
          >
            I am currently seeking new creative challenges where I can push the boundaries 
            of visual storytelling. Whether it&apos;s a commercial campaign or a 
            bespoke landscape project, I am ready to bring your vision to life.
          </motion.p>

          {/* Main CTA & Socials Grid */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-12 mt-8">
            {/* Glowing CTA Button */}
            <motion.a
              href="mailto:hello@obsidiangallery.com"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="group relative flex items-center gap-4 px-10 py-5 bg-primary text-black font-display text-lg font-bold rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(242,140,40,0.4)]"
            >
              <svg 
                className="w-6 h-6 transition-transform duration-500 group-hover:-rotate-12" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>START A CONVERSATION</span>
              <svg 
                className="w-5 h-5 transition-transform duration-500 translate-x-0 group-hover:translate-x-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.a>

            {/* Social Link Cards */}
            <div className="flex gap-4">
              {[
                { name: "Instagram", icon: "IG", url: "https://instagram.com" },
                { name: "Twitter", icon: "TW", url: "https://twitter.com" },
                { name: "YouTube", icon: "YT", url: "https://youtube.com" }
              ].map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + (i * 0.1) }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 flex items-center justify-center border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-md transition-all duration-500 hover:border-primary/50 hover:bg-white/[0.05] hover:-translate-y-1">
                    <span className="font-display text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors">
                      {social.icon}
                    </span>
                  </div>
                  <span className="font-body text-[9px] uppercase tracking-widest text-on-surface-variant/50">
                    {social.name}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
