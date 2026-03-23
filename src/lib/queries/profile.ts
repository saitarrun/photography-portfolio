import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, PhotographerProfile } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getProfile(
  client: Client
): Promise<PhotographerProfile | null> {
  const { data, error } = await client
    .from("photographer_profile")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as unknown as PhotographerProfile;
}
