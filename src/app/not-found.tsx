import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-start justify-center px-6 md:px-12 lg:px-20">
      <div className="max-w-[1600px] mx-auto w-full">
        <p className="font-body text-[10px] uppercase tracking-[0.35em] text-primary mb-6">
          404
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-on-surface">
          Lost in the
          <br />
          Wilderness
        </h1>
        <p className="mt-6 max-w-md font-body text-base leading-relaxed text-on-surface-variant">
          The page you&apos;re looking for doesn&apos;t exist. Perhaps it was
          moved, or the trail has shifted.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-3 font-body text-xs uppercase tracking-[0.2em] text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="square" d="M15 19l-7-7 7-7" />
          </svg>
          Return Home
        </Link>
      </div>
    </div>
  );
}
