import { SEED_LOCATIONS, SEED_PHOTOS, SEED_PROFILE } from "./seed";
import type { Location, Photo, PhotographerProfile } from "@/types/database";

// Check if Supabase is configured with real credentials
const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("your-anon-key");

async function getSupabaseClient(isStatic = false) {
  if (!isSupabaseConfigured) return null;
  const { createClient, createStaticClient } = await import("@/lib/supabase/server");
  return isStatic ? createStaticClient() : createClient();
}

export async function getLocationsData(): Promise<
  (Location & { photo_count: number })[]
> {
  const client = await getSupabaseClient(true);
  if (!client) return SEED_LOCATIONS;

  const { getLocationsWithPhotoCount } = await import(
    "@/lib/queries/locations"
  );
  return getLocationsWithPhotoCount(client);
}

export async function getLocationBySlugData(
  slug: string
): Promise<Location | null> {
  const client = await getSupabaseClient(true);
  if (!client) {
    return SEED_LOCATIONS.find((l) => l.slug === slug) ?? null;
  }

  const { getLocationBySlug } = await import("@/lib/queries/locations");
  return getLocationBySlug(client, slug);
}

export async function getPhotosByLocationSlug(
  slug: string,
  locationId?: string
): Promise<Photo[]> {
  const client = await getSupabaseClient(true);
  if (!client) {
    return SEED_PHOTOS[slug] ?? [];
  }

  if (!locationId) return [];
  const { getPhotosByLocation } = await import("@/lib/queries/photos");
  return getPhotosByLocation(client, locationId);
}

export async function getProfileData(): Promise<PhotographerProfile | null> {
  const client = await getSupabaseClient(true);
  if (!client) return SEED_PROFILE;

  const { getProfile } = await import("@/lib/queries/profile");
  return getProfile(client);
}

export async function getAllLocationSlugs(): Promise<string[]> {
  const client = await getSupabaseClient(true);
  if (!client) return SEED_LOCATIONS.map((l) => l.slug);

  const { getLocations } = await import("@/lib/queries/locations");
  const locations = await getLocations(client);
  return locations.map((l) => l.slug);
}
