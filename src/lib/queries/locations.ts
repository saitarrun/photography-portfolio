import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Location } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getLocations(client: Client): Promise<Location[]> {
  const { data, error } = await client
    .from("locations")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as Location[];
}

export async function getFeaturedLocations(client: Client): Promise<Location[]> {
  const { data, error } = await client
    .from("locations")
    .select("*")
    .eq("featured", true)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as Location[];
}

export async function getLocationBySlug(
  client: Client,
  slug: string
): Promise<Location | null> {
  const { data, error } = await client
    .from("locations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as unknown as Location;
}

export async function getLocationById(
  client: Client,
  id: string
): Promise<Location | null> {
  const { data, error } = await client
    .from("locations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as unknown as Location;
}

export async function getLocationsWithPhotoCount(
  client: Client
): Promise<(Location & { photo_count: number })[]> {
  const { data, error } = await client
    .from("locations")
    .select("*, photos(count)")
    .order("display_order", { ascending: true });

  if (error) throw error;

  return ((data ?? []) as unknown as (Location & { photos: { count: number }[] })[]).map(
    (loc) => {
      const { photos: photosAgg, ...rest } = loc;
      return { ...rest, photo_count: photosAgg?.[0]?.count ?? 0 };
    }
  );
}
