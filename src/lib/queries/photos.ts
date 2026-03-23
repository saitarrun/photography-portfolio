import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Photo } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getPhotosByLocation(
  client: Client,
  locationId: string
): Promise<Photo[]> {
  const { data, error } = await client
    .from("photos")
    .select("*")
    .eq("location_id", locationId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as Photo[];
}

export async function getFeaturedPhotos(client: Client): Promise<Photo[]> {
  const { data, error } = await client
    .from("photos")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) throw error;
  return (data ?? []) as unknown as Photo[];
}

export async function getPhotoById(
  client: Client,
  id: string
): Promise<Photo | null> {
  const { data, error } = await client
    .from("photos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as unknown as Photo;
}

export async function getPhotoCountByLocation(
  client: Client,
  locationId: string
): Promise<number> {
  const { count, error } = await client
    .from("photos")
    .select("*", { count: "exact", head: true })
    .eq("location_id", locationId);

  if (error) throw error;
  return count ?? 0;
}
