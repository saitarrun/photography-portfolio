"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Photo } from "@/types/database";
import { formatExif } from "@/lib/utils/format";

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const photo = photos[currentIndex];
  const exif = formatExif(photo);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1);
  }, [hasPrev, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1);
  }, [hasNext, currentIndex, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, handlePrev, handleNext]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/95 backdrop-blur-2xl"
          onClick={onClose}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Close lightbox"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="square"
              d="M6 6l12 12M6 18L18 6"
            />
          </svg>
        </button>

        {/* Image counter */}
        <div className="absolute top-6 left-6 z-10">
          <span className="font-body text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>

        {/* Navigation */}
        {hasPrev && (
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 z-10 p-3 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Previous photo"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path strokeLinecap="square" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {hasNext && (
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 z-10 p-3 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Next photo"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path strokeLinecap="square" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-6xl mx-auto px-16 py-20">
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full"
          >
            <Image
              src={photo.image_url}
              alt={photo.alt_text || photo.title || "Photography"}
              width={1600}
              height={1067}
              className="w-full h-auto max-h-[70vh] object-contain rounded-2xl"
              sizes="90vw"
              priority
              quality={100}
              unoptimized
            />
          </motion.div>

          {/* Metadata panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-8 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div>
              {photo.title && (
                <h3 className="font-display text-lg text-on-surface">
                  {photo.title}
                </h3>
              )}
              {photo.caption && (
                <p className="mt-1 font-body text-xs text-on-surface-variant">
                  {photo.caption}
                </p>
              )}
            </div>

            {exif.length > 0 && (
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {exif.map((item, i) => (
                  <span
                    key={i}
                    className="font-body text-[10px] uppercase tracking-[0.15em] text-on-surface-variant"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
