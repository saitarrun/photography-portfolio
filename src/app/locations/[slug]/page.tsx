import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LocationHero } from "@/components/locations/LocationHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import {
  getLocationBySlugData,
  getPhotosByLocationSlug,
  getAllLocationSlugs,
} from "@/lib/data";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllLocationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationBySlugData(slug);
  if (!location) return { title: "Not Found" };

  return {
    title: location.name,
    description:
      location.short_description || `Photography from ${location.name}`,
    openGraph: {
      title: `${location.name} | The Obsidian Gallery`,
      description:
        location.short_description || `Photography from ${location.name}`,
      images: location.cover_image_url
        ? [{ url: location.cover_image_url }]
        : undefined,
    },
  };
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = await getLocationBySlugData(slug);

  if (!location) notFound();

  const photos = await getPhotosByLocationSlug(slug, location.id);

  return (
    <>
      <LocationHero
        name={location.name}
        description={location.short_description}
        coverImage={location.cover_image_url}
      />

      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <Breadcrumb
          items={[
            { label: "Locations", href: "/locations" },
            { label: location.name },
          ]}
        />

        {/* Long description / story */}
        {location.long_description && (
          <div className="mb-20 md:mb-28 max-w-2xl">
            {location.long_description.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="mb-6 font-body text-sm md:text-base leading-[1.8] text-on-surface-variant"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Gallery */}
        <GalleryGrid photos={photos} />

        {/* Back to locations */}
        <div className="mt-20 md:mt-32">
          <a
            href="/locations"
            className="group inline-flex items-center gap-3 font-body text-xs uppercase tracking-[0.2em] text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="square" d="M15 19l-7-7 7-7" />
            </svg>
            All Locations
          </a>
        </div>
      </div>
    </>
  );
}
