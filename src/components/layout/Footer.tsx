"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface-low">
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 lg:px-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          {/* Brand */}
          <div>
            <span className="font-display text-sm uppercase tracking-[0.3em] text-on-surface">
              The Obsidian Gallery
            </span>
            <p className="mt-4 max-w-xs font-body text-xs leading-relaxed text-on-surface-variant">
              Cinematic street, nature, and landscapes — capturing the raw
              geometry of the earth.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-10">
            <div className="flex flex-col gap-3">
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                Navigate
              </span>
              <Link
                href="/#work"
                className="font-body text-xs text-on-surface-variant transition-colors hover:text-on-surface"
              >
                Work
              </Link>
              <Link
                href="/#about"
                className="font-body text-xs text-on-surface-variant transition-colors hover:text-on-surface"
              >
                About
              </Link>
              <Link
                href="/#contact"
                className="font-body text-xs text-on-surface-variant transition-colors hover:text-on-surface"
              >
                Contact
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                Social
              </span>
              <a
                href="#"
                className="font-body text-xs text-on-surface-variant transition-colors hover:text-on-surface"
              >
                Instagram
              </a>
              <a
                href="#"
                className="font-body text-xs text-on-surface-variant transition-colors hover:text-on-surface"
              >
                YouTube
              </a>
              <a
                href="#"
                className="font-body text-xs text-on-surface-variant transition-colors hover:text-on-surface"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="font-body text-[10px] uppercase tracking-[0.15em] text-outline-variant">
            &copy; {new Date().getFullYear()} The Obsidian Gallery. All rights
            reserved.
          </p>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="font-body text-[10px] uppercase tracking-[0.2em] text-on-surface-variant transition-colors hover:text-primary"
          >
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
