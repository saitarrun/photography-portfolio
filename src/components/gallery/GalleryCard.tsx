import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Photo } from "@/types/database";

interface GalleryCardProps {
  photo: Photo;
  index: number;
  onClick: () => void;
}

export function GalleryCard({ photo, index, onClick }: GalleryCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: (index % 3) * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="break-inside-avoid group cursor-pointer perspective-1000"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/5" style={{ transform: "translateZ(50px)" }}>
        <Image
          src={photo.image_url}
          alt={photo.alt_text || photo.title || "Photography"}
          width={800}
          height={600}
          className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={100}
          unoptimized
        />
        {/* Glassmorphic Hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 backdrop-blur-[2px] transition-all duration-500 group-hover:opacity-100 group-hover:backdrop-blur-sm">
          <div style={{ transform: "translateZ(30px)" }} className="translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
            {photo.title && (
              <p className="font-display text-lg font-medium text-on-surface">
                {photo.title}
              </p>
            )}
            {photo.caption && (
              <p className="mt-2 font-body text-xs text-on-surface-variant line-clamp-2 leading-relaxed opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
                {photo.caption}
              </p>
            )}
            <div className="mt-4 h-px w-0 bg-primary transition-all duration-700 delay-200 group-hover:w-full" />
          </div>
        </div>
        
        {/* Subtle inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
      </div>
    </motion.div>
  );
}
