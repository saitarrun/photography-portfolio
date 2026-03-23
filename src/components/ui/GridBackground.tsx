"use client";

import { motion } from "framer-motion";

export function GridBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(circle at 50% 50%, black, transparent 80%)",
        }}
      />
      
      {/* Subtle perspective distortion simulation */}
      <div 
        className="absolute inset-0 h-[200%] w-[200%] -top-[50%] -left-[50%]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,165,0,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,165,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          transform: "perspective(1000px) rotateX(60deg)",
          maskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
    </div>
  );
}
