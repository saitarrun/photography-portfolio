"use client";

import { motion } from "framer-motion";

export function TopographicLines() {
  return (
    <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none">
      <svg
        viewBox="0 0 1000 1000"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Generate multiple organic paths for topographic feel */}
        {[...Array(15)].map((_, i) => (
          <motion.path
            key={i}
            d={`M ${-100} ${200 + i * 60} Q ${300 + Math.sin(i) * 100} ${150 + i * 50} ${500} ${200 + i * 60} T ${1100} ${250 + i * 60}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-primary"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: 0.5,
              d: [
                `M ${-100} ${200 + i * 60} Q ${300 + Math.sin(i) * 100} ${150 + i * 50} ${500} ${200 + i * 60} T ${1100} ${250 + i * 60}`,
                `M ${-100} ${210 + i * 60} Q ${320 + Math.sin(i) * 120} ${140 + i * 50} ${510} ${210 + i * 60} T ${1100} ${240 + i * 60}`,
                `M ${-100} ${200 + i * 60} Q ${300 + Math.sin(i) * 100} ${150 + i * 50} ${500} ${200 + i * 60} T ${1100} ${250 + i * 60}`,
              ]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
