import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LocationCard } from "@/components/locations/LocationCard";
import { getLocationsData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Locations",
  description: "Explore photography collections from across the American West.",
};

export const revalidate = 3600;

export default async function LocationsPage() {
  const locations = await getLocationsData();

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
        <Breadcrumb items={[{ label: "Locations" }]} />

        <div className="mb-20">
          <p className="font-body text-[10px] uppercase tracking-[0.35em] text-primary mb-6">
            All Collections
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-on-surface">
            Locations
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {locations.map((location, i) => (
            <LocationCard key={location.id} location={location} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
